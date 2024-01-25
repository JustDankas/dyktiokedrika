CREATE PROCEDURE sp_GetProgramAndTrainerBySlotID(IN slotId INT)
BEGIN
    SELECT
        slot.id AS slot_id,
        program.id AS program_id,
        program.trainer_id,
        program.title,
        slot.start,
        slot.end,
        program.max_size,
        slot.seats_available,
        program.description,
        program.price,
        program.type,
        program.is_group,
        program.image,
        user.name AS trainer_name,
        user.surname AS trainer_surname,
        user.image AS trainer_image,
        user.about AS trainer_about
    FROM slot
    JOIN program ON slot.program_id = program.id
    JOIN user ON program.trainer_id = user.id
    WHERE slot.id = slotId;
END