import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IProgram, IProgramCreationRequest } from "../models/program";
import { IUser } from "../models/user";

export const programCreate = async (req: Request, res: Response) => {
  try {
    const body = req.body as IProgramCreationRequest;
    const { trainer_id, title, description, type, price, is_group, max_size } =
      body;

    try {
      // @ts-ignore
      const userRole = await sqlPool.query<IUser["role"]>(
        `SELECT role FROM user WHERE id = ? LIMIT 1`,
        [trainer_id]
      );

      if (userRole[0] !== "trainer") {
        res.status(400).send("User that was provided is not a trainer");
        return;
      }
    } catch (getError) {
      console.log(getError);
      res.send("Internal Server Error").status(500);
      return;
    }
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.status(400).send("Invalid fields in the request form");
    return;
  }

  try {
    await createProgram(req.body);
    res.status(200).send("Program Successfully created");
    return;
  } catch (createError) {
    console.log(createError);
    res.status(500).send("Internal Server Error");
    return;
  }
};
export const getProgramById = async (
  req: Request<IProgram["id"]>,
  res: Response
) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const program = await getSpecificProgramById(req.body);
    res.send(program).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const getAllPrograms = async (req: Request, res: Response) => {
  try {
    const programList = await getPrograms();
    res.send(programList).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const updateProgram = async (req: Request<IProgram>, res: Response) => {
  try {
    const { trainer_id, title, description, type, price, is_group, max_size } =
      req.body;

    try {
      // @ts-ignore
      const userRole = await sqlPool.query<IUser["role"]>(
        `SELECT role FROM user WHERE id = ? LIMIT 1`,
        [trainer_id]
      );

      if (userRole[0] !== "trainer") {
        res.status(400).send("User that was provided is not a trainer");
        return;
      }
    } catch (getError) {
      console.log(getError);
      res.send("Internal Server Error").status(500);
      return;
    }
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.status(400).send("Invalid fields in the request form");
    return;
  }
  try {
    await updateProgramById(req.body);
    res.send("Program Successfully updated").status(200);
    return;
  } catch (updateError) {
    console.log(updateError);
    res.send("Internal Server Error").status(500);
  }
};
export const programDeleteById = async (
  req: Request<IProgram["id"]>,
  res: Response
) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await deleteProgramById(req.body);
    res.send("Program Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
  }
};

export const deleteAllPrograms = async (req: Request, res: Response) => {
  try {
    await programsDelete();
    res.send("All Programs Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
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
}: IProgramCreationRequest) {
  // @ts-ignore
  await sqlPool.query<IProgram>("CALL sp_CreateProgram(?,?,?,?,?,?,?)", [
    trainer_id,
    title,
    description,
    type,
    price,
    is_group,
    max_size,
  ]);
}

async function getSpecificProgramById(id: IProgram["id"]) {
  // @ts-ignore
  const [row] = await sqlPool.query<IProgram>("CALL sp_GetProgramByID(?)", [
    id,
  ]);
  return row;
}

async function getPrograms() {
  // @ts-ignore
  const [rows] = await sqlPool.query<IProgram[]>("CALL sp_GetPrograms()");
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
}: IProgram) {
  // @ts-ignore
  await sqlPool.query<IProgram>("CALL sp_UpdateProgramByID(?,?,?,?,?,?,?,?)", [
    id,
    trainer_id,
    title,
    description,
    type,
    price,
    is_group,
    max_size,
  ]);
}

async function deleteProgramById(id: IProgram["id"]) {
  // @ts-ignore
  await sqlPool.query<IProgram>("CALL sp_DeleteProgramByID(?)", [id]);
}

async function programsDelete() {
  // @ts-ignore
  await sqlPool.query<IProgram[]>("CALL sp_DeleteAllPrograms()");
}
