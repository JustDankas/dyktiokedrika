DELIMITER //

CREATE TRIGGER before_delete_program
BEFORE DELETE ON program FOR EACH ROW
BEGIN
    -- Call the stored procedure to create the announcement
    CALL sp_ProgramDeletedAnnouncement(OLD.title, OLD.image);
END //

DELIMITER ;
