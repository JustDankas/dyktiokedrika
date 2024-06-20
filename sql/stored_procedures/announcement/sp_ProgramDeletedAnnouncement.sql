CREATE PROCEDURE `sp_ProgramDeletedAnnouncement` (IN deleted_title VARCHAR(255), deleted_image LONGTEXT)
BEGIN
    DECLARE announcement_title VARCHAR(255);
    DECLARE announcement_text TEXT;

    SET announcement_title = CONCAT(deleted_title, 'sector was closed');
    SET announcement_text = CONCAT('The sector "', deleted_title, '" has been closed. Thank you for your understanding.');

    CALL sp_CreateAnnouncement(announcement_title, announcement_text, deleted_image);
END
