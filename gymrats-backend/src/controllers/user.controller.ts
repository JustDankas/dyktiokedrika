import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IUser, ILoginRequest, IAuth } from "../models/user";
import jwt from "jsonwebtoken";
import { ICreateUser } from "../interfaces/user.interface";

export const userLogin = async (req: Request<ILoginRequest>, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) {
      throw new Error("Incorrect credentials");
    }
    console.log(user);
    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });
    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    res.json(user).status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};
export const userAuth = async (req: Request<IAuth>, res: Response) => {
  try {
    const { token } = req.body;
    console.log(token);
    jwt.verify(token as string, "secret", (err, decoded) => {
      if (err) {
        console.error(err);
      }
      console.log(decoded);
    });
    // console.log(id);
    // const user = await getUserByUsernameAndPassword(username, password);
    // const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });
    // res.cookie("token", token, { httpOnly: true });
    res.json("OK").status(200);
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
    // const {role}=req.params;
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

export const massUpdateUserRoles = async (req: Request, res: Response) => {
  try {
    const updatedRoles: Record<number, IUser["role"]> = req.body;

    await massUpdateRoles(updatedRoles);

    res.json("User roles updated successfully").status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};
export const massDeleteUsersByRole = async (req: Request, res: Response) => {
  try {
    const role: IUser["role"] = req.body;

    await massDeleteByRole(role);

    res
      .json(`Users that had the ${role} have been deleted successfully`)
      .status(200);
  } catch (error) {
    console.log(error);
    res.json("Internal Server Error").status(500);
  }
};
export const deleteAllUsersExceptAdmins = async (
  req: Request,
  res: Response
) => {
  try {
    await deleteUsersExceptAdmins("admin");

    res
      .json(`All users except admins have been deleted successfully`)
      .status(200);
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
    res.json("Deletion Successful").status(200);
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

async function getUserById(id: number) {
  // @ts-ignore

  const [rows] = await sqlPool.query<IUser[]>(
    `CALL sp_GetUserById(?)
     `,
    [id]
  );
  return rows[0];
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
    `CALL sp_CreateUser(?,?,?,?,?,?,?,?,?)
     `,
    [
      user.name,
      user.surname,
      user.email,
      user.username,
      user.password,
      user.image,
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
    `CALL sp_UpdateUser(?,?,?,?,?,?,?)
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
    ]
  );
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
async function massDeleteByRole(role: IUser["role"]) {
  // @ts-ignore
  await sqlPool.query<IUser>(
    `CALL sp_DeleteAllUsersByRole(?)
     `,
    [role]
  );
}
async function deleteUsersExceptAdmins(role: "admin") {
  // @ts-ignore
  await sqlPool.query<IUser>(
    `CALL sp_DeleteAllUsersExceptAdmins(?)
     `,
    [role]
  );
}

async function massUpdateRoles(updatedRoles: Record<number, IUser["role"]>) {
  for (const userId in updatedRoles) {
    const newRole = updatedRoles[userId];

    await sqlPool.query(`CALL sp_UpdateUserRole(?, ?)`, [userId, newRole]);
  }
}
