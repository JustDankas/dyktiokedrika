-- Update Program by ID
CREATE PROCEDURE sp_UpdateProgramByID(
    IN p_program_id INT,
    IN p_trainer_id INT,
    IN p_title VARCHAR(255),
    IN p_description LONGTEXT,
    IN p_type VARCHAR(255),
    IN p_price DECIMAL(8,2),
    IN p_is_group TINYINT(1),
    IN p_max_size INT,
    IN p_image LONGTEXT
)
BEGIN
    UPDATE program
    SET
        trainer_id = p_trainer_id,
        title = p_title,
        description = p_description,
        type = p_type,
        price = p_price,
        is_group = p_is_group,
        max_size = p_max_size,
        image = p_image
    WHERE id = p_program_id;
END