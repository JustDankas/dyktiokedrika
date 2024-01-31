import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IUser } from "../models/user";

export const testFunction = async (req: Request<IUser>, res: Response) => {
  try {
    const user = await getUser("1");
    console.log(user);
    res.json(req.params.id).status(200);
  } catch (error) {
    console.log(error);
    res.json("Server Error");
  }
};
async function getUser(id: string) {
  // @ts-ignore

  const [rows] = await sqlPool.query<IUser[]>(
    `SELECT * 
    FROM user `,
    [id]
  );
  return rows;
}
