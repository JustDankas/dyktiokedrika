CREATE DEFINER=`root`@`%` PROCEDURE `sp_DeleteAllUsersExceptAdmins`(IN `p_role` VARCHAR(255))
BEGIN
DELETE FROM user WHERE role <> p_role;
END