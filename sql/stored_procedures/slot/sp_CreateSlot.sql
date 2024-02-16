-- Create Slot
CREATE PROCEDURE sp_CreateSlot(
    IN p_program_id INT,
    IN p_start TIMESTAMP,
    IN p_end TIMESTAMP
)
BEGIN
    INSERT INTO slot (program_id, start, end)
    VALUES (p_program_id, p_start, p_end);
END