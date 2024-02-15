CREATE PROCEDURE `GetUserById`(IN userId INT)
BEGIN
    SELECT * FROM gymratsDB.user WHERE id = userId;
END