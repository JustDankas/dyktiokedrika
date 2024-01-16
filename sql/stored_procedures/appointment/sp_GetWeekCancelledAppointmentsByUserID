CREATE DEFINER=`root`@`%` PROCEDURE `sp_GetWeekCancelledAppointmentsByUserID`(IN userId INT)
BEGIN
    SELECT user_id, slot_id, cancelled, program_id, start, end
    FROM appointment
    JOIN slot ON appointment.slot_id = slot.id
	  WHERE user_id = userId
      AND cancelled = 1
      AND DATEDIFF(CURDATE(), cancelled_on) BETWEEN 0 AND 6;
END