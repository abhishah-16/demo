create table "user"(
    id serial primary key,
    name varchar(250),
    contactnumber varchar(20),
    email varchar(250),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
);

insert into "user"(name,contactnumber,email,password,status,role) values('admin','1234567897','admin@gmail.com','admin','true','admin');

create table category (
    id serial primary key,
    name varchar(250)
);
create table product (
     id serial primary key,
     name varchar(255),
     categoryid int ,
     description varchar(255),
     price int,
     status varchar(20)
);

INSERT INTO product(name,categoryid,description,price ,status) VALUES($1,$2,$3,$4,$5)

create table bill (
    id serial primary key,
    uuid varchar (255),
    name varchar (255),
    email varchar (255),
    contactnumber varchar (20),
    paymentmethod varchar (255),
    total int,
    productDetail JSON DEFAULT NULL,
    createdBy varchar(255)
);