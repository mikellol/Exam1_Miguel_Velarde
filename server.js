
const express = require("express");
const app = express();
const cors = require("cors");
const sql = require("mssql");
const conn = require("./config")
const bodyParser = require("body-parser");
const bee = require("bcrypt");


app.use(cors());
app.use(bodyParser());
app.all("*", function(res, req, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


const students = [
   {student : "miguel", pass: "miguel"},
   {student : "miguel", pass: "miguel"},
   {student : "miguel", pass: "miguel"}
];


async function sql_run(req, res, command){
    //req.body
    //let cred = req.body;
    //console.log(cred.user)
    //let command = `insert into users(username, pass, email) values (${cred.user}, ${cred.pass}, ${cred.email} )`;
    //await sql.connect("Server=localhost,1433;Database=classdb; User Id=mikellol1;password=mikellol1;Encrypt=false;trustServerCertificate=false");
    //const result = await sql.query`insert into users(username, pass, email) values (${cred.user}, ${cred.pass}, ${cred.email} )`;
    //return res.json("se agrego");
    const pool = new sql.ConnectionPool(conn.databases[0]);
    pool.on("error", err => {console.log(err)});
    pool.on("success", succ => {console.log(succ)});
    try{
        await pool.connect();
        let result = await pool.request().query(command);
        return {
            "success" : result
      };
    }
    catch(err){
        console.log(err);
        return err;
     }
     finally{
         pool.close();
     }
    };

app.get('/', function(req, res){
    res.send("Hello World");
});

const Port = 3000;
app.listen(Port, ()=>{
    //console.log("App is running on port:" + Port)
    console.log(`App is running on port: ${Port}`)
});

app.get('/readAll', function(req, res){
    return(students)
});

app.get('/readone', function(req, res){
    const found = students.find(({ student }) => student == cred.student);
    return(found)
});

app.post('/update', function(req, res){
    let cred = req.body;
    students.splice(0,1,{
        "student": cred.student,
        "pass": cred.pass});
    
    return(students)
});

app.delete('/delete', function(req, res){
    let cred = req.body;
    students.splice(cred.index,1);
    res.send(students)
});

app.post('/login', async function(req, res){
    let cred = req.body;
    const userPass = cred.pass;
    const found = students.find(({ student }) => student == cred.student);
    const comparation = await bee.compare(userPass, hashedPass);
    return res.send(comparation)
});

app.post('/register',   async function(req, res){
    let cred = req.body;
    bee.hash(cred.pass, 10, async function(err, hash){
        students.push({student: cred.user, pass: hash })
    });
    return res.send(students);
});

app.post('/addstudent',   async function(req, res){
    let cred = req.body;
    students.push({student: cred.user, pass: cred.pass })
    return res.send(students);
});

/*
app.get('/read', function(req, res){
    let command = `select * from cars`;
    sql_run(req, res, command);
});

app.post('/update', function(req, res){
    let cred = req.body;
    let command = `update cars set ${cred.column} = ${cred.finder} where ${cred.ident} = ${cred.ident2}`;
    sql_run(req, res, command);
});

app.delete('/delete', function(req, res){
    let cred = req.body;
    let command = `delete from cars where id = ${cred.id}`;
    sql_run(req, res, command);
});

app.post('/login', async function(req, res){
    let cred = req.body;
    let command = `logInProcedure '${cred.email}'`;
    const result = await sql_run(req, res, command);
    const userPass = cred.pass;
    const hashedPass = result.success.recordset[0].pass;
    const comparation = await bee.compare(userPass, hashedPass);

    //let command = `select username from users where username = '${cred.user}'`
    return res.send(comparation)
});

app.post('/register', function(req, res){
    let cred = req.body;
    bee.hash(cred.pass, 10, async function(err, hash){
        let command = `insert into users(username, pass, email) values ('${cred.user}', '${hash}', '${cred.email}')`;
        await sql_run(res, req, command)
    })
    return res.send("Data inserted on database");
});
*/

/*app.post('/register', function(req, res){
    let cred = req.body;
    bee.hash(cred.pass, 10, async function(err, hash){
        let command = `insert into cars(models, milles, mark) values ('${cred.models}', '${cred.milles}', '${cred.mark}')`;
        sql_run(req, res, command);
    });
});*/
