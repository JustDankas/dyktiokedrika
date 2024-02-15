CREATE PROCEDURE `sp_GetTrainers` ()
BEGIN
	select * from user where role = 'trainer';
END
