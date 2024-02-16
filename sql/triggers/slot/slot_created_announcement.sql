DELIMITER //

CREATE TRIGGER slot_created_announcement
AFTER INSERT ON slot FOR EACH ROW
BEGIN
    CALL sp_SlotCreatedAnnouncement(NEW.id);
END //

DELIMITER ;
