DELIMITER //

-- Create Appointment
CREATE PROCEDURE sp_CreateAppointment(
    IN p_user_id INT,
    IN p_slot_id INT
)
BEGIN
    INSERT INTO appointment (user_id, slot_id)
    VALUES (p_user_id, p_slot_id);
END //

DELIMITER ;
