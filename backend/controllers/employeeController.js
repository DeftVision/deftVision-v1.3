const employeeModel = require('../models/employeeModel');



exports.getEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.find({});
        if(!employees || employees.length === 0) {
            return res.status(400).send({
                message: 'employees not found'
            })
        } else {
            return res.status(200).send({
              employeeCount: employees.length,
                employees,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'getting employee by id - server error',
            error: error.message || error,
        })
    }
}

exports.newEmployee = async (req, res) => {
    try {
        const {firstName, lastName, location, position, isActive} = req.body;
        if(!firstName || !lastName || !location || !position) {
            return res.status(400).send({
                message: 'employees not found'
            })
        }
        const employee = new employeeModel({firstName, lastName, location, position, isActive});
        await employee.save();
        return res.status(201).send({
            message: 'employees registered successfully',
            employee,
        })
    } catch (error) {
        return res.status(500).end({
            message: 'deleting an employee - server error',
            error: error.message || error,
        })
    }
}

exports.getEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await employeeModel.findById(id)
        if (!employee) {
            return res.status(400).send({
                message: 'employee not found'
            })
        } else {
            return res.status(200).send({
                employee,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'getting employee by id - server error',
            error: error.message || error,
        })
    }

}

exports.updateEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const {firstName, lastName, location, position, isActive} = req.body;
        const employee = await employeeModel.findByIdAndUpdate(id, req.body, { new: true });
        if(!employee) {
            return res.status(400).end({
                message: 'employee not found'
            })
        } else {
            return res.status(201).send({
                message: 'employee was updated successfully',
                employee,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'updating employee by id - server error',
            error: error.message || error,
        })
    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await employeeModel.findByIdAndDelete(id);
        if(!employee) {
            return res.status(400).send({
                message: 'employee not found'
            })
        } else {
            return res.status(201).send({
                message: 'employee deleted successfully',
                employee,
            })
        }
    } catch (error) {
        return res.status(500).send({
            message: 'deleting employee by id - server error',
            error: error.message || error,
        })
    }
}

exports.toggleEmployeeStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {isActive} = req.body;
        const employee = await employeeModel.findByIdAndUpdate(id, req.body, { new: true });
        if(!employee) {
            return res.status(404).send({
                message: 'Employee not found'
            })
        } else {
            return res.status(201).send({
                message: 'employee status updated successfully',
                employee,
            })
        }
    } catch (error) {
        return res.status(500).end({
            message: 'update employee status by id - server error',
            error: error.message || error,
        })
    }
}

