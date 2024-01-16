DELIMITER //

CREATE TRIGGER create_appointment_count_constraint
BEFORE INSERT ON appointment
FOR EACH ROW
BEGIN
    DECLARE isUserEligible BOOLEAN;

    -- Call the stored procedure to check the condition
    CALL sp_CheckUserIdHasTwoWeekCancellations(NEW.user_id, isUserEligible);

    -- If the condition is met, prevent the insert
    IF isUserEligible THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Appointment not allowed. User has reached the limit of two cancellations within two weeks.';
    END IF;
END //

DELIMITER ;
