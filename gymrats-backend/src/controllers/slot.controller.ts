import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";

import {
  ISlot,
  ISlotCreationRequest,
  ISlotUpdateRequest,
} from "../models/slot";

import {
  SqlError,
  isSqlError,
  isValidIsoDate,
} from "../models/errorHandlingHelpers";

import { StatusCodes, getReasonPhrase } from "http-status-codes";

export const slotCreate = async (req: Request, res: Response) => {
  try {
    const body = req.body as ISlotCreationRequest;

    if (!body.program_id || !body.start || !body.end) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one of the required parameters in the request body: program_id, start, end `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    const { program_id, start, end } = body;

    const parsedStartDate = new Date(start);
    const parsedEndDate = new Date(end);
    const currentDate = new Date();
    const twoHoursLater = new Date(
      currentDate.getTime() + (2 * 60 * 60 * 1000 - 60 * 1000)
    );

    if (
      isNaN(parsedStartDate.getTime()) ||
      isNaN(parsedEndDate.getTime()) ||
      parsedStartDate >= parsedEndDate ||
      parsedStartDate <= twoHoursLater
    ) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid date in start or end parameter\nOr start date is before 2 hours from now\nOr start date is after end date`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    if (!isValidIsoDate(start) || !isValidIsoDate(end)) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid date format in start or end parameter. Use full ISO date format.`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    await createSlot(program_id, parsedStartDate, parsedEndDate);

    res
      .status(StatusCodes.CREATED)
      .send(
        `${getReasonPhrase(
          StatusCodes.CREATED
        )}\nSlot Successfully created and added to program with start date ${start} and end date ${end}`
      );
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
export const getSlotById = async (req: Request, res: Response) => {
  try {
    const body = req.body as ISlot;
    if (!body.id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter: id`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { id } = body;

    const slot = await getSpecificSlotById(id);
    if (!slot) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nSlot not found with the given id: ${id}`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.status(StatusCodes.OK).send(slot);
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
export const getSlotsByProgramId = async (req: Request, res: Response) => {
  try {
    const body = req.body as ISlot;

    if (!body.program_id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter: program_id`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.program_id <= 0) {
      res
        .send(
          `
        ${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid program_id: ${
            body.program_id
          }. It should be a positive integer.`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    const { program_id } = body;

    const programSlots = await getSlotsByProgramID(program_id);

    if (!programSlots) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nNo slots found for the specified program_id: ${program_id}`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }

    res.send(programSlots).status(StatusCodes.OK);
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
export const getAllSlots = async (req: Request, res: Response) => {
  try {
    const programSlots = await getSlots();
    if (!programSlots) {
      res
        .send(
          `There are no slots in the database\n${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.send(programSlots).status(StatusCodes.OK);
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
export const updateSlot = async (req: Request, res: Response) => {
  try {
    const body = req.body as ISlotUpdateRequest;

    if (
      !body.id ||
      !body.program_id ||
      !body.seats_available ||
      !body.start ||
      !body.end
    ) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one required parameter of the following: id, program_id, seats_available, start, end`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { id, program_id, seats_available, start, end } = body;

    if (seats_available < 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nSeats available can't be less than 0`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    const parsedStartDate = new Date(start);
    const parsedEndDate = new Date(end);
    const currentDate = new Date();
    const twoHoursLater = new Date(
      currentDate.getTime() + 2 * 60 * 60 * 1000 - 1 * 60 * 1000
    );

    if (
      isNaN(parsedStartDate.getTime()) ||
      isNaN(parsedEndDate.getTime()) ||
      parsedStartDate >= parsedEndDate ||
      parsedStartDate < twoHoursLater
    ) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid date in start or end parameter\nOr start date is before 2 hours from now\nOr start date is after end date`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    if (!isValidIsoDate(start) || !isValidIsoDate(end)) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid date format in start or end parameter. Use full ISO date format.`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    await updateSlotById(
      id,
      program_id,
      seats_available,
      parsedStartDate,
      parsedEndDate
    );

    res
      .send(
        `${getReasonPhrase(
          StatusCodes.OK
        )}\nSlot Successfully updated with new seats available: ${seats_available} and new start date: ${start} and new end date: ${end}`
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
export const slotDeleteById = async (req: Request, res: Response) => {
  try {
    const body = req.body as ISlot;
    if (!body.id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter 'id' in the request body`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { id } = body;
    await deleteSlotById(id);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nSlot Successfully deleted with id: ${id}}`
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

export const deleteAllSlots = async (req: Request, res: Response) => {
  try {
    await slotsDelete();
    res
      .send(
        `${getReasonPhrase(StatusCodes.NO_CONTENT)}\nSlots Successfully deleted`
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

async function createSlot(
  program_id: ISlot["program_id"],
  start: ISlot["start"],
  end: ISlot["end"]
) {
  // @ts-ignore
  await sqlPool.query<ISlot>("CALL sp_CreateSlot(?,?,?)", [
    program_id,
    start,
    end,
  ]);
}

export async function getSpecificSlotById(id: ISlot["id"]) {
  // @ts-ignore
  const [rows] = await sqlPool.query<ISlot[]>("CALL sp_GetSlotByID(?)", [id]);
  //@ts-ignore
  return rows[0][0];
}

async function getSlotsByProgramID(id: ISlot["program_id"]) {
  // @ts-ignore
  const [rows] = await sqlPool.query<ISlot[]>(
    "CALL sp_GetSlotsByProgramID(?)",
    [id]
  );
  return rows[0];
}
async function getSlots() {
  // @ts-ignore
  const [rows] = await sqlPool.query<ISlot[]>("CALL sp_GetSlots()");
  return rows[0];
}
async function updateSlotById(
  id: ISlot["id"],
  program_id: ISlot["program_id"],
  seats_available: ISlot["seats_available"],
  start: ISlot["start"],
  end: ISlot["end"]
) {
  // @ts-ignore
  await sqlPool.query<ISlot>("CALL sp_UpdateSlotByID(?,?,?,?,?)", [
    id,
    program_id,
    seats_available,
    start,
    end,
  ]);
}

async function deleteSlotById(id: ISlot["id"]) {
  // @ts-ignore
  await sqlPool.query<ISlot>("CALL sp_DeleteSlotByID(?)", [id]);
}

async function slotsDelete() {
  // @ts-ignore
  await sqlPool.query<ISlot[]>("CALL sp_DeleteAllSlots()");
}
