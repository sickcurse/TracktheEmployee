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
