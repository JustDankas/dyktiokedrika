CREATE DEFINER=`root`@`%` PROCEDURE `sp_DeleteAnnouncementsByDateRange`(IN `p_startingDate` DATETIME, IN `p_endingDate` DATETIME)
BEGIN
DELETE FROM announcement WHERE created_at >= p_startingDate AND created_at <= p_endingDate;
END