CREATE DEFINER=`root`@`%` PROCEDURE `sp_CheckUserIdHasTwoWeekCancellations`(IN userId INT, OUT result BOOLEAN)
BEGIN
	SELECT COUNT(*) >= 2 INTO result
	FROM appointment
	WHERE user_id = userId
	  AND cancelled = 1
	  AND DATEDIFF(CURDATE(), cancelled_on) BETWEEN 0 AND 6;
END