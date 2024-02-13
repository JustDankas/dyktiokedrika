import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IAddress, IAddressCreationRequest } from "../models/address";

export const addressCreate = async (
  req: Request<IAddressCreationRequest>,
  res: Response
) => {
  try {
    const { user_id, country, city, street } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await createAddress(req.body);
    res.send("Address Successfully created").status(200);
    return;
  } catch (createError) {
    console.log(createError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const getAddressById = async (
  req: Request<IAddress["id"]>,
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
    const address = await getSpecificAddressById(req.body);
    res.send(address).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const getAddressByUserId = async (
  req: Request<IAddress["user_id"]>,
  res: Response
) => {
  try {
    const { user_id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const userAddresses = await getAllAddressByUserId(req.body);
    res.send(userAddresses).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const getAllAddresses = async (req: Request, res: Response) => {
  try {
    const addressList = await getAddresses();
    res.send(addressList).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const updateAddress = async (
  req: Request<IAddress["id"]>,
  res: Response
) => {
  try {
    const { id, country, city, street } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await updateAddressById(req.body);
    res.send("Address Successfully updated").status(200);
    return;
  } catch (updateError) {
    console.log(updateError);
    res.send("Internal Server Error").status(500);
  }
};
export const addressDeleteById = async (
  req: Request<IAddress["id"]>,
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
    await deleteAddressById(req.body);
    res.send("Address Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
  }
};
export const addressesDeleteByUserId = async (
  req: Request<IAddress["user_id"]>,
  res: Response
) => {
  try {
    const { user_id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await deleteAllAddressesByUserId(req.body);
    res.send("User Addresses Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
  }
};

export const addressesDelete = async (req: Request, res: Response) => {
  try {
    await deleteAllAddresses();
    res.send("All Addresses Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
  }
};

export async function createAddress({
  user_id,
  country,
  city,
  street,
}: IAddressCreationRequest) {
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
export async function getAllAddressByUserId(user_id: IAddress["user_id"]) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAddress>(
    "CALL sp_GetAllAddressesByUserId(?)",
    [user_id]
  );
  // @ts-ignore
  return rows[0][0];
}
async function getAddresses() {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAddress[]>("CALL sp_GetAllAddresses()");
  return rows[0];
}

async function updateAddressById({
  id,
  country,
  city,
  street,
}: Omit<IAddress, "user_id">) {
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
