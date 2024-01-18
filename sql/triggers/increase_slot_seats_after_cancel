CREATE DEFINER = CURRENT_USER TRIGGER `increase_slot_seats_after_cancel` 
AFTER UPDATE ON `appointment` FOR EACH ROW
BEGIN
    IF NEW.cancelled = 1 AND OLD.cancelled = 0 THEN
        CALL sp_IncreaseSlotSeatsByID(NEW.slot_id);
    END IF;
END

