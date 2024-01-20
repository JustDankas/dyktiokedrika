DELIMITER //

CREATE PROCEDURE sp_UpdateAddressByID(
    IN addressId INT,
    IN newCountry VARCHAR(255),
    IN newCity VARCHAR(255),
    IN newStreet VARCHAR(255)
)
BEGIN
    UPDATE address
    SET country = newCountry, city = newCity, street = newStreet
    WHERE id = addressId;
END //

DELIMITER ;
