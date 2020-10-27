const inquirer = require ('inquirer');
const mysql = require('mysql');
const init = require('./app');
const role = ['CFO', 'VP', 'Executive Assistant',
'Accounting Manager','Accountant',
'Marketing Manager','Marketing Coordinator',
'Productions Manager','Production Coordinator', 
'Operations Manager', 'Operations Coordinator', 
'HR Generalist','Attorney/Lawyer'];
const manager = ['none'];
let managerId = '';
let x = '';
let y = '';

const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: 'Yuel04Banh08',
    database: 'all_employeeDB'
});

function currentmanager () {
    return new Promise (function (resolve){
        console.log("One moment please...\n");
        connection.query("SELECT first_name, last_name FROM employee WHERE (employee.manager_id = 0)", function (err, res){
            if (err) throw err;
                res.forEach((res) => {
                const managerName = res.first_name + " " + res.last_name;
                manager.push(managerName);
                resolve();
          })
        })
    }) 
};

function findManagerId () {
    return new Promise (function (resolve){
        console.log("One moment please...\n");
        [x,y] = answer.managers.split('',2)
        connection.query("SELECT id FROM employee WHERE first_name='"+x+"' AND last_name='"+y+"'", function (err, res){
            if (err) throw err;
            console.log(res);
            managerId = res;
                resolve();
        });

    }) 
};




function secondQuestion () {
    return inquirer.prompt ([
        {type: 'list',
        name: 'role',
        message: 'Which role is the employee in?',
        choices: role,
        validate: answer =>{
            if (answer.length !== 1) {
                console.log('You must to select only one option');
                return false;
            } else {
                return true;
                }
            }
        },
        {type: 'input',
        name: 'first',
        message: 'What is the first name of the employee?',
        validate: answer => {
            if (answer) {
                return true;}
            else {
                console.log("please enter the employee's first name");
                return false;}
            }
        },
        {type: 'input',
        name: 'last',
        message: 'What is the last name of the employee?',
        validate: answer => {
            if (answer) {
                return true;}
            else {
                console.log("please enter the employee's last name");
                return false;}
            }
        },
        {type: 'list',
        name: 'managers',
        message: 'Who is the name of your manager?',
        choices: manager,
        validate: answer =>{
            if (answer.length !== 1) {
                console.log('You must to select only one option');
                return false;
            } else {
                return true;
                }
            }
        }
    ])
};

async function addEmployee(){
    try{
        await currentmanager();
        let answer = await secondQuestion();
        switch (answer.managers){
            case 'none':
                managerId='0';
                break;
            default:
                findManagerId();
                break;
            }
        let query = connection.query(
            "INSERT INTO employee SET ?",
            {first_name: answer.first,
            last_name: answer.last,
            role_id: (role.indexOf(answer.role)+1),
            manager_id: managerId
            },
                function(err, res){
                    if (err) throw err;
                    console.log(res.affectedRows + 'employee added!');
                }
            );
            console.table(query.sql);
            init();
        }
        catch(err) {
            console.log (err);
        
        }
};

module.exports = addEmployee