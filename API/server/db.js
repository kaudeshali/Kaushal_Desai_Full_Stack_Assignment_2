// Importing necessary modules from MongoDB.
const { MongoClient, ObjectId } = require('mongodb');

// Declaring global variables.
let db;
const db_url =  process.env.DB_URL;

// Function to establish database connection.
async function dbConnection() {
    const client = new MongoClient(db_url, { useNewUrlParser: true });

    // Connecting to the database.
    await client.connect();
    console.log('Connected to db');

    // Storing database reference in global variable.
    db = client.db(); 
}

// Function to fetch all employees from the database.
async function fetchEmployee() {
    // Fetching all employees from 'employees' collection.
    const emp = await db.collection('employees').find({}).toArray();
    return emp;
}

// Function to fetch employee by ID from the database.
async function fetchEmployeeById(employeeId) {
    // Fetching employee by ID from 'employees' collection.
    const emp = await db.collection('employees').findOne({ EmployeeID: employeeId });
    return emp;
}

// Function to insert employee into the database.
async function insertEmployee(employee) {
    // Inserting employee into 'employees' collection.
    const result = await db.collection('employees').insertOne(employee);
    // Logging inserted employee.
    console.log(employee)
    return employee;
}

// Function to get the next employee ID from the database.
async function getNextEmployeeID(field) {
    const result = await db
        .collection("IDTrack")
        .findOneAndUpdate(
            // Querying document by name.
            { name: field },
            // Incrementing current ID.
            { $inc: { currentID: 1 } },
            {
                // Returning updated document.
                returnDocument: 'after',
                // Creating document if not exists.
                upsert: true,
            }
        );
        // Logging updated document.
    console.log(result);
    // Returning current ID.
    return result.currentID;
}

// Function to delete employee from the database by ID.
async function deleteEmployee(employeeId) {
    const resul = await db.collection('employees').deleteOne({ EmployeeID: employeeId });
    return { success: resul.deletedCount > 0, deletedCount: resul.deletedCount };
}

// Function to update employee in the database by ID.
async function updateEmployee(employeeId, updatedEmployee) {
    const resul = await db.collection('employees').updateOne(
        { EmployeeID: employeeId },
        { $set: updatedEmployee }
    );
    return { success: resul.modifiedCount > 0, modifiedCount: resul.modifiedCount };
}

// Exporting functions to be used externally.
module.exports = { dbConnection, fetchEmployee, fetchEmployeeById, insertEmployee, deleteEmployee, updateEmployee,getNextEmployeeID };
