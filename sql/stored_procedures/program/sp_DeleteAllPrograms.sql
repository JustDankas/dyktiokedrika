CREATE DEFINER=`root`@`%` PROCEDURE `sp_DeleteAllPrograms`()
BEGIN
Delete from program;
END