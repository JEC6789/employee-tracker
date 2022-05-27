# Employee Tracker

This program provides a database to let you keep track of information about your employees. Departments, roles, and employees can be viewed and added, and employee roles can be updated as well.*

## Installation

To install this program, click on the “Code” dropdown at the top of this page and then choose one of the provided options to clone this program’s code onto your device. Once that is done, open a command prompt if you haven’t already, navigate to the folder that contains this program’s files, and then type `npm install`. The database then needs to be set up, which requires entering the MySQL shell, which is done by entering `mysql -u root -p` and then entering your SQL password. Once you're in the MySQL shell, run the following two commands: `source db/db.sql;` and `source db/schema.sql;`. This sets up the database that the program uses, and the MySQL shell can then be exited by entering either `exit;` or `quit;`.

## Usage

[![Video showcasing the usage of this program](./assets/thumbnail.png)](https://drive.google.com/file/d/1duvnvL_iONxJ3w7vNh8WdBo-HDRfDkfF/preview)

Once everything in the previous section is done, this program can be initiated by entering `node index`. This program will then give you an array of options to perform, including viewing the provided tables, adding records to the tables, and changing the roles of employees. The program can be exited anytime the user is prompted to perform another action.

## *Known Issues

Trying to get everything to work properly drove me insane, and in the end, I was not able to get adding roles, adding employees, and updating employee roles to work out. I'm pretty sure I could at least make adding roles functional if I put more time into it. But with a program that's gotten as large and complex as this one, that just doesn't sound good for my mental health, and I have other projects I need to work on anyway.

## Contributors

Made with 💔 by JEC6789