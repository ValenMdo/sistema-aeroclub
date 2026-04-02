create database sist_aeroclubes;
use sist_aeroclubes;

insert into usuario (bloqueado, email, nombre, password, rol) values(0,'test@test.com','valen TEST', '1234','ADMIN');

select * from usuario;
select * from avion;
select * from mantenimiento;
select * from vuelo;
select * from estudiante;