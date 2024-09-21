const pool = require('./connection');

class Database {
  constructor() {}

  async executeQuery(sql, params = []) {
    const client = await pool.connect();
    try {
      const data = await client.query(sql, params);
      return data;
    } finally {
      client.release();
    }
  }

  getAllEmployees() {
    return this.executeQuery(
      `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager 
      FROM employee e 
      LEFT JOIN role r ON e.role_id = r.id 
      LEFT JOIN department d ON r.department_id = d.id 
      LEFT JOIN employee m ON m.id = e.manager_id;`
    );
  }

  getManagersExcluding(employeeId) {
    return this.executeQuery(
      'SELECT id, first_name, last_name FROM employee WHERE id != $1',
      [employeeId]
    );
  }

  addEmployee(employeeData) {
    const { first_name, last_name, role_id, manager_id } = employeeData;
    return this.executeQuery(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
      [first_name, last_name, role_id, manager_id]
    );
  }

  deleteEmployee(employeeId) {
    return this.executeQuery('DELETE FROM employee WHERE id = $1', [employeeId]);
  }

  updateRole(employeeId, newRoleId) {
    return this.executeQuery(
      'UPDATE employee SET role_id = $1 WHERE id = $2',
      [newRoleId, employeeId]
    );
  }

  updateManager(employeeId, newManagerId) {
    return this.executeQuery(
      'UPDATE employee SET manager_id = $1 WHERE id = $2',
      [newManagerId, employeeId]
    );
  }

  getAllRoles() {
    return this.executeQuery(
      'SELECT r.id, r.title, d.name AS department, r.salary FROM role r LEFT JOIN department d ON r.department_id = d.id;'
    );
  }

  addRole(roleData) {
    const { title, salary, department_id } = roleData;
    return this.executeQuery(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
      [title, salary, department_id]
    );
  }

  deleteRole(roleId) {
    return this.executeQuery('DELETE FROM role WHERE id = $1', [roleId]);
  }

  getAllDepartments() {
    return this.executeQuery('SELECT id, name FROM department;');
  }

  getDepartmentBudgets() {
    return this.executeQuery(
      `SELECT d.id, d.name, SUM(r.salary) AS total_budget 
      FROM employee e 
      LEFT JOIN role r ON e.role_id = r.id 
      LEFT JOIN department d ON r.department_id = d.id 
      GROUP BY d.id, d.name;`
    );
  }


