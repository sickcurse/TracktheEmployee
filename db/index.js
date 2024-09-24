const pool = require('./connection');

class DB {
  async query(sql, args = []) {
    const client = await pool.connect();
    try {
      const result = await client.query(sql, args);
      return result;
    } finally {
      client.release();
    }
  }

  // Define all the methods you're trying to call in your app, like:
  findAllEmployees() {
    return this.query('SELECT * FROM employee');
  }

  findAllRoles() {
    return this.query('SELECT * FROM role');
  }

  findAllDepartments() {
    return this.query('SELECT * FROM department');
  }

  createDepartment(department) {
    return this.query('INSERT INTO department (name) VALUES ($1)', [department.name]);
  }

  // Add other necessary methods here...
}

module.exports = new DB();
