const employeeModel = require('../models/employeeModel');



exports.getEmployees = async (req, res) => {
    try {
        const employees = await employeeModel.find({});
        if(!employees) {
            return res.send({
                message: 'no employees found'
            })
        } else {
            return res.send({
              employeeCount: employees.length,
                employees,
            })
        }
    } catch (error) {
        console.error('failed getting employees', error);
        return res.send({
            message: 'Error getting employees',
            error: error,
        })
    }
}

exports.newEmployee = async (req, res) => {
    try {
        const {firstName, lastName, location, position, isActive} = req.body;
        if(!firstName || !lastName || !location || !position) {
            return res.send({
                message: 'no employees found'
            })
        }
        const employee = new employeeModel({firstName, lastName, location, position, isActive});
        await employee.save();
        return res.send({
            employee,
        })
    } catch (error) {
        console.error('failed to create employee', error);
        return res.send({
            message: 'failed to create employee',
            error: error,
        })
    }
}

exports.getEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await employeeModel.findById(id)
        if (!employee) {
            return res.send({
                message: 'Employee not found'
            })
        } else {
            return res.send({
                employee,
            })
        }


    } catch (error) {
        console.error('failed getting employee', error);
        return res.send({
            message: 'Error getting employee',
            error: error,
        })
    }

}

exports.updateEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const {firstName, lastName, location, position, isActive} = req.body;
        const employee = await employeeModel.findByIdAndUpdate(id, req.body, { new: true });
        if(!employee) {
            return res.send({
                message: 'Employee not found'
            })
        } else {
            return res.send({
                message: 'employee updated successfully',
                employee,
            })
        }
    } catch (error) {
        console.error('failed to update employee', error);
        return res.send({
            message: 'failed to update employee',
            error: error,
        })
    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const employee = await employeeModel.findByIdAndDelete(id);
        if(!employee) {
            return res.send({
                message: 'Employee not found'
            })
        } else {
            return res.send({
                message: 'employee deleted successfully',
                employee,
            })
        }
    } catch (error) {
        console.error('failed to update employee', error);
        return res.send({
            message: 'failed to update employee',
            error: error,
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
            return res.send({
                message: 'employee status changed successfully',
                employee,
            })
        }
    } catch (error) {
        console.error('failed to change employee status', error);
        return res.send({
            message: 'failed to change employee status',
            error: error,
        })
    }
}

