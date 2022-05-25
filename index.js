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
            return console.log("See you later!");
        case "View Departments":
            sql = `SELECT * FROM department`;
            db.query(sql, (err, rows) => {
                if(err) {
                    console.log(err.message);
                    promptUser();
                }
                console.table(rows);
                promptUser();
            });
            break;
        case "View Roles":
            sql = `SELECT role.*, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`;
            db.query(sql, (err, rows) => {
                if(err) {
                    console.log(err.message);
                    promptUser();
                }
                console.table(rows);
                promptUser();
            });
            break;
        case "View Employees":
            sql = `SELECT employee.*, role.title AS role FROM employee LEFT JOIN role ON employee.role_id = role.id`;
            db.query(sql, (err, rows) => {
                if(err) {
                    console.log(err.message);
                    promptUser();
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
    } else if(thing === "employee") {
        return inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the employee's first name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log(`Does your employee have no first name? Did this person have some quotes that could get posted to /r/im14andthisisdeep during their job interview, such as "I don't have a first name worth mentioning?" If that's what happened, then that guy shouldn't have been hired in the first place...`);
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the employee's last name?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log(`Does your employee have no last name? Did the converstion during the job interview go something like:\n"The name's Doug."\n"And what's your last name?"\n"The name's Doug."\n"Is Doug both your first name and last name?"\n"The name's Doug."\nI'm feelin' sorry for Doug. His parents didn't even care enough about him to give him a last name. What a cruel world we live in. In that case, since you and your other employees are the only people he can consider family, how about you give Doug your own last name? That way, Doug knows you all care about him and he can finally feel a sense of happiness in an otherwise cold, dark world.`);
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "role",
                message: "What is the employee's role?",
                validate: nameInput => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("If your employee doesn't have a role in your business, why did you hire them in the first place? Enter a role here please");
                        return false;
                    }
                }
            },
            {
                type: "input",
                name: "manager",
                message: "What is the employee's manager? (not required)",
            }
        ]).then(addEmployee)
    }
};

const addDepartment = body => {
    const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [body.name];

    db.query(sql, params, (err, result) => {
        if(err) {
            console.log(err.message);
            promptUser();
        }
        console.log("Added " + body.name + " to the database");
        promptUser();
    });
};

const addRole = body => {
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?,?,?)`;
    const department_id = getId("department", "name", body.department);
    console.log("addRole: " + department_id);
    const params = [body.title, body.salary, department_id];
    /* Bug: department_id is undefined by the time the db query below is run. Probably a synchronicity issue.
    Async/await doesn't fix this. Db query appropriately complains about it */
    db.query(sql, params, (err, result) => {
        if(err) {
            console.log(err.message);
            promptUser();
        }
        console.log("Added " + body.title + " to the database");
        promptUser();
    });
};

const addEmployee = body => {
    console.log(body);
    const sql = `INSERT INTO role (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;
    // Not adding anything else here until I fix the issues with addRole, as most of that code could more or less be copied into this one
};

const getId = (table, rowName, searchTerm) => {
    // First determines if the search term inputted exists
    let sql = `SELECT EXISTS(SELECT * FROM ${table} WHERE ${rowName} = "${searchTerm}")`
    db.query(sql, (err, row) => {
        console.log(row);
        if(err) {
            return console.log(err.message);
        }
        /* Non-bug issue: this db query sets "row" to the following:
        [
            { 'EXISTS(SELECT * FROM department WHERE name = "The Struggle")': 1 }
        ]
        I have no idea how to extract that numerical value from it. I've tried
        searching for solutions online and I've probably already tried anything
        a newcomer to JavaScript could think of. Until I figure this out, this
        section of code is disabled and you get sent back to promptUser(). */
        if(0 === 1) {
            sql = `SELECT id FROM ${table} WHERE ${rowName} = "${searchTerm}"`;
            db.query(sql, (err, cell) => {
                if(err) {
                    return console.log(err.message);
                }
                console.log("getId: " + cell[0].id);
                return cell[0].id;
            });
        } else {
        console.log(`Hmmm... it seems that the ${table} you entered doesn't exist. If you didn't make any typos, try viewing the departments to see if what you're looking for is there.`)
        promptUser();
        }
    });
};

db.connect(err => {
    if(err) throw err;
});

promptUser();