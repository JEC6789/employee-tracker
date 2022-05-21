const cTable = require("console.table");
const inquirer = require("inquirer");

const promptUser = () => {
    return inquirer.prompt([
        {
            type: "list",
            name: "whatToDo",
            message: "What would you like to do?",
            choices: ["Nothing", "View Departments", "View Roles", "View Employees", "Add Department", "Add Role", "Add Employee", "Update Employee Role"]
        }
    ]);
};

const promptAction = input => {
    switch(input.whatToDo) {
        case "Nothing":
            return console.log("... ok bye");
        default:
            return console.log("Congratulations. You just triggered this console message, which you should not be able to get under any circumstance. If you're not me, go ahead and report this issue at https://github.com/JEC6789/employee-tracker/issues so I can look into it further.");
    }
};

promptUser()
    .then(promptAction)
    .catch(err => {
        console.log(err);
});