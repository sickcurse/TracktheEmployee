
DELETE FROM employee;
DELETE FROM role;
DELETE FROM department;


ALTER SEQUENCE department_id_seq RESTART WITH 1;
ALTER SEQUENCE role_id_seq RESTART WITH 1;
ALTER SEQUENCE employee_id_seq RESTART WITH 1;


INSERT INTO department (id, name)
VALUES 
    (1, 'Human Resources'),
    (2, 'Marketing'),
    (3, 'Operations'),
    (4, 'IT Support');


INSERT INTO role (title, salary, department_id)
VALUES 
    ('HR Manager', 95000, 1),
    ('Recruiter', 65000, 1),
    ('Marketing Director', 110000, 2),
    ('Content Creator', 70000, 2),
    ('Operations Lead', 120000, 3),
    ('Operations Coordinator', 75000, 3),
    ('IT Support Lead', 85000, 4),
    ('IT Technician', 60000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Alice', 'Smith', 1, NULL),
    ('Bob', 'Johnson', 2, 1),
    ('Catherine', 'Jones', 3, NULL),
    ('David', 'Lee', 4, 3),
    ('Emily', 'Davis', 5, NULL),
    ('Frank', 'Wright', 6, 5),
    ('Grace', 'Walker', 7, NULL),
    ('Henry', 'Hill', 8, 7);
