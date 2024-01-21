CREATE DEFINER=`root`@`%` PROCEDURE `sp_UpdateUserRoleByID`(IN userId INT, IN newRole ENUM('admin','trainer','user','notAssigned'))
BEGIN
    UPDATE user
    SET role = newRole
    WHERE id = userId;
END
