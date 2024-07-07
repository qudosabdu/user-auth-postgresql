const express = require('express');
const { getOrganisations, getOrganisation, createOrganisation, addUserToOrganisation } = require('../controllers/orgController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getOrganisations);
router.get('/:orgId', authenticateToken, getOrganisation);
router.post('/', authenticateToken, createOrganisation);
router.post('/:orgId/users', authenticateToken, addUserToOrganisation);

module.exports = router;
