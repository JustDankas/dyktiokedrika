import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IUser, ILoginRequest } from "../models/user";
import jwt from "jsonwebtoken";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { SqlError, isSqlError } from "../models/errorHandlingHelpers";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const body = req.body as Omit<IUser, "id" | "registration_date" | "role">;
    if (
      !body.name ||
      !body.surname ||
      !body.email ||
      !body.username ||
      !body.password ||
      !body.image
    ) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Missing required parameters in the request body",
      };
    }
    const { name, surname, email, username, password, image } = body;

    await createNewUser(name, surname, email, username, password, image);
    res
      .send(
        `New User ${username} Successfully created\n${getReasonPhrase(
          StatusCodes.CREATED
        )}`
      )
      .status(StatusCodes.CREATED);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const body = req.body as ILoginRequest;

    if (!body.username || !body.password) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Missing required parameters in the request body",
      };
    }

    const { username, password } = body;

    // @ts-ignore
    const user: IUser = await getUserByUsernameAndPassword(username, password);

    if (!user) {
      res
        .send(
          `"Invalid username or password\n${getReasonPhrase(
            StatusCodes.UNAUTHORIZED
          )}`
        )
        .status(StatusCodes.UNAUTHORIZED);
      return;
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });
    if (!token) {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Unauthorized: Missing or invalid token",
      };
    }

    res.cookie("token", token, { httpOnly: true });
    res.status(StatusCodes.OK).send(user);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IUser;
    const { id } = body;
    if (!id) {
      res
        .send(
          `${StatusCodes.BAD_REQUEST}\nMissing required parameter 'id' in the request body`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    if (id <= 0) {
      res
        .send(
          `${StatusCodes.BAD_REQUEST}\n Parameter 'id' in the request body should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const user = await getUserByID(id);
    if (!user) {
      res
        .send(`${StatusCodes.NOT_FOUND}\nNo user found with that id: ${id}`)
        .status(StatusCodes.NOT_FOUND);
    }
    res.send(user).status(StatusCodes.OK);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const getUsersByRole = async (req: Request, res: Response) => {
  try {
    const body = req.body as IUser;
    const { role } = body;
    if (!role) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Missing required parameter 'role' in the request body",
      };
    }

    if (
      role !== "admin" &&
      role !== "user" &&
      role !== "trainer" &&
      role !== "notAssigned"
    ) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Invalid role in the request body",
      };
    }

    const usersList = await getUsersByTheirRole(role);
    if (!usersList) {
      res
        .send(
          `${StatusCodes.NOT_FOUND}\nNo users found with that role: ${role}`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.send(usersList).status(StatusCodes.OK);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersList = await getUsers();
    if (!usersList) {
      res.send("No users found").status(StatusCodes.NOT_FOUND);
    }
    res.send(usersList).status(StatusCodes.OK);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const userUpdate = async (req: Request, res: Response) => {
  try {
    const body = req.body as Omit<IUser, "registration_date">;
    if (
      !body.id ||
      !body.name ||
      !body.surname ||
      !body.email ||
      !body.username ||
      !body.password ||
      !body.image
    ) {
      res
        .send(
          `Missing at least one of the following required parameters in the request body: id, name, surname, email, username, password, image`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    if (body.id <= 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nUser id must be a positive integer instead of ${body.id}`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const { id, name, surname, email, username, password, image } = body;

    await updateExistingUser(
      id,
      name,
      surname,
      email,
      username,
      password,
      image
    );
    res
      .send(
        `User ${username} Successfully updated\n${getReasonPhrase(
          StatusCodes.OK
        )}`
      )
      .status(StatusCodes.OK);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(
          getReasonPhrase(
            `${StatusCodes.INTERNAL_SERVER_ERROR}\nMaybe try a different username or email or both?`
          )
        );
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const updateUserRoleById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IUser;
    if (!body.id || !body.role) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one required parameter of the following: id, role `
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const { id, role } = body;
    if (
      role !== "admin" &&
      role !== "user" &&
      role !== "trainer" &&
      role !== "notAssigned"
    ) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid role in the request body: ${role}`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (id <= 0) {
      res
        .send(
          `
        ${getReasonPhrase(
          StatusCodes.BAD_REQUEST
        )}\nInvalid id: ${id}. It should be a positive integer.`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    await updateUserRole(id, role);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.OK
        )}\nUser role successfully updated to ${role}`
      )
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
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const massUpdateUserRoles = async (req: Request, res: Response) => {
  try {
    const body = req.body as Array<{
      user_id: IUser["id"];
      role: IUser["role"];
    }>;
    if (body && Array.isArray(body) && body.length > 0) {
      let i = 0;
      for (const entry of body) {
        const { user_id, role } = entry;
        if (!user_id || !role) {
          res
            .send(
              `${getReasonPhrase(
                StatusCodes.BAD_REQUEST
              )}\n Missing required parameters in this ${
                i + 1
              }th enty: ${entry}`
            )
            .status(StatusCodes.BAD_REQUEST);
          return;
        }
        if (
          role !== "admin" &&
          role !== "user" &&
          role !== "trainer" &&
          role !== "notAssigned"
        ) {
          res
            .send(
              `${getReasonPhrase(
                StatusCodes.BAD_REQUEST
              )}\nInvalid role in this ${i + 1}th entry: ${entry}`
            )
            .status(StatusCodes.BAD_REQUEST);
          return;
        }
        await updateUserRole(user_id, role);
        i++;
      }
    } else {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid or empty list format in the request body`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    res
      .send(
        `${getReasonPhrase(StatusCodes.OK)}\nUsers' roles updated successfully`
      )
      .status(StatusCodes.OK);
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

export const userDeleteById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IUser;
    const { id } = body;
    if (!id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter id in the request body`
        )
        .status(StatusCodes.BAD_REQUEST);
    }

    if (id <= 0) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nUser ID must be a positive integer instead of ${id}`
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    await deleteUserById(id);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.OK
        )}\nDeletion of user with ID: ${id} was Successful`
      )
      .status(StatusCodes.NO_CONTENT);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const massDeleteUsersByRole = async (req: Request, res: Response) => {
  try {
    const body = req.body as IUser;
    if (!body.role) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter role from the request body `
        )
        .status(StatusCodes.BAD_REQUEST);
    }
    const { role } = body;
    if (role !== "user" && role !== "trainer" && role !== "notAssigned") {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid role in the request body: ${role}.\nAlso admins cannot be deleted from the database through this route`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    await massDeleteByRole(role);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nUsers with role ${role} successfully deleted`
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
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

export const deleteAllUsersExceptAdmins = async (
  req: Request,
  res: Response
) => {
  try {
    const admin = "admin";
    await deleteUsersExceptAdmins(admin);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nAll Users Successfully deleted`
      )
      .status(StatusCodes.NO_CONTENT);
  } catch (error: unknown) {
    if (isSqlError(error)) {
      const sqlError = error as SqlError;
      console.error(
        `SQL Error: Code ${sqlError.code}, Errno ${sqlError.errno}, SQL: ${sqlError.sql}, Message: ${sqlError.sqlMessage}`
      );
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    } else {
      console.error("Generic Error:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  }
};

async function getUserByUsernameAndPassword(
  username: string,
  password: string
) {
  // @ts-ignore
  console.log(username, password);
  const [rows] = await sqlPool.query(
    `CALL sp_GetUserByUsernameAndPassword(?,?)
     `,
    [username, password]
  );
  console.log(rows);
  // @ts-ignore
  return rows[0][0];
}

async function getUserByID(id: number) {
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

async function createNewUser(
  name: IUser["name"],
  surname: IUser["surname"],
  email: IUser["email"],
  username: IUser["username"],
  password: IUser["password"],
  image: IUser["image"]
) {
  // @ts-ignore

  await sqlPool.query<IUser>(
    `CALL sp_CreateUser(?,?,?,?,?,?)
    `,
    [name, surname, email, username, password, image]
  );
}
async function updateUserRole(user_id: IUser["id"], newRole: IUser["role"]) {
  await sqlPool.query(`CALL sp_UpdateUserRoleByID(?, ?)`, [user_id, newRole]);
}

async function updateExistingUser(
  id: IUser["id"],
  name: IUser["name"],
  surname: IUser["surname"],
  email: IUser["email"],
  username: IUser["username"],
  password: IUser["password"],
  image: IUser["image"]
) {
  // @ts-ignore

  await sqlPool.query<IUser>(
    `CALL sp_UpdateUser(?,?,?,?,?,?,?)
     `,
    [id, name, surname, email, username, password, image]
  );
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
