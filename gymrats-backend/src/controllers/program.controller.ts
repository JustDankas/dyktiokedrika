import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import {
  IProgram,
  IProgramCreationRequest,
  IProgramTrainer,
} from "../models/program";
import { IUser } from "../models/user";
import { ISlot } from "../models/slot";
import { getSlotsQuery } from "./slot.controller";

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
      console.log(getError);
      res.json("Internal Server Error").status(500);
      return;
    }
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.status(400).json("Invalid fields in the request form");
    return;
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = res.locals;
    const { slot_id } = req.body;
    const newAppointment = await createAppointmentQuery(
      Number(id),
      Number(slot_id)
    );
    if (newAppointment) {
      res.status(200).json("OK");
    } else {
      throw new Error("Something went wrong");
    }
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};
export const getProgramById = async (
  req: Request<IProgram["id"]>,
  res: Response
) => {
  try {
    const { id } = req.query;
  } catch (deconstructionError) {
    console.log(deconstructionError);
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
    console.log(getError);
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
    console.log(error);
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
    console.log(getError);
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
    console.log(error);
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
      console.log(getError);
      res.json("Internal Server Error").status(500);
      return;
    }
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.status(400).json("Invalid fields in the request form");
    return;
  }
  try {
    await updateProgramById(req.body);
    res.json("Program Successfully updated").status(200);
    return;
  } catch (updateError) {
    console.log(updateError);
    res.json("Internal Server Error").status(500);
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await cancelAppointmentQuery(Number(id));
    res.json("OK").status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};
export const programDeleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { id } = req.query;
    console.log(id);
    await deleteProgramById(Number(id));
    res.json("Program Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.json("Internal Server Error").status(500);
  }
};

export const deleteAllPrograms = async (req: Request, res: Response) => {
  try {
    await programsDelete();
    res.json("All Programs Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
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
