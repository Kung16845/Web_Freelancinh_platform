const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.static('RegisAndLogin'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ktn_website_find_works"
})

con.connect(err => {
    if (err) throw (err);
    else {
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve, reject) => {
        // query method
        con.query(sql, (err, result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req, res) => {

    let sql = "CREATE TABLE IF NOT EXISTS Userdatabase (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(100),password VARCHAR(100),name VARCHAR(100),surname VARCHAR(100),phonenumber VARCHAR(10),img VARCHAR(100))";
    let result = await queryDB(sql);

    sql = `SELECT email , password ,img FROM Userdatabase WHERE email = '${req.body.email}'`;
    result = await queryDB(sql);

    if (result.length === 0) {
        if (req.body.password === req.body.repassword) {
            sql = `INSERT INTO Userdatabase (email, password ,name,surname,phonenumber,img) VALUES ("${req.body.email}", "${req.body.password}" , "${req.body.name}" , "${req.body.surname}" ,"${req.body.phonenumber}" ,"avatar.png")`;
            result = await queryDB(sql);
            console.log("New record created successfullyone");
            return res.redirect("login.html");
        }
        else {

            return res.redirect("register.html");
        }
    }
    else {

        return res.redirect("register.html");
    }
})

app.post('/checkLogin', async (req, res) => {

    let { email, password } = req.body;

    let sql = `SELECT email , password ,img FROM Userdatabase WHERE email = '${email}' AND password = '${password}'`;
    let result = await queryDB(sql);

    if (result.length !== 0) {
        console.log("pass");
        res.cookie('email',email);
        res.cookie('img', result[0].img);
        return res.status(400).send("Login success");
    }
    else {

        return res.redirect('login.html?error=1');
    }

})
app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/login.html`);
});