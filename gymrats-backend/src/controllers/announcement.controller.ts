import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import {
  IAnnouncement,
  IAnnouncementCreationRequest,
} from "../models/announcement";

export const announcementCreate = async (
  req: Request<IAnnouncementCreationRequest>,
  res: Response
) => {
  try {
    const { title, text, image } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await createAnnouncement(req.body);
    res.json("Announcement Successfully created").status(200);
    return;
  } catch (createError) {
    console.log(createError);
    res.json("Internal Server Error").status(500);
    return;
  }
};

export const getAllAnnouncements = async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    const announcementList = await getAnnouncements(limit);
    res.json(announcementList).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.json("Internal Server Error").status(500);
    return;
  }
};
export const updateAnnouncement = async (
  req: Request<Omit<IAnnouncement, "created_at">>,
  res: Response
) => {
  try {
    const { id, title, text, image } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await updateAnnouncementById(req.body);
    res.json("Announcement Successfully updated").status(200);
    return;
  } catch (updateError) {
    console.log(updateError);
    res.json("Internal Server Error").status(500);
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
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { id } = req.body;
    await deleteAnnouncementById(id);
    res.json("Announcement Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.json("Internal Server Error").status(500);
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

async function getAnnouncements(maxInput: any) {
  // @ts-ignore
  const [rows] = await sqlPool.query<IAnnouncement[]>(
    "CALL sp_GetAnnouncements(?)",
    [maxInput]
  );
  return rows[0];
}

async function updateAnnouncementById({
  id,
  title,
  text,
  image,
}: Omit<IAnnouncement, "created_at">) {
  // @ts-ignore
  await sqlPool.query<IAnnouncement>("CALL sp_UpdateAnnouncement(?,?,?,?)", [
    id,
    title,
    text,
    image,
  ]);
}

async function deleteAnnouncementById(id: number) {
  // @ts-ignore
  await sqlPool.query<IAnnouncement>("CALL sp_DeleteAnnouncementById(?)", [id]);
}
