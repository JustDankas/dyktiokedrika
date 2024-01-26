import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IAddress, IAddressCreationRequest } from "../models/address";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { SqlError, isSqlError } from "../models/errorHandlingHelpers";

export const addressCreate = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAddressCreationRequest;
    if (!body.user_id || !body.country || !body.city || !body.street) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one required parameter in the request body from the following: 'user_id', 'country', 'city', 'street'`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    if (body.user_id <= 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nUser_id must be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const { user_id, country, city, street } = body;

    await createAddress(user_id, country, city, street);

    res
      .send(
        `${getReasonPhrase(StatusCodes.CREATED)}\nAddress Successfully created`
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
export const getAddressById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAddress;
    if (!body.id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter from request body:'id'`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    if (body.id <= 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nId must be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const { id } = body;
    const address = await getSpecificAddressById(id);
    if (!address) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nAddress not found with id: ${id} in the database`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.send(address).status(StatusCodes.OK);
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
export const getAddressesByUserId = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAddress;
    if (!body.user_id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'user_id' `
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    if (body.user_id <= 0) {
      res
        .send(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid user_id ${
            body.user_id
          } in the request body. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const userAddresses = await getAllAddressByUserId(req.body);
    if (!userAddresses) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nUser addresses not found of user with user id: ${
            req.body.user_id
          } in the database`
        )
        .status(StatusCodes.NOT_FOUND);
    }
    res.send(userAddresses).status(StatusCodes.OK);
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
export const getAllAddresses = async (req: Request, res: Response) => {
  try {
    const addressList = await getAddresses();
    if (!addressList) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nNo addresses in the database`
        )
        .status(StatusCodes.NOT_FOUND);
    }
    res.send(addressList).status(StatusCodes.OK);
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

export const updateAddress = async (req: Request, res: Response) => {
  try {
    const body = req.body as Omit<IAddress, "user_id">;
    if (!body.id || !body.country || !body.city || !body.street) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one required parameter from the following in the request body: 'id', 'country', 'city', 'street'`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    if (body.id <= 0) {
      res
        .send(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid id ${
            body.id
          } in the request body. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const { id, country, city, street } = body;
    await updateAddressById(id, country, city, street);
    res
      .send(`${getReasonPhrase(StatusCodes.OK)}\nAddress Successfully updated`)
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
export const addressDeleteById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAddress;
    if (!body.id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing id in the request body`
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
    await deleteAddressById(id);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nAddress Successfully deleted from the database`
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
export const addressesDeleteByUserId = async (
  req: Request<IAddress["user_id"]>,
  res: Response
) => {
  try {
    const body = req.body as IAddress;
    if (!body.user_id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter user_id in the request body`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    if (body.user_id <= 0) {
      res
        .send(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid user_id ${
            body.user_id
          } in the request body. User_Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const { user_id } = body;
    await deleteAllAddressesByUserId(user_id);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nUser Addresses Successfully deleted`
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

export const addressesDelete = async (req: Request, res: Response) => {
  try {
    await deleteAllAddresses();
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nAll Addresses Successfully deleted`
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
async function createAddress(
  user_id: IAddress["user_id"],
  country: IAddress["country"],
  city: IAddress["city"],
  street: IAddress["street"]
) {
  await sqlPool.query("CALL sp_createAddress(?,?,?,?)", [
    user_id,
    country,
    city,
    street,
  ]);
}

async function getSpecificAddressById(id: IAddress["id"]) {
  // @ts-ignore
  const [row] = await sqlPool.query<IAddress>("CALL sp_GetAddressByID(?)", [
    id,
  ]);
  return row;
}
async function getAllAddressByUserId(user_id: IAddress["user_id"]) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAddress[]>(
    "CALL sp_GetAllAddressesByUserId(?)",
    [user_id]
  );
  return rows[0];
}
async function getAddresses() {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAddress[]>("CALL sp_GetAllAddresses()");
  return rows[0];
}

async function updateAddressById(
  id: IAddress["id"],
  country: IAddress["country"],
  city: IAddress["city"],
  street: IAddress["street"]
) {
  // @ts-ignore
  await sqlPool.query<IAddress>("CALL sp_UpdateAddressById(?,?,?,?)", [
    id,
    country,
    city,
    street,
  ]);
}

async function deleteAddressById(id: IAddress["id"]) {
  // @ts-ignore
  await sqlPool.query<IAddress>("CALL sp_DeleteAddressByID(?)", [id]);
}

async function deleteAllAddressesByUserId(user_id: IAddress["user_id"]) {
  // @ts-ignore
  await sqlPool.query<IAddress[]>("CALL sp_DeleteAllAnnouncements(?)", [
    user_id,
  ]);
}
async function deleteAllAddresses() {
  // @ts-ignore
  await sqlPool.query<IAddress[]>("CALL sp_DeleteAllAddresses()");
}
