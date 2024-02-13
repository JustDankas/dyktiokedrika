-- Create Announcement
CREATE PROCEDURE sp_CreateAnnouncement(
    IN p_title VARCHAR(255),
    IN p_text TEXT,
    IN p_created_at TIMESTAMP,
    IN p_image LONGTEXT
)
BEGIN
    INSERT INTO announcement (title, text, created_at, image)
    VALUES (p_title, p_text, p_created_at, p_image);
END