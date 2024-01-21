-- 
-- Not gonna be used after all - The check will be done from the backend.
-- 
CREATE DEFINER = CURRENT_USER TRIGGER cancel_time_constraint
BEFORE UPDATE ON appointment
FOR EACH ROW
BEGIN
    IF NEW.cancelled = 1 AND OLD.cancelled = 0 THEN
        IF TIMESTAMPDIFF(HOUR, NOW(), (SELECT start FROM slot WHERE id = NEW.slot_id)) < 2 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Cannot cancel appointment less than 2 hours before start time';
        END IF;
    END IF;
END;