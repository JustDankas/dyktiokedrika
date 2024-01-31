import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes, getReasonPhrase } from "http-status-codes";

export const authenticateController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { token } = req.params;
    token = token.split("=")[1];
    console.log(token, "token");
    const user_id = jwt.verify(token, "secret");
    console.log("User ID", user_id);
    if (user_id) {
      //   req.user_id=user_id;
      req.body.cookie_user_id = user_id;
      next();
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(`${getReasonPhrase(StatusCodes.UNAUTHORIZED)}\nToken expired`);
      return;
    }
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(`${getReasonPhrase(StatusCodes.UNAUTHORIZED)}\nToken expired`);
    return;
  }
};
