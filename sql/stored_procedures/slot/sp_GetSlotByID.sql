CREATE DEFINER=`root`@`%` PROCEDURE `sp_GetSlotByID`(IN `p_id` INT)
BEGIN
SELECT * FROM slot WHERE id=p_id;
END