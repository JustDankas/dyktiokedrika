import { Request, Response } from "express";
import { sqlPool } from "../mysqlPool";
import { ISlot, ISlotCreationRequest } from "../models/slot";

export const slotCreate = async (
  req: Request<ISlotCreationRequest>,
  res: Response
) => {
  try {
    const { program_id, seats_available, start, end } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { program_id, seats_available, start, end } = req.body;

    const parsedStartDate = new Date(start);
    const parsedEndDate = new Date(end);
    await createSlot(
      program_id,
      seats_available,
      parsedStartDate,
      parsedEndDate
    );
    res.status(200).send("Slot Successfully created");
    return;
  } catch (createError) {
    console.log(createError);
    res.status(500).send("Internal Server Error");
    return;
  }
};
export const getSlotById = async (req: Request<ISlot["id"]>, res: Response) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const slot = await getSpecificSlotById(req.body);
    res.send(slot).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
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
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    const { program_id } = req.body;

    const programSlots = await getSlotsByProgramID(program_id);
    res.send(programSlots).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const getAllSlots = async (req: Request, res: Response) => {
  try {
    const SlotList = await getSlots();
    res.send(SlotList).status(200);
    return;
  } catch (getError) {
    console.log(getError);
    res.send("Internal Server Error").status(500);
    return;
  }
};
export const updateSlot = async (req: Request<ISlot["id"]>, res: Response) => {
  try {
    const { id } = req.body;
  } catch (deconstructionError) {
    console.log(deconstructionError);
    res.send("Invalid fields in the request form").status(400);
    return;
  }
  try {
    await updateSlotById(req.body);
    res.send("Slot Successfully updated").status(200);
    return;
  } catch (updateError) {
    console.log(updateError);
    res.send("Internal Server Error").status(500);
  }
};
export const SlotDeleteById = async (
  req: Request<ISlot["id"]>,
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
    await deleteSlotById(req.body);
    res.send("Slot Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
  }
};

export const deleteAllSlots = async (req: Request, res: Response) => {
  try {
    await SlotsDelete();
    res.send("All Slots Successfully deleted").status(200);
    return;
  } catch (deleteError) {
    console.log(deleteError);
    res.send("Internal Server Error").status(500);
  }
};

async function createSlot(
  program_id: ISlot["program_id"],
  seats_available: ISlot["seats_available"],
  start: ISlot["start"],
  end: ISlot["end"]
) {
  // @ts-ignore
  await sqlPool.query<ISlot>("CALL sp_CreateSlot(?,?,?,?)", [
    program_id,
    seats_available,
    start,
    end,
  ]);
}

async function getSpecificSlotById(id: ISlot["id"]) {
  // @ts-ignore
  const [row] = await sqlPool.query<ISlot>("CALL sp_GetSlotByID(?)", [id]);
  return row;
}

async function getSlots() {
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

async function getSlotsByProgramID(id: ISlot["program_id"]) {
  // @ts-ignore
  const [rows] = await sqlPool.query<ISlot[]>(
    "CALL sp_GetSlotsByProgramID(?)",
    [id]
  );
  return rows[0];
}
