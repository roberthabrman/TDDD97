drop table if exists user;
drop table if exists loggedinusers;
drop table if exists messages;

CREATE TABLE loggedinusers (
email VARCHAR (20) PRIMARY KEY,
 token VARCHAR (30) NOT NULL
);

create table user (
  email varchar(20) primary key,
  password varchar(20) not null,
  firstname varchar(20) not null,
  familyname varchar(20) not null,
  gender varchar(20) not null,
  city varchar(20) not null,
  country varchar(20) not null,
  salt varchar(40)not null
);


create table messages(
id integer primary key autoincrement,
message VARCHAR (300),
fromuseremail VARCHAR (20),
touseremail VARCHAR (20)
);