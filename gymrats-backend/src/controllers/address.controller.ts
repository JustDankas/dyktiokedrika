import { sqlPool } from "../mysqlPool";
import { IAddress } from "../models/address";

export async function getAllAddressByUserId(user_id: IAddress["user_id"]) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAddress>(
    "CALL sp_GetAllAddressesByUserId(?)",
    [user_id]
  );
  // @ts-ignore
  return rows[0][0];
}
