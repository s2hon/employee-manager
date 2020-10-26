DROP DATABASE IF EXISTS all_employeeDB;

CREATE DATABASE all_employeeDB;

USE all_employeeDB;

CREATE TABLE depart (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL (10,2) NOT NULL,
    depart_id INT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
);

INSERT INTO depart (name)
VALUES ('Executive'),('Accounting/Finance'),('Marketing'),('Production'),('Operations'),('HR'),('Legal');

INSERT INTO role (title, salary, depart_id)
VALUES
('CFO', 820000, 1), ('VP', 130000, 1),('Executive Assistant', 45000, 1),
('Accounting Manager', 105000, 2), ('Accountant', 70000, 2),
('Marketing_Manager', 67000, 3), ('Marketing Coordinator', 45000, 3),
('Productions_Manager', 104800, 4), ('Production Coordinator', 50000, 4),  
('Operations Manager', 800000, 5), ('Operations Coordinator', 43600, 5), 
('HR Manager', 700000, 6), ('HR Generalist', 37500, 6), 
('Attorney/Lawyer', 126000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('David', 'Wallace', 1, 0),
('Pam', 'Beelsy', 1, 0),
('Jim', 'Halpert', 5, 1),
('Dwight', 'Schrute', 5, 0),
('Angela', 'Martin', 2, 2),
('Kevin', 'Malone', 2, 0);

SELECT * FROM depart;
SELECT * FROM role;
SELECT * FROM employee;