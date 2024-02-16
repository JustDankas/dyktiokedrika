CREATE DEFINER=`root`@`%` PROCEDURE `sp_CheckIfUserHasAlreadyOneAppointmentActiveForASlot`(IN `p_user_id` INT, IN `p_slot_id` INT)
BEGIN
SELECT * FROM appointment WHERE user_id=p_user_id AND slot_id=p_slot_id AND appointment.cancelled=0 LIMIT 1;
END