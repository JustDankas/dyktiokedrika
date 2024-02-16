CREATE DEFINER=`root`@`%` PROCEDURE `sp_GetUsersByRole`(IN `p_role` VARCHAR(255))
BEGIN
	select * from user where role = p_role;
END