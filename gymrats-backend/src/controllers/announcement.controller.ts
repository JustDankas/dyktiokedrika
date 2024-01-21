import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { IAnnouncement } from "../models/announcement";
import { IAnnouncementCreationRequest } from "../models/announcementCreationRequest";

export const announcementCreate = async (
  req: Request<IAnnouncementCreationRequest>,
  res: Response
) => {
  try {
    const { title, text, image } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await createAnnouncement(req.body);
    res.send("Announcement Successfully created").status(200);
    return;
  } catch (createError) {
    console.log(createError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const getAnnouncementById = async (
  req: Request<IAnnouncement["id"]>,
  res: Response
) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const announcement = await getSpecificAnnouncementById(req.body);
    res.send(announcement).status(200);
    return;
  } catch (createError) {
    console.log(createError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcementList = await getAnnouncements();
    res.send(announcementList).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const updateAnnouncement = async (
  req: Request<IAnnouncement["id"]>,
  res: Response
) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await updateAnnouncementById(req.body);
    res.send("Announcement Successfully updated").status(200);
    return;
  } catch (updateError) {
    console.log(updateError);
    res.send("Internal Server Error").status(500);
  }
};
export const announcementDeleteById = async (
  req: Request<IAnnouncement["id"]>,
  res: Response
) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await deleteAnnouncementById(req.body);
    res.send("Announcement Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
  }
};

export const announcementsDelete = async (req: Request, res: Response) => {
  try {
    await deleteAllAnnouncements();
    res.send("All Announcements Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
  }
};

export const announcementsDeleteByDateRange = async (
  req: Request<{ start: string; end: string }>,
  res: Response
) => {
  try {
    const { start, end } = req.body;

    if (!start || !end) {
      res.send("Invalid date range").status(400);
      return;
    }
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }

  try {
    const { start, end } = req.body;

    const parsedStartDate = new Date(start);
    const parsedEndDate = new Date(end);

    await deleteAnnouncementsByDateRange(parsedStartDate, parsedEndDate);

    res
      .send(
        `Announcements Successfully deleted within the date range ${start} to ${end}`
      )
      .status(200);
  } catch (deleteError) {
    console.error(deleteError);
    res.send("Internal Server Error").status(500);
  }
};

async function createAnnouncement({
  title,
  text,
  image,
}: IAnnouncementCreationRequest) {
  await sqlPool.query("CALL sp_createAnnouncement(?,?,?)", [
    title,
    text,
    image,
  ]);
}

async function getSpecificAnnouncementById(id: IAnnouncement["id"]) {
  // @ts-ignore
  const [row] = await sqlPool.query<IAnnouncement>(
    "CALL sp_GetAnnouncementById(?)",
    [id]
  );
  return row;
}
async function getAnnouncements() {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAnnouncement[]>(
    "CALL sp_GetAnnouncements()"
  );
  return rows[0];
}

async function updateAnnouncementById(id: IAnnouncement["id"]) {
  // @ts-ignore
  await sqlPool.query<IAnnouncement>("CALL sp_UpdateAnnouncement(?)", [id]);
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
