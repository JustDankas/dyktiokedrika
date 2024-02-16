CREATE PROCEDURE `sp_GetAnnouncements` (IN maxInput INT)
BEGIN
    IF maxInput IS NULL OR maxInput <= 0 THEN
        SELECT * FROM announcement ORDER BY created_at DESC;
    ELSE
        SELECT * FROM announcement ORDER BY created_at DESC LIMIT maxInput;
    END IF;
END;
