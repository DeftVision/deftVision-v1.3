const express = require('express');
const router = express.Router();

const { newUser, updateUser, deleteUser, getUsers, login, getUser, toggleActiveStatus } = require('../controllers/userController');

router.post('/', newUser);

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/login', login);

router.patch('/status/:id', toggleActiveStatus)


module.exports = router;