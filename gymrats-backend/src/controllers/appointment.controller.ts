import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import {
  IAppointment,
  IAppointmentCreationRequest,
} from "../models/appointment";
import { IUser } from "../models/user";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { SqlError, isSqlError } from "../models/errorHandlingHelpers";
import { getUserByID } from "./user.controller";
import { getSpecificSlotById } from "./slot.controller";

export const appointmentCreate = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAppointmentCreationRequest;
    if (!body.user_id || !body.slot_id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one of the required parameters in the request body: 'user_id', 'slot_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.user_id <= 0 || body.slot_id <= 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid parameters in the request body: 'user_id', 'slot_id' \n(They should be positive integers)`
        )
        .status(StatusCodes.BAD_REQUEST);
    }

    const { user_id, slot_id } = body;
    const user = await getUserByID(user_id);
    if (!user) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send(`User with ID ${user_id} not found`);
      return;
    }

    const slot = await getSpecificSlotById(slot_id);
    if (!slot) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nSlot with ID ${slot_id} not found`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }

    if (slot.seats_available <= 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.CONFLICT
          )}\nNo seats available for this slot with id ${slot_id}`
        )
        .status(StatusCodes.CONFLICT);
      return;
    }
    const appointment = await checkIfUserHasAlreadyBookedForASpecificSlot(
      user_id,
      slot_id
    );

    if (appointment) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.CONFLICT
          )}\nUser has already booked for this slot that starts at ${
            slot.start
          }\n Cannot book again try maybe another slot`
        )
        .status(StatusCodes.CONFLICT);
      return;
    }

    await createAppointment(user_id, slot_id);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.CREATED
        )}\nAppointment Successfullly created of user ${
          user.username
        } for the slot time ${slot.start}`
      )
      .status(StatusCodes.CREATED);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};

async function createAppointment(
  user_id: IAppointment["user_id"],
  slot_id: IAppointment["slot_id"]
) {
  // @ts-ignore
  await sqlPool.query<ISlot>("CALL sp_CreateAppointment(?,?)", [
    user_id,
    slot_id,
  ]);
}

async function checkIfUserHasAlreadyBookedForASpecificSlot(
  user_id: IAppointment["user_id"],
  slot_id: IAppointment["slot_id"]
) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAppointment[]>(
    `CALL sp_CheckIfUserHasAlreadyOneAppointmentActiveForASlot(?,?)`,
    [user_id, slot_id]
  );
  // @ts-ignore
  return rows[0][0];
}
