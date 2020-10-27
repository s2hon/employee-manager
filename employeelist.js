const mysql = require('mysql');
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




connect.then(current);

module.exports = listed