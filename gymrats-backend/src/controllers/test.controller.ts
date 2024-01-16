import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IUser } from "../models/user";

export const testFunction = async (req: Request<IUser>, res: Response) => {
  try {
    // @ts-ignore
    const [rows] = await sqlPool.query<IUser[]>("SELECT ssid FROM user", []);
    console.log(rows);
    res.json(req.params.uid).status(200);
  } catch (error) {
    console.log(error);
    res.send("Server Error");
  }
};
