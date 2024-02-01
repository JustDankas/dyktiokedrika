DELIMITER //

CREATE PROCEDURE sp_CreateSlotsForWeeks(
    IN p_program_id INT,
    IN p_slot_start TIMESTAMP,
    IN p_slot_end TIMESTAMP,
    IN p_recurring_until TIMESTAMP
)
BEGIN
    DECLARE current_slot_start TIMESTAMP;
    DECLARE current_slot_end TIMESTAMP;

    SET current_slot_start = p_slot_start;
    SET current_slot_end = p_slot_end;

    WHILE current_slot_start <= p_recurring_until DO
        -- Call sp_CreateSlot for the current slot
        CALL sp_CreateSlot(p_program_id, current_slot_start, current_slot_end);

        -- Move to next week
        SET current_slot_start = DATE_ADD(current_slot_start, INTERVAL 7 DAY);
        SET current_slot_end = DATE_ADD(current_slot_end, INTERVAL 7 DAY);
    END WHILE;
END //

DELIMITER ;