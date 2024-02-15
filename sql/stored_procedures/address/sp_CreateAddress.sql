DELIMITER //

CREATE PROCEDURE sp_CreateAddress(
    IN userId INT,
    IN country VARCHAR(255),
    IN city VARCHAR(255),
    IN street VARCHAR(255)
)
BEGIN
    INSERT INTO address (user_id, country, city, street)
    VALUES (userId, country, city, street);
END //

DELIMITER ;
