CREATE PROCEDURE `sp_SlotDeletedAnnouncement` (IN deleted_slot_id INT)
BEGIN
    DECLARE announcement_title VARCHAR(255);
    DECLARE announcement_text TEXT;
	DECLARE announcement_image LONGTEXT;

    -- Retrieve information about the deleted slot
     SELECT
        CONCAT(
			'Slot canceled on ',
            p.title
        ),
        CONCAT(
            'Slot ',
            DATE_FORMAT(s.start, '%H:%i'),
            '-',
            DATE_FORMAT(s.end, '%H:%i'),
            ' on ',
            DATE_FORMAT(s.start, '%W, %d/%m/%y'),
            ' of ',
            p.title,
            ' class has been canceled. We\'re sorry for the inconvenience.'
        ),
        p.image
    INTO announcement_title, announcement_text, announcement_image
    FROM slot s
    JOIN program p ON s.program_id = p.id
    WHERE s.id = deleted_slot_id;

    -- Call the stored procedure to create the announcement
    CALL sp_CreateAnnouncement(announcement_title, announcement_text, announcement_image);
END