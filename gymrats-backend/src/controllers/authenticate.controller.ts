import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { getUserByIdQuery } from "./user.controller";
export const authenticateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if ("auth" in req.cookies) {
      const { auth } = req.cookies;
      jwt.verify(auth as string, "secret", async (err, decoded) => {
        if (err) {
          console.error(err);
        }
        //@ts-ignore
        const { id } = decoded;
        const user = await getUserByIdQuery(id);
        if (user) {
          res.locals.id = id;
          next();
        } else {
          throw new Error("User not found");
        }
      });
    } else {
      res.status(404).json("No auth");
    }
  } catch (error) {
    res.status(500).send("Token expired");
  }
};
