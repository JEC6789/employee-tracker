const mysql = require("mysql2");

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "?v=LrXtlP6Wk4g",
        database: "employee_tracker_jec"
    },
    console.log("Connected to the employee tracker database.")
);

module.exports = db;