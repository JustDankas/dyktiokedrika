CREATE DEFINER=`root`@`%` PROCEDURE `sp_CheckIfUserHasAlreadyCancelledTwoAppointmentsInTheSameWeek`(IN `p_user_id` INT, IN `oldest_cancellation_of_the_two` TINYINT)
BEGIN 
    WITH CancelledAppointments AS (
        SELECT *
        FROM appointment
        WHERE appointment.user_id = p_user_id
          AND appointment.cancelled = 1
          AND TIMESTAMPDIFF(SECOND, NOW(), cancelled_on) < 7 * 24 * 3600 
        ORDER BY appointment.cancelled_on DESC
        LIMIT 2 
    )
    SELECT *
    FROM CancelledAppointments
    WHERE (SELECT COUNT(*) FROM CancelledAppointments) = 2
    /* Casting oldest_cancellation_of_the_two 1 if is true, 0 otherwise */
    LIMIT 1 OFFSET oldest_cancellation_of_the_two;
END