CREATE DEFINER=`root`@`%` PROCEDURE `sp_UpdateSlotByID`(
    IN p_slot_id INT,
    IN p_program_id INT,
    IN p_seats_available INT,
    IN p_start TIMESTAMP,
    IN p_end TIMESTAMP
)
BEGIN
    UPDATE slot
    SET
        program_id = p_program_id,
        seats_available = p_seats_available,
        start = p_start,
        end = p_end
    WHERE id = p_slot_id;
END