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
('Marketing Manager', 67000, 3), ('Marketing Coordinator', 45000, 3),
('Productions Manager', 104800, 4), ('Production Coordinator', 50000, 4),  
('Operations Manager', 800000, 5), ('Operations Coordinator', 43600, 5), 
('HR Generalist', 37500, 6), 
('Attorney/Lawyer', 126000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('David', 'Wallace', 1, 0),
('Pam', 'Beelsy', 3, 1),
('Jim', 'Halpert', 10, 0),
('Dwight', 'Schrute', 11, 3),
('Angela', 'Martin', 4, 0),
('Kevin', 'Malone', 5, 5);

-- SELECT * FROM depart;
-- SELECT * FROM role;
-- SELECT * FROM employee;

-- SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, depart.name AS department,
-- CONCAT(mng.first_name,' ', mng.last_name) AS manager FROM employee
-- JOIN role ON role.id = employee.role_id
-- JOIN depart ON depart.id = role.depart_id
-- LEFT JOIN employee AS mng ON employee.manager_id = mng.id;

-- SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee JOIN role ON role.id = employee.role_id JOIN depart ON depart.id = role.depart_id LEFT JOIN employee AS mng ON employee.manager_id = mng.id WHERE employee.manager_id IS NOT NULL;