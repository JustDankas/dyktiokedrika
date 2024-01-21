CREATE DEFINER = CURRENT_USER TRIGGER `increase_slot_seats_after_appointment_delete` 
AFTER DELETE ON `appointment` FOR EACH ROW
BEGIN
	IF OLD.cancelled = 0 THEN
		CALL sp_IncreaseSlotSeatsByID(OLD.slot_id);
	END IF;
END
