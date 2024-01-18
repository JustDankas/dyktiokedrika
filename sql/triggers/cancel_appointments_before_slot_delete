CREATE DEFINER=`root`@`%` TRIGGER `cancel_appointments_before_slot_delete` BEFORE DELETE ON `slot` FOR EACH ROW BEGIN
    IF OLD.end < CURRENT_TIMESTAMP THEN
        CALL sp_CancelAppointmentsBySlotID(OLD.id);
    END IF;
END