const inquirer = require ('inquirer')
const mysql = require ('mysql')
const firstQuestion = require('./question.js')
let department = [];
let role = [];
let manager = ['none'];
let departId = '';
let roleId = '';
let managerId = '';
let listed = [];
let z = '';
let x = '';
let y = '';



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
            case 'View All Roles':
                return viewRoles();
            case 'View All Departments':
                return viewDepartments();
            case 'Add Employees':
                return addEmployee();
            case 'Add Role':
                return addRole();
            case 'Add Department':
                return addDepart();
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

function roleArray () {
    return new Promise (function (resolve){
        console.log("Loading roles...\n");
        connection.query("SELECT title FROM role", 
        function (err, res){
            for (let i=0; i<res.length; i++) {
                role.push(res[i].title)
            }
            resolve();
        })
    }) 
};

function departArray () {
    return new Promise (function (resolve){
        console.log("Loading departments...\n");
        connection.query("SELECT name FROM depart", 
        function (err, res){
            for (let i=0; i<res.length; i++) {
                department.push(res[i].name)
            }
            resolve();
        })
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
        connection.query("SELECT id FROM employee WHERE first_name='"+x+"' AND last_name='"+y+"'", function (err, res){
            if (err) throw err;
            managerId = res[0].id;
            resolve();
        });

    }) 
};

function findRoleId () {
    return new Promise (function (resolve){
        console.log("One moment please...\n");
        connection.query("SELECT id FROM role WHERE title='"+z+"'", function (err, res){
            if (err) throw err;
            roleId = res[0].id;
            resolve();
        })
    }) 
};

function findDepartId () {
    return new Promise (function (resolve){
        console.log("One moment please...\n");
        connection.query("SELECT id FROM depart WHERE name='"+x+"'", function (err, res){
            if (err) throw err;
            departId = res[0].id;
            resolve();
        });

    }) 
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
        await departArray();
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

function viewRoles() {
    console.log("Selecting all roles...\n");
    connection.query("SELECT title FROM role", 
        function (err, res){
            console.table(res);
            init();
        }
    )
};

function viewDepartments() {
    console.log("Selecting all departments...\n");
    connection.query("SELECT name FROM depart", 
        function (err, res){
            console.table(res);
            init();
        }
    )
};

async function secondQuestion () {
    await roleArray();
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
        await roleArray();
        await currentmanager();
        let answer = await secondQuestion();
        switch (answer.managers){
            case 'none':
                managerId='0';
                break;
            default:
                [x,y] = answer.managers.split(' ',2)
                await findManagerId();
                break;
            }
        let query = connection.query(
            "INSERT INTO employee SET ?",
            [{
                first_name: answer.first,
                last_name: answer.last,
                role_id: (role.indexOf(answer.role) + 1),
                manager_id: managerId
            }],
            function (err, res) {
                if (err)
                    throw err;
                console.log(res.affectedRows + ' employee added!');
            }
        );
            console.log(query.sql);
            listed = [];
            await currentEmployees();
            listed = [];
            manager = ['none'];
            managerId = '';
            init();
        }
        catch(err) {
            console.log (err);
        
        }
};

async function addRole(){
    try{
        await departArray();
        let answer = await inquirer.prompt ([
            {type: 'input',
            name: 'newrole',
            message: 'What is the name of the role?',
            validate: answer => {
                if (answer) {
                    return true;}
                else {
                    console.log("please enter the name of this role");
                    return false;}
                }
            },
            {type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
            validate: answer => {
                if (answer) {
                    return true;}
                else {
                    console.log("please enter the salary of this role");
                    return false;}
                }
            },
            {type: 'list',
            name: 'depart',
            message: 'What department is the role in?',
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
        x = answer.depart
        let z = await findDepartId(x);
        let query = connection.query(
            "INSERT INTO role SET ?",
            [{
            title: answer.newrole,
            salary: answer.salary,
            depart_id: departId
            }],
                function(err, res){
                    if (err) throw err;
                    console.log(res.affectedRows + ' role added!');
                }
            );
            console.table(query.sql);
            role=[];
            init();
        }
        catch(err) {
            console.log (err);
        }
};

async function addDepart(){
    try{
        let answer = await inquirer.prompt ([
            {type: 'input',
            name: 'depart',
            message: 'What is the department you would like to add?',
            validate: answer => {
                if (answer) {
                    return true;}
                else {
                    console.log("please enter the salary of this role");
                    return false;}
                }
            }
        ]);
        let query = connection.query(
            "INSERT INTO depart SET ?",
            [{
            name: answer.depart,
            }],
                function(err, res){
                    if (err) throw err;
                    console.log(res.affectedRows + ' department added!');
                }
            );
            console.log(query.sql);
            department = [];
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
        await roleArray();
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
            }}
        ]);
        z = answer.newrole;
        await findRoleId();
        let [x,y] = answer.update.split(' ',2);
        console.log("Updating "+answer.update+"....\n");
        connection.query(
            "UPDATE employee SET ? WHERE first_name='"+x+"' AND last_name='"+y+"'",
            [{
                role_id: roleId
            }],
            function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee updated!\n");
            listed = [];
            managerId = '';
            x = '';
            y = '';
            init();
            }
        );

    }
    catch(error){
        console.log(error);
    }
};

async function UpdateManager(){
    try{
        await currentEmployees();
        await currentmanager();
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
            name: 'managers',
            message: 'Which manager would you like to re-assign the employee to?',
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
        ]);
        switch (answer.managers){
            case 'none':
                managerId='0';
                break;
            default:
                [x,y] = answer.manager.split(' ',2)
                await findManagerId();
                break;
        };
        [x,y] = answer.update.split(' ',2)
        console.log("Updating "+answer.update+"....\n");
        connection.query(
            "UPDATE employee SET ? WHERE first_name='"+x+"' AND last_name='"+y+"'",
            [{
                manager_id: managerId
            }],
            function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee updated!\n");
            listed = [];
            manager = ['none'];
            managerId = '';
            x = '';
            y = '';
            init();
            }
        );

    }
    catch(error){
        console.log(error);
    }
};

connect().then(init);