const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(422).json({ errors: [{ field: "missing_field", message: "All fields are required" }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (firstName, lastName, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstName, lastName, email, hashedPassword, phone]
        );

        const user = result.rows[0];

        const orgName = `${firstName}'s Organisation`;
        await pool.query(
            'INSERT INTO organisations (name, description) VALUES ($1, $2) RETURNING *',
            [orgName, `Organisation for ${firstName}`]
        );

        const accessToken = jwt.sign(user, process.env.JWT_SECRET);
        res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: { accessToken, user }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "Bad request", message: "Registration unsuccessful", statusCode: 400 });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ errors: [{ field: "missing_field", message: "Email and password are required" }] });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: "Bad request", message: "Authentication failed", statusCode: 401 });
        }

        const accessToken = jwt.sign(user, process.env.JWT_SECRET);
        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: { accessToken, user }
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "Bad request", message: "Authentication failed", statusCode: 401 });
    }
};

module.exports = { registerUser, loginUser };
