import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IProgram, IProgramCreationRequest } from "../models/program";
import { IUser } from "../models/user";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { SqlError, isSqlError } from "../models/errorHandlingHelpers";

export const programCreate = async (req: Request, res: Response) => {
  try {
    const body = req.body as IProgramCreationRequest;
    if (
      !body.trainer_id ||
      !body.title ||
      !body.description ||
      !body.type ||
      !body.price ||
      !body.is_group ||
      !body.max_size ||
      !body.image
    ) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one of the required parameters in the request body: 'trainer_id', 'title', 'description', 'type', 'price', 'is_group', 'max_size', 'image' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.trainer_id <= 0 || body.price < 0 || body.max_size <= 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nAt least one invalid parameter in the request body: 'trainer_id','max_size','price'\n(They should be positive integers or the price should at least be 0)`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const {
      trainer_id,
      title,
      description,
      type,
      price,
      is_group,
      max_size,
      image,
    } = body;

    // @ts-ignore
    const userRole = await sqlPool.query<IUser["role"]>(
      `SELECT role FROM user WHERE id = ? LIMIT 1`,
      [trainer_id]
    );

    if (!userRole[0][0]) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nUser that was provided with id: ${trainer_id} does not exist`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const trainer = "trainer";
    if (userRole[0][0] !== trainer) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send(
          `${getReasonPhrase(
            StatusCodes.UNAUTHORIZED
          )}\nUser that was provided is not authorized to be a trainer`
        );
      return;
    }

    await createProgram(
      trainer_id,
      title,
      description,
      type,
      price,
      is_group,
      max_size,
      image
    );
    res
      .status(StatusCodes.CREATED)
      .send(
        `${getReasonPhrase(StatusCodes.CREATED)}\nProgram Successfully created`
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
export const getProgramById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IProgram;
    if (!body.id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    if (body.id <= 0) {
      res
        .send(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid id ${
            body.id
          } in the request body. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { id } = body;
    const program = await getSpecificProgramById(id);
    if (!program) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nProgram not found with id: ${id}`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    res.send(program).status(StatusCodes.OK);
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

export const getAllPrograms = async (req: Request, res: Response) => {
  try {
    const programList = await getPrograms();
    if (!programList) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nNo programs found in the database`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.send(programList).status(StatusCodes.OK);
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

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const body = req.body as IProgram;

    if (
      !body.id ||
      !body.trainer_id ||
      !body.title ||
      !body.description ||
      !body.type ||
      !body.price ||
      !body.is_group ||
      !body.max_size ||
      !body.image
    ) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one of the required parameters in the request body: 'id','trainer_id', 'title', 'description', 'type', 'price', 'is_group', 'max_size', 'image' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (
      body.id <= 0 ||
      body.trainer_id <= 0 ||
      body.price < 0 ||
      body.max_size <= 0
    ) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nAt least one invalid parameter in the request body: 'id', 'trainer_id','max_size','price'\n(They should be positive integers or the price should at least be 0)`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const {
      id,
      trainer_id,
      title,
      description,
      type,
      price,
      is_group,
      max_size,
      image,
    } = body;

    // @ts-ignore
    const userRole = await sqlPool.query<IUser["role"]>(
      `SELECT role FROM user WHERE id = ? LIMIT 1`,
      [trainer_id]
    );

    if (!userRole) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nUser that was provided does not exist`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    if (userRole[0][0] !== "trainer") {
      res
        .status(StatusCodes.BAD_REQUEST)
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nUser that was provided is not authorised to be a trainer`
        );
      return;
    }

    await updateProgramById(
      id,
      trainer_id,
      title,
      description,
      type,
      price,
      is_group,
      max_size,
      image
    );
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.OK
        )}\nProgram with id ${id} Successfully updated`
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

export const programDeleteById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IProgram;
    if (!body.id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing requiered parameter: 'id' from the request body`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.id <= 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid parameter: 'id' should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { id } = body;

    await deleteProgramById(id);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nProgram with id: ${id} Successfully deleted`
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

export const deleteAllPrograms = async (req: Request, res: Response) => {
  try {
    await programsDelete();
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nAll Programs Successfully deleted`
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

async function createProgram(
  trainer_id: IProgram["trainer_id"],
  title: IProgram["title"],
  description: IProgram["description"],
  type: IProgram["type"],
  price: IProgram["price"],
  is_group: IProgram["is_group"],
  max_size: IProgram["max_size"],
  image: IProgram["image"]
) {
  // @ts-ignore
  await sqlPool.query<IProgram>("CALL sp_CreateProgram(?,?,?,?,?,?,?,?)", [
    trainer_id,
    title,
    description,
    type,
    price,
    is_group,
    max_size,
    image,
  ]);
}

async function getSpecificProgramById(id: IProgram["id"]) {
  // @ts-ignore
  const [row] = await sqlPool.query<IProgram>("CALL sp_GetProgramByID(?)", [
    id,
  ]);
  //@ts-ignore
  return row[0][0];
}

async function getPrograms() {
  // @ts-ignore
  const [rows] = await sqlPool.query<IProgram[]>("CALL sp_GetPrograms()");
  return rows[0];
}
async function updateProgramById(
  id: IProgram["id"],
  trainer_id: IProgram["trainer_id"],
  title: IProgram["title"],
  description: IProgram["description"],
  type: IProgram["type"],
  price: IProgram["price"],
  is_group: IProgram["is_group"],
  max_size: IProgram["max_size"],
  image: IProgram["image"]
) {
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
