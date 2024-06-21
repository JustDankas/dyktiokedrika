import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import {
  IProgram,
  IProgramCreationRequest,
  IProgramTrainer,
} from "../models/program";
import { IUser } from "../models/user";
import { getSlotsQuery, getSpecificSlotById } from "./slot.controller";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { IAppointement } from "../models/appointment";
import { SqlError, isSqlError } from "../models/error-handling";

export const programCreate = async (
  req: Request<IProgramCreationRequest>,
  res: Response
) => {
  try {
    const {
      trainer_id,
      title,
      description,
      type,
      price,
      is_group,
      max_size,
      image,
    } = req.body;

    try {
      // @ts-ignore
      const userRole = await sqlPool.query<any>(
        `SELECT role FROM user WHERE id = ? LIMIT 1`,
        [Number(trainer_id)]
      );
      if (userRole[0][0].role !== "trainer") {
        res.status(400).json("User that was provided is not a trainer");
        return;
      } else {
        const newProgram = await createProgram(req.body);
        res.status(200).json("OK");
      }
    } catch (getError) {
      res.json("Internal Server Error").status(500);
      return;
    }
  } catch (deconstructionError) {
    res.status(400).json("Invalid fields in the request form");
    return;
  }
};

// export const createAppointment = async (req: Request, res: Response) => {
//   try {
//     const { id } = res.locals;
//     const { slot_id } = req.body;
//     const newAppointment = await createAppointmentQuery(
//       Number(id),
//       Number(slot_id)
//     );
//     if (newAppointment) {
//       res.status(200).json("OK");
//     } else {
//       throw new Error("Something went wrong");
//     }
//   } catch (error) {
//     console.log(error);
//     res.json("Internal Server Error").status(500);
//   }
// };
export const getProgramById = async (
  req: Request<IProgram["id"]>,
  res: Response
) => {
  try {
    const { id } = req.query;
  } catch (deconstructionError) {
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { id } = req.query;
    //@ts-ignore
    const [program] = await getSpecificProgramById(Number(id));
    res.json(program[0]).status(200);
    return;
  } catch (getError) {
    res.json("Internal Server Error").status(500);
    return;
  }
};
export const appointmentCreate = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const body = req.body;

    const { slot_id } = body;

    //@ts-ignore
    const [[slot]] = await getSpecificSlotById(slot_id);
    if (!slot) {
      res.status(StatusCodes.NOT_FOUND).json(
        `${getReasonPhrase(StatusCodes.NOT_FOUND)}!
          Slot with ID ${slot_id} not found`
      );
      return;
    }

    if (now.getTime() >= new Date(slot.start).getTime()) {
      if (now.getTime() <= new Date(slot.end).getTime()) {
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
      await checkIfUserHasAlreadyBookedForASpecificSlot(res.locals.id, slot_id);

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
        res.locals.id,
        oldest_of_the_two
      );
    if (hasAlreadyCancelledAppointmentTwiceThisWeek) {
      const dateWhenUserCanMakeAnAppointmentAgain = new Date(
        hasAlreadyCancelledAppointmentTwiceThisWeek.cancelled_on.getTime() +
          7 * 24 * 60 * 60 * 1000
      );

      res
        .json(
          `User has already cancelled two appointments this week!
          They can make an appointment again in ${dateWhenUserCanMakeAnAppointmentAgain}!`
        )
        .status(StatusCodes.CONFLICT);
      return;
    }

    await createAppointmentQuery(res.locals.id, slot_id);
    res
      .json(
        `${getReasonPhrase(
          StatusCodes.CREATED
        )}\nAppointment Successfully created for the slot time ${
          slot.start
        } to ${slot.end}`
      )
      .status(StatusCodes.CREATED);
    return;
  } catch (getError) {
    res.json("Internal Server Error").status(500);
    return;
  }
};

export const getProgramAndSlotBySlotId = async (
  req: Request,
  res: Response
) => {
  try {
    const { slotId } = req.query;
    const [data] = await getProgramAndSlotBySlotIdQuery(Number(slotId));
    res.status(200).json(data);
  } catch (error) {
    res.json("Internal Server Error").status(500);
  }
};

export const getAllPrograms = async (req: Request, res: Response) => {
  try {
    const programList = await getPrograms();
    const [slots] = await getSlotsQuery();
    programList.forEach((p) => {
      const _slots = (slots as any).filter((slot: any) => {
        return slot.program_id == p.id;
      });
      //@ts-ignore
      p["slots"] = _slots;
    });
    res.json(programList).status(200);
    return;
  } catch (getError) {
    res.json("Internal Server Error").status(500);
    return;
  }
};
export const getAllAppointmentsAndPrograms = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = res.locals;
    //@ts-ignore
    const [data] = await getAllAppointmentsAndProgramsByUserId(Number(id));
    res.json(data).status(200);
  } catch (error) {
    res.json("Internal Server Error").status(500);
  }
};
export const updateProgram = async (req: Request<IProgram>, res: Response) => {
  try {
    const {
      trainer_id,
      title,
      description,
      type,
      price,
      is_group,
      max_size,
      id,
      image,
    } = req.body;

    try {
      // @ts-ignore
      const [[{ role }]] = await sqlPool.query<IUser["role"]>(
        `SELECT role FROM user WHERE id = ? LIMIT 1`,
        [Number(trainer_id)]
      );
      if (role !== "trainer") {
        res.status(400).json("User that was provided is not a trainer");
        return;
      }
    } catch (getError) {
      res.json("Internal Server Error").status(500);
      return;
    }
  } catch (deconstructionError) {
    res.status(400).json("Invalid fields in the request form");
    return;
  }
  try {
    await updateProgramById(req.body);
    res.json("Program Successfully updated").status(200);
    return;
  } catch (updateError) {
    res.json("Internal Server Error").status(500);
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await cancelAppointmentQuery(Number(id));
    res.json("OK").status(200);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(sqlError.sqlMessage);
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

export const programDeleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
  } catch (deconstructionError) {
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { id } = req.query;
    await deleteProgramById(Number(id));
    res.json("Program Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    res.json("Internal Server Error").status(500);
  }
};

export const deleteAllPrograms = async (req: Request, res: Response) => {
  try {
    await programsDelete();
    res.json("All Programs Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    res.json("Internal Server Error").status(500);
  }
};

async function createProgram({
  trainer_id,
  title,
  description,
  type,
  price,
  is_group,
  max_size,
  image,
}: IProgramCreationRequest) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IProgram>(
    "CALL sp_CreateProgram(?,?,?,?,?,?,?,?)",
    [trainer_id, title, description, type, price, is_group, max_size, image]
  );
  return rows;
}

async function createAppointmentQuery(id: number, slotId: number) {
  const [rows] = await sqlPool.query(`CALL sp_CreateAppointment(?,?)`, [
    id,
    slotId,
  ]);
  return rows;
}

export async function getSpecificProgramById(id: IProgram["id"]) {
  // @ts-ignore
  const [row] = await sqlPool.query<IProgram>("CALL sp_GetProgramByID(?)", [
    id,
  ]);
  return row;
}

async function getPrograms() {
  // @ts-ignore
  const [rows] = await sqlPool.query<[(IProgram & IProgramTrainer)[], any]>(
    "CALL sp_GetPrograms()"
  );
  return rows[0];
}
async function getProgramAndSlotBySlotIdQuery(slotId: number) {
  // @ts-ignore
  const [rows] = await sqlPool.query<[(IProgram & IProgramTrainer)[], any]>(
    `CALL sp_GetProgramAndTrainerBySlotID(?)`,
    [slotId]
  );
  return rows[0];
}
async function getAllAppointmentsAndProgramsByUserId(id: number) {
  // @ts-ignore
  const [rows] = await sqlPool.query(
    `CALL sp_GetAppointmentsAndProgramsByUserId(?)`,
    [id]
  );
  return rows;
}

async function updateProgramById({
  id,
  trainer_id,
  title,
  description,
  type,
  price,
  is_group,
  max_size,
  image,
}: IProgram) {
  // @ts-ignore
  await sqlPool.query<IProgram>(
    "CALL sp_UpdateProgramByID(?,?,?,?,?,?,?,?,?)",
    [id, trainer_id, title, description, type, price, is_group, max_size, image]
  );
}

async function deleteProgramById(id: IProgram["id"]) {
  // @ts-ignore
  await sqlPool.query<IProgram>("CALL sp_DeleteProgramByID(?)", [id]);
}

async function programsDelete() {
  // @ts-ignore
  await sqlPool.query<IProgram[]>("CALL sp_DeleteAllPrograms()");
}
async function cancelAppointmentQuery(id: number) {
  // @ts-ignore
  await sqlPool.query<IProgram[]>("CALL sp_CancelAppointmentByID(?)", [id]);
}
async function checkifUserHasAlreadyCancelledTwiceThisWeek(
  user_id: IAppointement["user_id"],
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
async function checkIfUserHasAlreadyBookedForASpecificSlot(
  user_id: IAppointement["user_id"],
  slot_id: IAppointement["slot_id"]
) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAppointment[]>(
    `CALL sp_CheckIfUserHasAlreadyOneAppointmentActiveForASlot(?,?)`,
    [user_id, slot_id]
  );
  // @ts-ignore
  return rows[0][0];
}
