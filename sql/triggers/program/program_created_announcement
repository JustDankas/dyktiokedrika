DELIMITER //

CREATE TRIGGER program_created_announcement
AFTER INSERT ON program FOR EACH ROW
BEGIN
    -- Call the stored procedure to create the announcement
    CALL sp_ProgramCreatedAnnouncement(NEW.id);
END //

DELIMITER ;
