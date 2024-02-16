CREATE DEFINER=`root`@`%` PROCEDURE `sp_DeleteAllAnnouncements`()
BEGIN
    DELETE FROM announcement;
END