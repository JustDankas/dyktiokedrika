import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";

export const testFunction = async (req: Request, res: Response) => {
  const [rows] = await sqlPool.query("SELECT * FROM offer");
  console.log(rows);
  res.send("test");
};
