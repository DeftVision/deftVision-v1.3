const employeeModel = require('../models/employeeModel');



exports.getEmployees = async (req, res) => {
    try {
        console.log("🔹 Fetching employees from database...");

        const employees = await employeeModel.find({});

        console.log("🔹 Employees Found:", employees);

        if (!employees || employees.length === 0) {
            console.warn("No employees found in database");
            return res.status(404).json({ message: 'No employees found' });
        }

        res.status(200).json({ employees });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};


exports.newEmployee = async (req, res) => {
    try {
        let employees = req.body;

        // Ensure the request contains an array, or convert a single object into an array
        if (!Array.isArray(employees)) {
            employees = [employees];
        }

        // Validate each employee
        for (const employee of employees) {
            const { firstName, lastName, position, location, isActive } = employee;

            if (!firstName || !lastName || !position || !location) {
                return res.status(400).json({ message: "Missing required fields" });
            }
        }

        // Set default value for `isActive` if not provided
        const processedEmployees = employees.map((employee) => ({
            ...employee,
            isActive: employee.isActive !== undefined ? employee.isActive : true,
        }));

        // Save to the database using insertMany
        const savedEmployees = await employeeModel.insertMany(processedEmployees);

        return res.status(201).json({
            message: "Employees registered successfully",
            employees: savedEmployees,
        });
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message || error,
        });
    }
};




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

