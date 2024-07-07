const pool = require('../db');

const createOrganisationTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS organisations (
        orgId SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
    )`;

    await pool.query(query);
};

createOrganisationTable();
