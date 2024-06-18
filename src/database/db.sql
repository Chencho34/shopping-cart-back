CREATE TABLE products (
  id SERIAL PRIMARY KEY, 
  title varchar (255) NOT NULL, 
  img varchar(255), 
  description varchar(255), 
  price int4 NOT NULL, 
  quantity int4 NOT NULL, 
  total int4 NOT NULL
);

CREATE TABLE users (
  user_id SERIAL NOT NULL, 
  user_name varchar(255) UNIQUE, 
  user_email varchar(255) UNIQUE, 
  user_password varchar(255), PRIMARY KEY (user_id)
);