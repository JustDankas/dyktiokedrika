CREATE PROCEDURE `sp_IncreaseSlotSeatsByID` (IN slotID int)
BEGIN
	UPDATE slot
    SET seats_available = seats_available + 1
    WHERE id = slotID;
END
