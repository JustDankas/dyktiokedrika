import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import {
  IAppointment,
  IAppointmentCreationRequest,
} from "../models/appointment";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { SqlError, isSqlError } from "../models/errorHandlingHelpers";
import { getUserByID } from "./user.controller";
import { getSpecificSlotById } from "./slot.controller";

export const appointmentCreate = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const body = req.body as IAppointmentCreationRequest;
    if (!body.user_id || !body.slot_id) {
      res.status(StatusCodes.BAD_REQUEST).json(
        `${getReasonPhrase(StatusCodes.BAD_REQUEST)}!
          Missing at least one of the required parameters in the request body: 'user_id', 'slot_id'.`
      );

      return;
    }
    if (body.user_id <= 0 || body.slot_id <= 0) {
      res.status(StatusCodes.BAD_REQUEST).json(
        `${getReasonPhrase(StatusCodes.BAD_REQUEST)}!
          Invalid parameters in the request body: 'user_id', 'slot_id' \n(They should be positive integers)`
      );
    }

    const { user_id, slot_id } = body;
    const user = await getUserByID(user_id);
    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json(`${getReasonPhrase(
        StatusCodes.NOT_FOUND
      )}!
        User with ID ${user_id} not found`);
      return;
    }

    const slot = await getSpecificSlotById(slot_id);
    if (!slot) {
      res.status(StatusCodes.NOT_FOUND).json(
        `${getReasonPhrase(StatusCodes.NOT_FOUND)}!
          Slot with ID ${slot_id} not found`
      );
      return;
    }

    if (now.getTime() >= slot.start.getTime()) {
      if (now.getTime() <= slot.end.getTime()) {
        res.status(StatusCodes.BAD_REQUEST).json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}!
                Cannot make an appointment now since the slot has already started at ${
                  slot.start
                }`
        );
      }
      res.status(StatusCodes.BAD_REQUEST).json(
        `${getReasonPhrase(StatusCodes.BAD_REQUEST)}!
        Cannot make an appointment now since the slot has already ended at ${
          slot.end
        }`
      );
      return;
    }

    if (slot.seats_available <= 0) {
      res.status(StatusCodes.CONFLICT).json(
        `${getReasonPhrase(StatusCodes.CONFLICT)}!
          No seats available for this slot with id ${slot_id}`
      );
      return;
    }
    const alreadyBookedAppointment =
      await checkIfUserHasAlreadyBookedForASpecificSlot(user_id, slot_id);

    if (alreadyBookedAppointment) {
      res.status(StatusCodes.CONFLICT).json(
        `${getReasonPhrase(StatusCodes.CONFLICT)}!
          User has already booked for this slot that
          starts at ${slot.start} and ends at ${slot.end}.
          Cannot book again the same slot, try maybe another slot`
      );
      return;
    }
    const oldest_of_the_two = true;
    const hasAlreadyCancelledAppointmentTwiceThisWeek =
      await checkifUserHasAlreadyCancelledTwiceThisWeek(
        user_id,
        oldest_of_the_two
      );
    if (hasAlreadyCancelledAppointmentTwiceThisWeek) {
      const dateWhenUserCanMakeAnAppointmentAgain = new Date(
        hasAlreadyCancelledAppointmentTwiceThisWeek.cancelled_on.getTime() +
          7 * 24 * 60 * 60 * 1000
      );

      res
        .json(
          `User ${user.username} has already cancelled two appointments this week!
          They can make an appointment again in ${dateWhenUserCanMakeAnAppointmentAgain}!`
        )
        .status(StatusCodes.CONFLICT);
      return;
    }

    await createAppointment(user_id, slot_id);
    res
      .json(
        `${getReasonPhrase(
          StatusCodes.CREATED
        )}\nAppointment Successfully created of user ${
          user.username
        } for the slot time ${slot.start} to ${slot.end}`
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
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};

export const appointmentCancelById = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const body = req.body as IAppointment;
    if (!body.id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing one required parameter in the request body: 'id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.id <= 0) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid parameter in the request body: 'id'\n(Id should be a positive integer)`
        )
        .status(StatusCodes.BAD_REQUEST);
    }

    const { id } = body;

    const appointment = await getSpecificAppointmentByID(id);

    if (!appointment) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nAppointment not found with id: ${id}`
        )
        .status(StatusCodes.NOT_FOUND);
    }
    if (appointment.cancelled) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.CONFLICT
          )}\nAppointment is already cancelled`
        )
        .status(StatusCodes.CONFLICT);
      return;
    }
    const slot = await getSpecificSlotById(appointment.slot_id);
    if (!slot) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.NOT_FOUND)}\nSlot not found with id: ${
            appointment.slot_id
          }.\nIt has been deleted so there is no need to cancel it`
        )
        .status(StatusCodes.NOT_FOUND);
    }

    const twoHoursBeforeAppointmentDate = new Date(
      slot.start.getTime() - (1 * 60 * 60 * 1000 + 59 * 60 * 1000 + 58 * 1000)
    );
    if (currentDate > twoHoursBeforeAppointmentDate) {
      if (currentDate > slot.start) {
        res
          .json(
            `${getReasonPhrase(
              StatusCodes.CONFLICT
            )}\nCannot cancel an appointment in after 2 hours before the start of the slot\nThe slot started at ${
              slot.start
            }\nand when you tried to cancel your appointment it was ${currentDate}`
          )
          .status(StatusCodes.CONFLICT);
        return;
      }
      const now = new Date();
      const timeLeft = slot.start.getTime() - now.getTime();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
      const seconds = Math.floor((timeLeft / 1000) % 60);
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.CONFLICT
          )}\nCannot cancel an appointment in less than 2 hours before the start of the slot\nThe slot starts at ${
            slot.start
          }\nand when you tried to cancel your appointment it was ${currentDate}.\nMaybe you can still make it\nYou have ${hours} hours, ${minutes} minutes, ${seconds} seconds ! Hurry up!`
        )
        .status(StatusCodes.CONFLICT);
      return;
    }

    await cancelAppointmentByID(id);
    res
      .json(
        `${getReasonPhrase(
          StatusCodes.OK
        )}\nAppointment Successfully cancelled for the slot time ${
          slot.start
        } to ${slot.end}`
      )
      .status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};

export const appointmentsCancelBySlotId = async (
  req: Request,
  res: Response
) => {
  try {
    const currentDate = new Date();
    const body = req.body as IAppointment;
    if (!body.slot_id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing one required parameter in the request body: 'slot_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (isNaN(body.slot_id) || body.slot_id <= 0) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid parameter in the request body: 'slot_id'\n(Id should be a positive integer)`
        )
        .status(StatusCodes.BAD_REQUEST);
    }

    const { slot_id } = body;
    const get_all = false;
    const inactive = false;
    const activeAppointmentsOfSlotId = await getAppointmentsBySlotID(
      slot_id,
      get_all,
      inactive
    );

    if (!activeAppointmentsOfSlotId) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nNo active appointments to cancel found for slot with id: ${slot_id}`
        )
        .status(StatusCodes.NOT_FOUND);
    }

    const slot = await getSpecificSlotById(
      //@ts-ignore
      activeAppointmentsOfSlotId[0].slot_id
    );

    const fortyFiveMinutesBeforeAppointmentDate = new Date(
      slot.start.getTime() - 45 * 60 * 1000
    );
    if (currentDate > fortyFiveMinutesBeforeAppointmentDate) {
      if (slot.start <= currentDate <= slot.end) {
        res
          .json(
            `${getReasonPhrase(
              StatusCodes.CONFLICT
            )}\nCannot cancel the appointments since the slot has already started\nThe slot started at ${
              slot.start
            }\nand when you tried to cancel the appointments for that slot it was ${currentDate}`
          )
          .status(StatusCodes.CONFLICT);
        return;
      } else if (currentDate >= slot.end) {
        res
          .json(
            `${getReasonPhrase(
              StatusCodes.CONFLICT
            )}\nCannot cancel the appointments since the slot has already finished\nThe slot started at ${
              slot.start
            }\nand when you tried to cancel the appointments for that slot it was ${currentDate}`
          )
          .status(StatusCodes.CONFLICT);
        return;
      } else {
        const now = new Date();
        const timeLeft = slot.start.getTime() - now.getTime();
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        res
          .json(
            `${getReasonPhrase(
              StatusCodes.CONFLICT
            )}\nCannot cancel the appointments since the slot will start in less than 45 minutesn\nand the users need to be notified at least 45 minutes before the slot's start\nThe slot starts at ${
              slot.start
            }\nand when you tried to cancel the appointments for that slot it was ${currentDate}\nThe slot starts at ${hours} hours, ${minutes} minutes, ${seconds} seconds ! Hurry up!`
          )
          .status(StatusCodes.CONFLICT);
        return;
      }
    }
    await cancelAppointmentsBySlotID(slot_id);
    //@ts-ignore
    const affectedUsers = activeAppointmentsOfSlotId.map(
      //@ts-ignore
      (appointment) => appointment.user_id
    );
    res
      .json(
        `${getReasonPhrase(
          StatusCodes.OK
        )}\nAppointments Successfully cancelled for the slot time ${
          slot.start
        } to ${slot.end}\nUsers to be notified: ${affectedUsers}`
      )
      .status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAppointment;
    if (!body.id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.id <= 0) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid id ${
            body.id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { id } = body;

    const appointment = await getSpecificAppointmentByID(id);
    if (!appointment) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nAppointment not found with id: ${id}`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointment).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};

export const getAppointmentsBySlotId = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAppointment;
    if (!body.slot_id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'slot_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.slot_id <= 0) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid slot_id ${
            body.slot_id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { slot_id } = body;
    const get_all = true;
    const appointment = await getAppointmentsBySlotID(slot_id, get_all);
    if (!appointment) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nThere are no appointments yet for slot with id: ${slot_id} or they have been removed due to inactivity`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointment).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};

export const getInactiveAppointmentsBySlotId = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body as IAppointment;
    if (!body.slot_id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'slot_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.slot_id <= 0) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid slot_id ${
            body.slot_id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { slot_id } = body;
    const get_all = false;
    const inactive = true;
    const appointment = await getAppointmentsBySlotID(
      slot_id,
      get_all,
      inactive
    );
    if (!appointment) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nThere are no inactive appointments yet for slot with id: ${slot_id} or they have been removed due to inactivity`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointment).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};
export const getActiveAppointmentsBySlotId = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body as IAppointment;
    if (!body.slot_id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'slot_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.slot_id <= 0) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid slot_id ${
            body.slot_id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { slot_id } = body;
    const get_all = false;
    const inactive = false;
    const appointment = await getAppointmentsBySlotID(
      slot_id,
      get_all,
      inactive
    );
    if (!appointment) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nThere are no active appointments yet for slot with id: ${slot_id} or they have been removed due to inactivity`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointment).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};

export const getAppointmentsByUserId = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAppointment;
    if (!body.user_id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'user_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.user_id <= 0) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid user_id ${
            body.user_id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { user_id } = body;
    const get_all = true;
    const appointment = await getAppointmentsByUserID(user_id, get_all);
    if (!appointment) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nThere are no appointments yet for user with id: ${user_id} or they have been removed due to inactivity`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointment).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};
export const getActiveAppointmentsByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body as IAppointment;
    if (!body.user_id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'user_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.user_id <= 0) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid user_id ${
            body.user_id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { user_id } = body;
    const get_all = true;
    const inactive = false;
    const appointment = await getAppointmentsByUserID(
      user_id,
      get_all,
      inactive
    );
    if (!appointment) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nThere are no appointments yet for user with id: ${user_id} or they have been removed due to inactivity`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointment).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};
export const getInactiveAppointmentsByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body as IAppointment;
    if (!body.user_id) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'user_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.user_id <= 0) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid user_id ${
            body.user_id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { user_id } = body;
    const get_all = true;
    const inactive = true;
    const appointment = await getAppointmentsByUserID(
      user_id,
      get_all,
      inactive
    );
    if (!appointment) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nThere are no inactive appointments yet for user with id: ${user_id} or they have been removed due to inactivity`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointment).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const get_all = true;
    const appointmentList = await getAppointments(get_all);
    if (!appointmentList) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nNo appointments found in the database`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointmentList).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};
export const getAllInactiveAppointments = async (
  req: Request,
  res: Response
) => {
  try {
    const get_all = false;
    const inactive = true;
    const appointmentList = await getAppointments(get_all, inactive);
    if (!appointmentList) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nNo inactive appointments found in the database`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointmentList).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};
export const getAllActiveAppointments = async (req: Request, res: Response) => {
  try {
    const get_all = false;
    const inactive = false;
    const appointmentList = await getAppointments(get_all, inactive);
    if (!appointmentList) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nNo active appointments found in the database`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.json(appointmentList).status(StatusCodes.OK);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    }
  }
};
export const deleteAppointmentsThatAreOlderThanXdays = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body;
    if (!body.days) {
      res
        .json(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'days' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    if (isNaN(body.days) || body.days <= 0) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid days ${
            body.days
          }. Days should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    if (body.days < 182) {
      res
        .json(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid days ${
            body.days
          }. Days should be at least more than 6 months (182 days)`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    const { days } = body;
    await deleteAppointmentsThatAreOlderThanXDays(days);
    res
      .json(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nAppointments older than ${days} days successfully deleted`
      )
      .status(StatusCodes.NO_CONTENT);
    return;
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
      return;
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
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

async function checkifUserHasAlreadyCancelledTwiceThisWeek(
  user_id: IAppointment["user_id"],
  oldest_of_the_two: Boolean = false
) {
  //@ts-ignore
  const [rows] = await sqlPool.query<IAppointment[]>(
    `CALL sp_CheckIfUserHasAlreadyCancelledTwoAppointmentsInTheSameWeek(?,?)`,
    [user_id, oldest_of_the_two]
  );
  //@ts-ignore
  return rows[0][0];
}

async function getSpecificAppointmentByID(id: IAppointment["id"]) {
  //@ts-ignore
  const [rows] = await sqlPool.query<IAppointment[]>(
    `CALL sp_GetAppointmentByID(?)`,
    [id]
  );
  //@ts-ignore
  return rows[0][0];
}

async function getAppointments(
  get_all: Boolean = true,
  inactive: Boolean = false
) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAppointment[]>(
    "CALL sp_GetAppointments(?,?)",
    [get_all, inactive]
  );
  return rows[0];
}

async function getAppointmentsBySlotID(
  slot_id: IAppointment["slot_id"],
  get_all: Boolean = true,
  inactive: Boolean = false
) {
  // @ts-ignore
  const [rows] = await await sqlPool.query<IAppointment[]>(
    `CALL sp_GetAppointmentsBySlotID(?,?,?)`,
    [slot_id, get_all, inactive]
  );
  return rows[0];
}

async function getAppointmentsByUserID(
  slot_id: IAppointment["slot_id"],
  get_all: Boolean = true,
  inactive: Boolean = false
) {
  // @ts-ignore
  const [rows] = await await sqlPool.query<IAppointment[]>(
    `CALL sp_GetAppointmentByUserID(?,?,?)`,
    [slot_id, get_all, inactive]
  );
  return rows[0];
}

async function cancelAppointmentByID(id: IAppointment["id"]) {
  // @ts-ignore
  await sqlPool.query<IAppointment[]>("CALL sp_CancelAppointmentByID(?)", [id]);
}

async function cancelAppointmentsBySlotID(slot_id: IAppointment["slot_id"]) {
  // @ts-ignore
  await sqlPool.query<IAppointment[]>("CALL sp_CancelAppointmentsBySlotID(?)", [
    slot_id,
  ]);
}

async function deleteAppointmentsThatAreOlderThanXDays(days: number = 183) {
  // @ts-ignore
  await sqlPool.query<IAppointment[]>(
    "CALL sp_DeleteAppointmentsThatAreXDaysOld(?)",
    [days]
  );
}
