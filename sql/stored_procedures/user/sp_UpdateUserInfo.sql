CREATE DEFINER=`root`@`%` PROCEDURE `sp_UpdateUserInfo`(IN `userId` INT, IN `_username` VARCHAR(255), 
IN `_email` VARCHAR(255), IN `_password` VARCHAR(255), IN `_about` TEXT)
BEGIN
    UPDATE user
    SET
        email = _email,
        username = _username,
        about = _about
    WHERE id = userId and password = _password;
END