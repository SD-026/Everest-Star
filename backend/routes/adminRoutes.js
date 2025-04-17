const express = require('express');
const { loginAdmin, getAllUsers, exportUsers,createadmin } = require('../controllers/adminController');
// const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/login', loginAdmin);
router.post('/createadmin', createadmin);

router.get('/users',  getAllUsers);
router.get('/export',  exportUsers);

module.exports = router;
