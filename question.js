const inquirer = require ('inquirer')

const userChoice = [
    'View All Employees',
    'View All Employees By Department',
    'View All Managers',
    'View All Roles',
    'View All Departments',
    'Add Employees',
    'Add Role',
    'Add Department',
    'Remove Employees',
    'Update Employee Role',
    'Update Employee Manager',
    'quit'
];

function firstQuestion(){
    return inquirer.prompt ([
        {type: 'list',
        name: 'userChoice',
        message: 'What would you like to do?',
        choices: userChoice,
        validate: answer =>{
            if (answer.length !== 1) {
                console.log('You must to select only one option');
                return false;
            } else {
                return true;
                }
        }
    }]);
};

module.exports = firstQuestion