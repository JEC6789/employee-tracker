const cTable = require("console.table");
const db = require("./db/connection.js");
const inquirer = require("inquirer");

const promptUser = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "whatToDo",
            message: "What would you like to do?",
            choices: ["End Program", "View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"]
        }
    ])
    .then(promptController)
    .catch(err => {
        console.log(err);
    });
};

const promptController = input => {
    let sql;
    let thing;

    switch(input.whatToDo) {
        case "End Program":
            return console.log("... ok bye");
        case "View Departments":
            sql = `SELECT * FROM department`;
            db.query(sql, (err, rows) => {
                if(err) {
                    return console.log(err.message);
                }
                console.table(rows);
                promptUser();
            });
            break;
        case "View Roles":
            sql = `SELECT role.*, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`;
            db.query(sql, (err, rows) => {
                if(err) {
                    return console.log(err.message);
                }
                console.table(rows);
                promptUser();
            });
            break;
        case "View Employees":
            sql = `SELECT employee.*, role.title AS role FROM employee LEFT JOIN role ON employee.role_id = role.id`;
            db.query(sql, (err, rows) => {
                if(err) {
                    return console.log(err.message);
                }
                console.table(rows);
                promptUser();
            });
            break;
        case "Add Department":
            thing = "department";
            addThingPrompt(thing);
            break;
        case "Add Role":
            thing = "role";
            addThingPrompt(thing);
            break;
        case "Add Employee":
            thing = "employee";
            addThingPrompt(thing);
            break;
        default:
            return console.log("Congratulations. You just triggered this console message, which you should not be able to get under any circumstance. If you're not me, go ahead and report this issue at https://github.com/JEC6789/employee-tracker/issues so I can look into it further.");
    }
};

const addThingPrompt = thing => {
    if(thing === "department") {
        return inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of the department?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("A department with no name? Sounds pretty ominous, but that ain't gonna fly for me");
                        return false;
                    }
                }
            }
        ]).then(addDepartment)
    }
};

const addDepartment = body => {
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [body.name];

    db.query(sql, params, (err, result) => {
        if(err) {
            return console.log(err.message);
        }
        console.log("Added " + body.name + " to the database");
        promptUser();
    });
    
};

db.connect(err => {
    if(err) throw err;
});

promptUser();