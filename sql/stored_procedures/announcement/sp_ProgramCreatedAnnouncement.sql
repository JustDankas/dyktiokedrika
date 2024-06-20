CREATE PROCEDURE `sp_ProgramCreatedAnnouncement` (IN new_program_id INT)
BEGIN
    DECLARE announcement_title VARCHAR(255);
    DECLARE announcement_text TEXT;
	DECLARE announcement_image TEXT;
    
    -- Retrieve information about the new program
    SELECT
        CONCAT('New sector opened: ', p.title),
        CONCAT(
			'A new sector has opened named ', p.title, ' runned by ', t.name, ' ', t.surname, '!<br />',
            'Description:<br />',
            p.description,'<br />',
            'Type: ', p.type,'<br />',
            'Price: ', p.price,'<br />'
        ),
        p.image
    INTO announcement_title, announcement_text, announcement_image
    FROM program p
    JOIN user t on p.trainer_id=t.id
    WHERE p.id = new_program_id;
	
    CALL sp_CreateAnnouncement(announcement_title, announcement_text, announcement_image);
END
