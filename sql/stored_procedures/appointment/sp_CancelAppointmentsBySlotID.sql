CREATE PROCEDURE sp_CancelAppointmentsBySlotID(p_slot_id INT)
BEGIN
    -- Update appointments to mark them as cancelled for the specified slot
    UPDATE appointment
    SET cancelled = 1
    WHERE slot_id = p_slot_id AND cancelled = 0;
END