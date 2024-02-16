CREATE DEFINER=`root`@`%` PROCEDURE `sp_DeleteAllSlots`()
BEGIN
DELETE from slot;
END