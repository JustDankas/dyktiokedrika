CREATE DEFINER=`root`@`%` PROCEDURE `sp_CreateProgram`(
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
    INSERT INTO program (trainer_id, title, description, type, price, is_group, max_size, p_image)
    VALUES (p_trainer_id, p_title, p_description, p_type, p_price, p_is_group, p_max_size);
END