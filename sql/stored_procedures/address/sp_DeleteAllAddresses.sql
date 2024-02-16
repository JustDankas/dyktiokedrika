CREATE DEFINER=`root`@`%` PROCEDURE `sp_DeleteAllAddresses`()
BEGIN
DELETE FROM address;
END