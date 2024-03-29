DELIMITER //
USE `gymratsDB`;
CREATE PROCEDURE sp_UpdateAnnouncement(
    IN announcementId INT,
    IN newTitle VARCHAR(255),
    IN newText TEXT,
    IN newCreatedAt TIMESTAMP,
    IN newImage LONGTEXT
)
BEGIN
    UPDATE announcement
    SET
        title = newTitle,
        text = newText,
        created_at = newCreatedAt,
        image = newImage
    WHERE id = announcementId;
END //

DELIMITER ;

-- Example of calling the stored procedure
-- CALL sp_UpdateAnnouncement(
--     1,              -- Announcement ID
--     'New Title',    -- New title
--     'New Text',     -- New text
--     NOW(),          -- New created_at timestamp (use CURRENT_TIMESTAMP or specific timestamp)
--     NULL            -- New image blob (replace with the actual blob data if needed)
-- );
