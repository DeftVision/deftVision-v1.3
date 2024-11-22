const express = require('express');
const router = express.Router();

const { newUser, updateUser, deleteUser, getUsers, login, getUser } = require('../controllers/userController');

router.post('/', newUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/login', login);


module.exports = router;