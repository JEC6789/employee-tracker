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
        ]).then(addDepartment);
    } else if(thing === "role") {
        return inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the name of the role?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("A role with no name just sounds bad in concept");
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary of the role?",
                validate: nameInput => {
                    if (nameInput) {
                        if(!isNaN(nameInput)) {
                            return true;
                        } else {
                            console.log("You just entered something that ain't a number. Whether that's because you included a currency symbol or because of something else, it doesn't matter in the end. Please enter a numerical value only.");
                            return false;
                        }
                    } else {
                        console.log("Okay. I totally understand if you don't want to disclose salary information in the name of capitalism, but if that's why you left this blank, ... this is no time for a soapbox! Put in the salary information or else!");
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "department",
                message: "Which department does the role belong to?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Are you saying this role doesn't belong to any specific department? Huh. Good argument. Unfortunately, this program is unable to understand such a thing, so you better figure out a department to put your role under!");
                        return false;
                    }
                }
            }
        ]).then(addRole);
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

const addRole = body => {
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
    const params = [body.title, body.salary, getDepartmentId(body.department)];

    db.query(sql, params, (err, result) => {
        if(err) {
            return console.log(err.message);
        }
        console.log("Added " + body.title + " to the database");
        promptUser();
    });
};

const getDepartmentId = department => {
    const sql = `SELECT EXISTS(SELECT * FROM department WHERE name = "${department}")`;
    db.query(sql, (err, rows) => {
        console.log(rows);
        if(err) {
            return console.log(err.message);
        }
        /*if( === 1) {
            return true;
        }*/
        return false;
    });
};

db.connect(err => {
    if(err) throw err;
});

promptUser();