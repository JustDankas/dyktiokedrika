CREATE PROCEDURE `sp_Admins` ()
BEGIN
	select * from user where role = 'admin';
END
