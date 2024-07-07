const pool = require('../db');

const getOrganisations = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM organisations');
        const organisations = result.rows;

        res.status(200).json({
            status: "success",
            message: "Organisations retrieved successfully",
            data: { organisations }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "Bad request", message: "Unable to retrieve organisations", statusCode: 400 });
    }
};

const getOrganisation = async (req, res) => {
    const orgId = req.params.orgId;

    try {
        const result = await pool.query('SELECT * FROM organisations WHERE orgId = $1', [orgId]);
        const organisation = result.rows[0];

        if (!organisation) {
            return res.status(404).json({ status: "Not found", message: "Organisation not found", statusCode: 404 });
        }

        res.status(200).json({
            status: "success",
            message: "Organisation retrieved successfully",
            data: organisation
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "Bad request", message: "Unable to retrieve organisation", statusCode: 400 });
    }
};

const createOrganisation = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(422).json({ errors: [{ field: "name", message: "Name is required" }] });
    }

    try {
        const result = await pool.query(
            'INSERT INTO organisations (name, description) VALUES ($1, $2) RETURNING *',
            [name, description]
        );

        const organisation = result.rows[0];

        res.status(201).json({
            status: "success",
            message: "Organisation created successfully",
            data: organisation
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "Bad request", message: "Unable to create organisation", statusCode: 400 });
    }
};

const addUserToOrganisation = async (req, res) => {
    const { userId } = req.body;
    const orgId = req.params.orgId;

    try {
        const result = await pool.query(
            'INSERT INTO user_organisations (userId, orgId) VALUES ($1, $2) RETURNING *',
            [userId, orgId]
        );

        res.status(200).json({
            status: "success",
            message: "User added to organisation successfully",
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "Bad request", message: "Unable to add user to organisation", statusCode: 400 });
    }
};

module.exports = { getOrganisations, getOrganisation, createOrganisation, addUserToOrganisation };
