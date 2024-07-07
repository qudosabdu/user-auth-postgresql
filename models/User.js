const pool = require('../db');

const createUserTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
        userId SERIAL PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone VARCHAR(20)
    )`;

    await pool.query(query);
};

createUserTable();
