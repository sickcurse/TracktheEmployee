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