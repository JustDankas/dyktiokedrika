-- Delete Program by ID
CREATE PROCEDURE sp_DeleteProgramByID(IN p_program_id INT)
BEGIN
    DELETE FROM program WHERE id = p_program_id;
END