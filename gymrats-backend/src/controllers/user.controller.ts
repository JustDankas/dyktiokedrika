import { NextFunction, Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IUser, ILoginRequest, IAuth } from "../models/user";
import jwt from "jsonwebtoken";
import { ICreateUser } from "../interfaces/user.interface";
import { getAllAddressByUserId } from "./address.controller";

export const userLogin = async (req: Request<ILoginRequest>, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) {
      throw new Error("Incorrect credentials");
    }
    const { id } = user;
    const address = await getAllAddressByUserId(id);
    if (address) {
      const token = jwt.sign({ id }, "secret", { expiresIn: "1d" });
      res.cookie("auth", token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });
      res.json({ ...user, ...address }).status(200);
    } else {
      throw new Error("No address found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal Server Error");
  }
};
export const userAuth = async (req: Request, res: Response) => {
  try {
    // const { token } = req.body;
    // console.log(token);
    if ("auth" in req.cookies) {
      const { auth } = req.cookies;
      jwt.verify(auth as string, "secret", async (err, decoded) => {
        if (err) {
          console.error(err);
        }
        //@ts-ignore
        const { id } = decoded;
        const user = await getUserByIdQuery(id);
        const address = await getAllAddressByUserId(id);
        if (user && address) {
          res.json({ ...user, ...address }).status(200);
        } else {
          throw new Error("User not found");
        }
      });
    } else {
      res.status(404).json("No auth");
    }
    // console.log(id);
    // const user = await getUserByUsernameAndPassword(username, password);
    // const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });
    // res.cookie("token", token, { httpOnly: true });
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};

export const userRegister = async (
  req: Request<ICreateUser>,
  res: Response
) => {
  try {
    const newUser = await createNewUser(req.body);
    res.json("OK").status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};
export const userUpdate = async (req: Request<IUser>, res: Response) => {
  try {
    const updatedUser = await updateExistingUser(req.body);
    res.json("OK").status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};

export const getUsersByRole = async (
  req: Request<IUser["role"]>,
  res: Response
) => {
  try {
    const { role } = req.body;

    const usersList = await getUsersByTheirRole(role);
    res.json(usersList).status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersList = await getUsers();
    res.json(usersList).status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};

export const userDeleteById = async (
  req: Request<IUser["id"]>,
  res: Response
) => {
  try {
    const { id } = req.body;
    const user = await deleteUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    res.json("Deletion Successful").status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};

export const updateUserPfp = async (
  req: Request<IUser["image"] & IUser["id"]>,
  res: Response
) => {
  try {
    const { image, id } = req.body;
    const newUser = await updateUserPfpById(image, id);
    //@ts-ignore
    if (newUser.affectedRows > 0) {
      res.status(200).json("OK");
    } else {
      throw new Error("Uknown error");
    }
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};
export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const newUser = await updateUserInfoQuery(req.body);
    //@ts-ignore
    if (newUser.affectedRows > 0) {
      res.status(200).json("OK");
    } else {
      throw new Error("Uknown error");
    }
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};
async function getUserByUsernameAndPassword(
  username: string,
  password: string
) {
  // @ts-ignore

  const [rows] = await sqlPool.query(
    `CALL sp_GetUserByUsernameAndPassword(?,?)
     `,
    [username, password]
  );
  //@ts-ignore
  return rows[0][0];
}

export async function getUserByIdQuery(id: number) {
  // @ts-ignore

  const [rows] = await sqlPool.query<IUser[]>(
    `CALL sp_GetUserById(?)
    `,
    [id]
  );
  // @ts-ignore
  return rows[0][0];
}

async function getUsersByTheirRole(role: IUser["role"]) {
  // @ts-ignore

  const [rows] = await sqlPool.query<IUser[]>(
    `CALL sp_getUsersByRole(?)
    `,
    [role]
  );
  return rows[0];
}

async function getUsers() {
  // @ts-ignore

  const [rows] = await sqlPool.query<IUser[]>(
    `CALL sp_GetAllUsers()
     `
  );
  return rows[0];
}

async function createNewUser(user: ICreateUser) {
  // @ts-ignore

  // const [row] = await sqlPool.query<IUser>(
  const [row] = await sqlPool.query<{ id: string }[]>(
    `CALL sp_CreateUser(?,?,?,?,?,?,?,?)
     `,
    [
      user.name,
      user.surname,
      user.email,
      user.username,
      user.password,
      user.country,
      user.city,
      user.street,
    ]
  );
  return row;
}

async function updateExistingUser(user: IUser) {
  // @ts-ignore

  const [row] = await sqlPool.query<IUser>(
    `CALL sp_UpdateUser(?,?,?,?,?,?,?,?,?)
     `,
    [
      user.id,
      user.name,
      user.surname,
      user.email,
      user.username,
      user.password,
      user.image,
      user.role,
      user.about,
    ]
  );
  return row;
}

async function updateUserInfoQuery({
  userId,
  username,
  email,
  password,
  about,
}: {
  userId: string;
  username: string;
  email: string;
  password: string;
  about: string;
}) {
  const [row] = await sqlPool.query("CALL sp_UpdateUserInfo(?,?,?,?,?)", [
    userId,
    username,
    email,
    password,
    about,
  ]);
  return row;
}

async function deleteUserById(id: IUser["id"]) {
  // @ts-ignore
  const [row] = await sqlPool.query<IUser>(
    `CALL sp_DeleteUserByID(?)
     `,
    [id]
  );
  return row;
}

async function updateUserPfpById(image: IUser["image"], id: IUser["id"]) {
  const [rows] = await sqlPool.query(`CALL sp_UpdateUserPfp(?, ?)`, [
    image,
    id,
  ]);
  return rows;
}
