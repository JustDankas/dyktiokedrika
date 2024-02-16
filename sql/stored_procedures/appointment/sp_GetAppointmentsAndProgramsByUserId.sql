CREATE DEFINER=`root`@`%` PROCEDURE `sp_GetAppointmentsAndProgramsByUserId`(IN `p_user_id` INT)
BEGIN
	Select a.id as appointment_id,a.cancelled,a.cancelled_on,p.*,slot.start
    From appointment as a
    Join slot On a.slot_id = slot.id
    Join program as p On slot.program_id = p.id
    Join user as u On a.user_id = u.id
    Where u.id = p_user_id;
END