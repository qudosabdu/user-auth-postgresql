const pool = require('../db');

const getUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM users WHERE userId = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ status: "Not found", message: "User not found", statusCode: 404 });
        }

        res.status(200).json({
            status: "success",
            message: "User retrieved successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "Bad request", message: "Unable to retrieve user", statusCode: 400 });
    }
};

module.exports = { getUser };
