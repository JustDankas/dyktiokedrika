CREATE DEFINER = CURRENT_USER TRIGGER `initialize_seats_available` 
BEFORE INSERT ON `slot` FOR EACH ROW
BEGIN
	SET NEW.seats_available = (SELECT max_size FROM program WHERE id = NEW.program_id);
END