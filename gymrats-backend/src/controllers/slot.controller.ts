import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { ISlot, ISlotCreationRequest } from "../models/slot";
import { getSpecificProgramById } from "./program.controller";
export const slotCreate = async (
  req: Request<ISlotCreationRequest>,
  res: Response
) => {
  try {
    const { program_id, start, end } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { program_id, start, end } = req.body;

    // const parsedStartDate = new Date(start);
    // const parsedEndDate = new Date(end);
    // const [program] = await sqlPool.query<any>(
    //   SELECT max_size FROM program WHERE id = ?,
    //   [program_id]
    // );
    // console.log(program);
    const parsedStartDate = new Date(start);
    const correctParsedStartDate = new Date(
      parsedStartDate.getTime() + 2 * 60 * 60 * 1000
    );

    const parsedEndDate = new Date(end);
    const correctParsedEndDate = new Date(
      parsedEndDate.getTime() + 2 * 60 * 60 * 1000
    );
    await createSlot(program_id, correctParsedStartDate, correctParsedEndDate);
    res.status(200).json("Slot Successfully created");
    return;
  } catch (createError) {
    console.log(createError);
    res.status(500).json("Internal Server Error");
    return;
  }
};
export const getSlotById = async (req: Request<ISlot["id"]>, res: Response) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const slot = await getSpecificSlotById(req.body);
    res.json(slot).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.json("Internal Server Error").status(500);
    return;
  }
};
export const getSlotsByProgramId = async (
  req: Request<ISlot["program_id"]>,
  res: Response
) => {
  try {
    const { program_id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { program_id } = req.body;

    const programSlots = await getSlotsByProgramIDQuery(program_id);
    res.json(programSlots).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.json("Internal Server Error").status(500);
    return;
  }
};
export const getAllSlots = async (req: Request, res: Response) => {
  try {
    const SlotList = await getSlotsQuery();
    res.json(SlotList).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.json("Internal Server Error").status(500);
    return;
  }
};
export const updateSlot = async (req: Request<ISlot["id"]>, res: Response) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await updateSlotById(req.body);
    res.json("Slot Successfully updated").status(200);
    return;
  } catch (updateError) {
    console.log(updateError);
    res.json("Internal Server Error").status(500);
  }
};
export const SlotDeleteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.json("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { id } = req.query;

    await deleteSlotById(Number(id));
    res.json("Slot Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.json("Internal Server Error").status(500);
  }
};

export const deleteAllSlots = async (req: Request, res: Response) => {
  try {
    await SlotsDelete();
    res.json("All Slots Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.json("Internal Server Error").status(500);
  }
};

async function createSlot(
  program_id: ISlot["program_id"],
  start: ISlot["start"],
  end: ISlot["end"]
) {
  // @ts-ignore
  await sqlPool.query<ISlot>("CALL sp_CreateSlot(?,?,?)", [
    program_id,
    start,
    end,
  ]);
}

export async function getSpecificSlotById(id: ISlot["id"]) {
  // @ts-ignore
  const [row] = await sqlPool.query<ISlot>("CALL sp_GetSlotByID(?)", [id]);
  return row;
}

export async function getSlotsQuery() {
  // @ts-ignore
  const [rows] = await sqlPool.query<ISlot[]>("CALL sp_GetSlots()");
  return rows;
}
async function updateSlotById(id: ISlot["id"]) {
  // @ts-ignore
  await sqlPool.query<ISlot>("CALL sp_UpdateSlotByID(?)", [id]);
}

async function deleteSlotById(id: ISlot["id"]) {
  // @ts-ignore
  await sqlPool.query<ISlot>("CALL sp_DeleteSlotByID(?)", [id]);
}

async function SlotsDelete() {
  // @ts-ignore
  await sqlPool.query<ISlot[]>("CALL sp_DeleteAllSlots()");
}

export async function getSlotsByProgramIDQuery(id: ISlot["program_id"]) {
  // @ts-ignore
  const [rows] = await sqlPool.query<ISlot[]>(
    "CALL sp_GetSlotsByProgramID(?)",
    [id]
  );
  return rows[0];
}
