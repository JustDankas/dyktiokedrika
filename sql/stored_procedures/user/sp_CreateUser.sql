CREATE DEFINER=`root`@`%` PROCEDURE `sp_CreateUser`(
    IN newName VARCHAR(255),
    IN newSurname VARCHAR(255),
    IN newEmail VARCHAR(255),
    IN newUsername VARCHAR(255),
    IN newPassword VARCHAR(255),
    IN newCountry VARCHAR(255),
    IN newCity VARCHAR(255),
    IN newStreet VARCHAR(255)
)
BEGIN
	DECLARE new_document_id INT;
    INSERT INTO user(name, surname, email, username, password)
    VALUES (newName, newSurname, newEmail, newUsername, newPassword);
    SET new_document_id = last_insert_id();
    call sp_CreateAddress(new_document_id,newCountry,newCity,newStreet);
END