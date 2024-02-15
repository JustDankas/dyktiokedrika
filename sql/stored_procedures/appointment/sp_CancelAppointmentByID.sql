DELIMITER //

CREATE PROCEDURE sp_CancelAppointmentByID(IN p_appointment_id INT)
BEGIN
    UPDATE appointment
    SET 
		cancelled = 1,
        cancelled_on = CURRENT_TIMESTAMP
    WHERE id = p_appointment_id;
END //

DELIMITER ;