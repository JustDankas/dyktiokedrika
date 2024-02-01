DELIMITER //

CREATE TRIGGER slot_canceled_announcement
BEFORE DELETE ON slot FOR EACH ROW
BEGIN
    -- Call the stored procedure only if the associated program exists
    IF EXISTS (SELECT 1 FROM program WHERE id = OLD.program_id) THEN
        CALL sp_SlotDeletedAnnouncement(OLD.id);
    END IF;
END //

DELIMITER ;
