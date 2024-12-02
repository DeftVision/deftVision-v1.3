const express = require('express');
const router = express.Router();


const { getEmployees, newEmployee, getEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus } = require('../controllers/employeeController');

router.post('/', newEmployee);

router.get('/', getEmployees);
router.get('/:id', getEmployee);

router.patch('/:id', updateEmployee);

router.delete('/:id', deleteEmployee);


router.patch('/toggle/:id', toggleEmployeeStatus);


module.exports = router;