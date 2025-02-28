const express = require('express');
const router = express.Router();

const {
    newUser,
    updateUser,
    deleteUser,
    getUsers,
    login,
    getUser,
    toggleActiveStatus,
    forgotPassword,
    resetPassword
} = require('../controllers/userController');

router.patch('/:id', updateUser);

router.delete('/:id', deleteUser);

router.get('/', getUsers);

router.get('/:id', getUser);
router.post('/login', login);
//router.patch('/status/:id', toggleActiveStatus)

// forgot password end points


router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword);

router.post('/', newUser);
router.post('/login', login);

router.get('/', (req, res) => {
    res.json({ message: 'user endpoint is working'})
})


module.exports = router;
