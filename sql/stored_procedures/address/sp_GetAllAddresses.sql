CREATE DEFINER=`root`@`%` PROCEDURE `sp_GetAllAddresses`()
BEGIN
SELECT * FROM address ORDER BY user_id;
END