CREATE PROCEDURE `sp_SlotCreatedAnnouncement` (IN new_slot_id INT)
BEGIN
    DECLARE announcement_title VARCHAR(255);
    DECLARE announcement_text TEXT;
	DECLARE announcement_image LONGTEXT;

    -- Retrieve information about the created slot
     SELECT
        CONCAT(
			'New slot available on ',
            p.title
        ),
        CONCAT(
            'A new slot for ',
            p.title,
            ' has been created, starting at ',
            DATE_FORMAT(s.start, '%H:%i'),
            '-',
            DATE_FORMAT(s.end, '%H:%i'),
            ' on ',
            DATE_FORMAT(s.start, '%W, %d/%m/%y'),
            '. We are looking forward to seeing you!'
        ),
        p.image
    INTO announcement_title, announcement_text, announcement_image
    FROM slot s
    JOIN program p ON s.program_id = p.id
    WHERE s.id = new_slot_id;

    -- Call the stored procedure to create the announcement
    CALL sp_CreateAnnouncement(announcement_title, announcement_text, announcement_image);
END