import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import {
  IAnnouncement,
  IAnnouncementCreationRequest,
} from "../models/announcement";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import {
  SqlError,
  isSqlError,
  isValidIsoDate,
} from "../models/errorHandlingHelpers";

export const announcementCreate = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAnnouncementCreationRequest;
    if (!body.title || !body.text || !body.image) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one of the required parameters in the request body: 'title', 'text', 'image' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    const { title, text, image } = body;
    await createAnnouncement(title, text, image);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.CREATED
        )}\nAnnouncement Successfully created`
      )
      .status(StatusCodes.CREATED);
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
export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAnnouncement;
    if (!body.id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter in the request body: 'id' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.id <= 0) {
      res
        .send(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid id ${
            body.id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    const { id } = body;

    const announcement = await getSpecificAnnouncementById(id);
    if (!announcement) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nAnnouncement not found with id: ${id}`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.send(announcement).status(StatusCodes.OK);
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

export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcementList = await getAnnouncements();
    if (!announcementList) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.NOT_FOUND
          )}\nNo announcements found in the database`
        )
        .status(StatusCodes.NOT_FOUND);
      return;
    }
    res.send(announcementList).status(StatusCodes.OK);
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
export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const body = req.body as Omit<IAnnouncement, "created_at">;
    if (!body.id || !body.title || !body.text || !body.image) {
      res.send(
        `${getReasonPhrase(
          StatusCodes.BAD_REQUEST
        )}\nMissing at least one required parameter in the request body of the following: 'id', 'title', 'text', 'image'`
      );
      return;
    }
    if (body.id <= 0) {
      res.send(
        `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid id ${
          body.id
        }. Id should be a positive integer`
      );
      return;
    }
    const { id, title, text, image } = body;

    await updateAnnouncementById(id, title, text, image);
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.OK
        )}\nAnnouncement with id: ${id} Successfully updated`
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

export const announcementDeleteById = async (req: Request, res: Response) => {
  try {
    const body = req.body as IAnnouncement;
    if (!body.id) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing required parameter 'id' in the request body`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }
    if (body.id <= 0) {
      res
        .send(
          `${getReasonPhrase(StatusCodes.BAD_REQUEST)}\nInvalid id ${
            body.id
          }. Id should be a positive integer`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    const { id } = body;
    await deleteAnnouncementById(id);
    res.send(
      `${getReasonPhrase(
        StatusCodes.NO_CONTENT
      )}\nAnnouncement with id: ${id} Successfully deleted`
    );
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

export const announcementsDelete = async (req: Request, res: Response) => {
  try {
    await deleteAllAnnouncements();
    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nAll Announcements Successfully deleted from the database`
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

export const announcementsDeleteByDateRange = async (
  req: Request,
  res: Response
) => {
  try {
    const body = req.body as { start: string; end: string };

    if (!body.start || !body.end) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nMissing at least one required parameter in the request body from the following: 'start' or 'end' `
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    const { start, end } = body;

    const parsedStartDate = new Date(start);
    const parsedEndDate = new Date(end);
    const currentDate = new Date();

    if (
      isNaN(parsedStartDate.getTime()) ||
      isNaN(parsedEndDate.getTime()) ||
      parsedStartDate >= parsedEndDate ||
      currentDate <= parsedStartDate
    ) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid date in start or end parameter\nOr start date is after end date\nOr start date for deletion refers to the future`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    if (!isValidIsoDate(start) || !isValidIsoDate(end)) {
      res
        .send(
          `${getReasonPhrase(
            StatusCodes.BAD_REQUEST
          )}\nInvalid date format in the request start or end parameter. Use full ISO date format.`
        )
        .status(StatusCodes.BAD_REQUEST);
      return;
    }

    await deleteAnnouncementsByDateRange(parsedStartDate, parsedEndDate);

    res
      .send(
        `${getReasonPhrase(
          StatusCodes.NO_CONTENT
        )}\nAnnouncements Successfully deleted within the date range ${parsedStartDate} to ${parsedEndDate}`
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

async function createAnnouncement(
  title: IAnnouncement["title"],
  text: IAnnouncement["text"],
  image: IAnnouncement["image"]
) {
  await sqlPool.query("CALL sp_createAnnouncement(?,?,?)", [
    title,
    text,
    image,
  ]);
}

async function getSpecificAnnouncementById(id: IAnnouncement["id"]) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAnnouncement>(
    "CALL sp_GetAnnouncementById(?)",
    [id]
  );
  // @ts-ignore
  return rows[0][0];
}
async function getAnnouncements() {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAnnouncement[]>(
    "CALL sp_GetAnnouncements()"
  );
  return rows[0];
}

async function updateAnnouncementById(
  id: IAnnouncement["id"],
  title: IAnnouncement["title"],
  text: IAnnouncement["text"],
  image: IAnnouncement["image"]
) {
  // @ts-ignore
  await sqlPool.query<IAnnouncement>("CALL sp_UpdateAnnouncement(?,?,?,?)", [
    id,
    title,
    text,
    image,
  ]);
}

async function deleteAnnouncementById(id: IAnnouncement["id"]) {
  // @ts-ignore
  await sqlPool.query<IAnnouncement>("CALL sp_DeleteAnnouncementById(?)", [id]);
}

async function deleteAllAnnouncements() {
  // @ts-ignore
  await sqlPool.query<IAnnouncement>("CALL sp_DeleteAllAnnouncements()");
}

async function deleteAnnouncementsByDateRange(start: Date, end: Date) {
  // @ts-ignore
  await sqlPool.query<IAnnouncement[]>(
    "CALL sp_DeleteAnnouncementsByDateRange(?,?)",
    [start, end]
  );
}
