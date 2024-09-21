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