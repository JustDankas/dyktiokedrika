CREATE PROCEDURE sp_UpdateUser(
    IN userId INT,
    IN newName VARCHAR(255),
    IN newSurname VARCHAR(255),
    IN newEmail VARCHAR(255),
    IN newUsername VARCHAR(255),
    IN newPassword VARCHAR(255),
    IN newImage LONGTEXT,
    IN newAbout LONGTEXT
)
BEGIN
    UPDATE user
    SET
        name = newName,
        surname = newSurname,
        email = newEmail,
        username = newUsername,
        password = newPassword,
        image = newImage,
        about = newAbout
    WHERE id = userId;
END 

-- Example of calling the stored procedure
-- CALL sp_UpdateUser(
--     1, -- Replace with the actual user ID
--     'New Name',
--     'New Surname',
--     'newuser@example.com',
--     'newusername',
--     'newpassword',
--     NULL,  -- Replace with actual blob data if needed
--     '2022-01-15 12:00:00', -- Replace with the actual registration date
--     'user'
-- );