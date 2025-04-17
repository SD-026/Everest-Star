const express = require('express');
const { submitUserData, getUserByCNIC } = require('../controllers/userController');
const router = express.Router();

router.post('/submit', submitUserData);
router.get('/:cnic', getUserByCNIC);

module.exports = router;
