const inquirer = require ('inquirer')
const mysql = require ('mysql')
const firstQuestion = require('./question.js')
const department = ['Executive','Accounting/Finance','Marketing','Production','Operations','HR','Legal'];
const role = ['CFO', 'VP', 'Executive Assistant',
'Accounting Manager','Accountant',
'Marketing_Manager','Marketing Coordinator',
'Productions_Manager','Production Coordinator', 
'Operations Manager', 'Operations Coordinator', 
'HR Generalist','Attorney/Lawyer'];
const manager = ['none'];
let managerId = '';
let x = '';
let y = '';
const listed = [];



const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user: 'root',
    password: 'Yuel04Banh08',
    database: 'all_employeeDB'
});

function connect () {
    return new Promise (function (resolve){
        connection.connect(function(err) {
            if (err) throw err;
            console.log("connected as id " + connection.threadId + "\n");
            console.log('welcome to employee manager 2020');
            resolve();
        })
    }) 
};

async function init () {
    try {
        let answer = await firstQuestion();
        console.log(answer.userChoice)
        switch (answer.userChoice) {
            case 'View All Employees':
                return viewAll();
            case 'View All Employees By Department':
                return viewDepart();
            case 'View All Managers':
                return viewManager();
            case 'Add Employees':
                return addEmployee();
            case 'Remove Employees':
                return removeEmployee();
            case 'Update Employee Role':
                return UpdateEmployee();
            case 'Update Employee Manager':
                return UpdateManager();
            case 'quit':
                console.log('thank you for using employee manager 2020');
                connection.end();
                break;
            default:
                console.log('you must select a option!')
                init();
        };
        
    } catch (err) {
        console.log (err);
    }
};

function viewAll() {
    console.log("Selecting all employees...\n");
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, depart.name AS department, CONCAT(mng.first_name,' ', mng.last_name) AS manager FROM employee JOIN role ON role.id = employee.role_id JOIN depart ON depart.id = role.depart_id LEFT JOIN employee AS mng ON employee.manager_id = mng.id", 
        function (err, res){
            console.table(res);
            init();
    })
};

async function viewDepart() {
    try{
        let answer = await inquirer.prompt ([
            {type: 'list',
            name: 'depart',
            message: 'Which department would you like to view?',
            choices: department,
            validate: answer =>{
                if (answer.length !== 1) {
                    console.log('You must to select only one option');
                    return false;
                } else {
                    return true;
                    }
            }
            }
        ]);
        console.log("Selecting all employees from "+ answer.depart +"...\n");
        connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(mng.first_name,' ', mng.last_name) AS manager FROM employee JOIN role ON role.id = employee.role_id JOIN depart ON depart.id = role.depart_id LEFT JOIN employee AS mng ON employee.manager_id = mng.id WHERE role.depart_id = " + ((department.indexOf(answer.depart.toString()))+1), 
        function (err, res){
            console.table(res);
            init();
        })
    }
    catch(err) {
        console.log (err);
    
    }
};

function viewManager() {
    console.log("Selecting all managers...\n");
    connection.query("SELECT first_name, last_name FROM employee WHERE (employee.manager_id = 0)", function (err, res){
        if (err) throw err;
            console.table(res);
            init();
        })
};

function currentEmployees() {
    return new Promise (function (resolve){
        console.log("One moment please...\n");
        connection.query('SELECT first_name, last_name FROM employee', function (err, res){
            if (err) throw err;
            for (let i=0; i<res.length; i++) {
                let first = res[i].first_name;
                let last =  res[i].last_name;
                listed.push(first+' '+last);
                resolve();
            }
        })
    })
};

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
                    console.log(res.affectedRows + ' employee added!');
                }
            );
            console.table(query.sql);
            init();
        }
        catch(err) {
            console.log (err);
        
        }
};

async function removeEmployee(){
    try{
        await currentEmployees();
        let answer = await inquirer.prompt ([
        {type: 'list',
        name: 'delete',
        message: 'Which employee would you like to remove?',
        choices: listed,
        validate: answer =>{
            if (answer.length !== 1) {
                console.log('You must to select only one option');
                return false;
            } else {
                return true;
                }
            }}
        ]);
        let [x,y] = answer.delete.split(' ',2);
        console.log(x);
        console.log(y);
        console.log("Deleting "+answer.delete+"....\n");
        connection.query(
            "DELETE FROM employee WHERE first_name='"+x+"' AND last_name='"+y+"'",
            function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee deleted!\n");
            // Call readProducts AFTER the DELETE completes
            listed = [];
            init();
          }
        );

    }
    catch(error){
      console.log(error);
    }
};

async function UpdateEmployee(){
    try{
        await currentEmployees();
        let answer = await inquirer.prompt ([
        {type: 'list',
        name: 'update',
        message: 'Which employee would you like to update?',
        choices: listed,
        validate: answer =>{
            if (answer.length !== 1) {
                console.log('You must to select only one option');
                return false;
            } else {
                return true;
                }
            }},
        {type: 'list',
        name: 'newrole',
        message: 'Which role would you like to re-assign the employee to?',
        choices: role,
        validate: answer =>{
            if (answer.length !== 1) {
                console.log('You must to select only one option');
                return false;
            } else {
                return true;
                }
        }
        }
        ]);
        let [x,y] = answer.update.split(' ',2);
        console.log("Updating "+answer.update+"....\n");
        connection.query(
            "UPDATE employee SET ? WHERE first_name='"+x+"' AND last_name='"+y+"'",
            [{
                role_id: (role.indexOf(answer.newrole)+1)
            }],
            function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee updated!\n");
            listed = [];
            init();
            }
        );

    }
    catch(error){
        console.log(error);
    }
};

// async function UpdateManager(){
//     function viewManager() {
//         console.log("Selecting all managers...\n");
//         connection.query("SELECT first_name, last_name FROM employee WHERE (employee.manager_id = 0)", function (err, res){
//             if (err) throw err;
//                 res.forEach((res) => {
//                 const managerName = res.first_name + " " + res.last_name;
//                 manager.push(managerName);
//                 console.table(res);
//             })
//         })
//     };
//     try{
//         await currentEmployees();
//         let answer = await inquirer.prompt ([
//         {type: 'list',
//         name: 'update',
//         message: 'Which employee would you like to update?',
//         choices: listed,
//         validate: answer =>{
//             if (answer.length !== 1) {
//                 console.log('You must to select only one option');
//                 return false;
//             } else {
//                 return true;
//                 }
//             }},
//         {type: 'list',
//         name: 'newmanager',
//         message: 'Which manager would you like to re-assign the employee to?',
//         choices: manager,
//         validate: answer =>{
//             if (answer.length !== 1) {
//                 console.log('You must to select only one option');
//                 return false;
//             } else {
//                 return true;
//                 }
//         }
//         }
//         ]);

//         let [x,y] = answer.update.split(' ',2);
//         console.log("Updating "+answer.update+"....\n");
//         connection.query(
//             "UPDATE employee SET ? WHERE first_name='"+x+"' AND last_name='"+y+"'",
//             [{
//                 manager_id: (role.indexOf(answer.newmanager)+1)
//             }],
//             function(err, res) {
//             if (err) throw err;
//             console.log(res.affectedRows + " employee updated!\n");
//             init();
//             }
//         );

//     }
//     catch(error){
//         console.log(error);
//     }
// };

connect().then(init)

module.exports = init