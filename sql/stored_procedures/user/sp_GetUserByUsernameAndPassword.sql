CREATE DEFINER=`root`@`%` PROCEDURE `sp_GetUserByUsernameAndPassword`(IN `p_username` VARCHAR(255), IN `p_password` VARCHAR(255))
BEGIN
	select name,surname,username,email,id,image,registration_date,role from user where username = p_username AND password=p_password;
END