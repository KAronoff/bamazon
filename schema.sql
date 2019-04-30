CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(70) NOT NULL,
  department VARCHAR(50) NOT NULL,
  price DECIMAL(5, 2) default 0,
  instock DECIMAL(5) default 0,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department, price, instock)
VALUES ("Tennis Racket", "Outdoor", 19.99, 8),
  ("Porch Swing", "Outdoor", 49.99, 18),
  ("Guardians of the Galaxy BlueRay", "Entertainment", 19.99, 4),
  ("Through the Looking Glass", "Book", 5.99, 10),
  ("Lirael", "Book", 13.5, 12);