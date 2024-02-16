CREATE DEFINER=`root`@`%` PROCEDURE `sp_UpdateUserPfp`(IN `p_image` LONGBLOB, IN `p_id` INT)
BEGIN
    update user set image = p_image
    Where id = p_id;
END