CREATE DEFINER = CURRENT_USER TRIGGER `decrease_slot_seats_after_appointment` 
AFTER INSERT ON `appointment` FOR EACH ROW
BEGIN
    CALL sp_DecreaseSlotSeatsByID(NEW.slot_id);
END