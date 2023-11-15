const express = require("express");
const app = express();
const fs = require("fs");
const hostname = "localhost";
const port = 3000;
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const mysql = require("mysql");
const { userInfo } = require("os");
const { constrainedMemory } = require("process");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/img/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "browsergame_database",
});

con.connect((err) => {
  if (err) throw err;
  else {
    console.log("MySQL connected");
  }
});

const queryDB = (sql) => {
  return new Promise((resolve, reject) => {
    // query method
    con.query(sql, (err, result, fields) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//ทำให้สมบูรณ์
app.post("/regisDB", async (req, res) => {
  let now_date = new Date().toISOString().slice(0, 19).replace("T", " ");
  let sql =
    "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),img VARCHAR(100))";
  let result = await queryDB(sql);
  sql = `INSERT INTO userInfo (username, reg_date, email, password, img) VALUES ("${req.body.username}", "${now_date}","${req.body.email}", "${req.body.password}", "avatar.png")`;
  result = await queryDB(sql);
  return res.redirect("login.html");
});

//ทำให้สมบูรณ์
app.post("/profilepic", async (req, res) => {
  let upload = multer({ storage: storage, fileFilter: imageFilter }).single(
    "avatar"
  );
  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select an image to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }
    updateImg(req.cookies.username, req.file.filename);
    res.cookie("img", req.file.filename);
    return res.redirect("Index.html");
  });
});

const updateImg = async (username, filen) => {
  let sql = `UPDATE userInfo SET img = '${filen}' WHERE username = '${username}'`;
  let result = await queryDB(sql);
  console.log(result);
};

app.get("/logout", (req, res) => {
  res.cookie("username", "Guest");
  res.cookie("img", "avatar.png");
  return res.redirect("Index.html");
});

app.post("/readComment", async (req, res) => {
  let sql =
    'CREATE TABLE IF NOT EXISTS' + ' ' + req.body.tablename + ' ' + '(username VARCHAR(500), comment_text VARCHAR(500))';
  let result = await queryDB(sql);
  sql = `SELECT comment_text, username FROM ${req.body.tablename}`;
  result = await queryDB(sql);
  result = Object.assign({}, result);
  res.json(result);
});

app.post("/writeComment", async (req, res) => {
  let sql =
    'CREATE TABLE IF NOT EXISTS' + ' ' + req.body.tablename + ' ' + '(username VARCHAR(500), comment_text VARCHAR(500))';
  let result = await queryDB(sql);
  sql = `INSERT INTO ${req.body.tablename} (username,comment_text) VALUES ("${req.body.user}", "${req.body.message}")`;
  result = await queryDB(sql);
  res.redirect("Index.html");
});

app.post("/readLeaderboardname", async (req, res) => {
  let sql =
    'CREATE TABLE IF NOT EXISTS' + ' ' + req.body.tablename + ' ' + '(username VARCHAR(500), score INT(10), like_love INT(100))';
  let result = await queryDB(sql);
  sql = `SELECT username, score, like_love FROM ${req.body.tablename} ORDER BY length(score) DESC,score DESC`; 
  result = await queryDB(sql);
  result = Object.assign({}, result);
  res.json(result);
});

// app.post("/writeLeaderboardname", async (req, res) => {
//   let sql =
//     'CREATE TABLE IF NOT EXISTS' + ' ' + req.body.tablename + ' ' + '(username VARCHAR(500), score INT(10), like_love INT(100))';
//   let result = await queryDB(sql);
//   console.log("Write")
//   sql = ('SELECT * FROM' + ' ' + req.body.tablename + ' ' + ' WHERE username = ?', [req.body.username], (err, rows) => {
//     if (err) throw err;

//     if (rows.length > 0) {
//       // Username exists, update the score if it's higher.
//       connection.query(
//         'UPDATE ' + ' ' + req.body.tablename + ' ' + ' SET score = ? WHERE username = ? AND score < ?',
//         [req.body.score, username, req.body.score],
//         (updateErr, updateResult) => {
//           if (updateErr) throw updateErr;

//           // Send a response back to the client.
//           console.log("Score updated successfully")
//         }
//       );
//     } else {
//       // Username doesn't exist.
//       sql = `INSERT INTO ${req.body.tablename} (username,score,like_love) VALUES ("${req.body.username}", "${req.body.score}",)`;
//       console.log("user not found")
//     }
//   });
// });

app.post('/writeLeaderboardname', async (req, res) => {
  let createTableSQL =
    'CREATE TABLE IF NOT EXISTS ' + req.body.tablename + ' (username VARCHAR(500), score INT(10), like_love INT(100))';
  await queryDB(createTableSQL);

  const { username, score } = req.body;

  con.query('SELECT * FROM ' + req.body.tablename + ' WHERE username = ?', [username], (err, rows) => {
    if (err) throw err;

    if (rows.length > 0) {
      con.query(
        'UPDATE ' + req.body.tablename + ' SET score = ? WHERE username = ? AND score < ?',
        [score, username, score],
        (updateErr, updateResult) => {
          if (updateErr) throw updateErr;

          console.log("Score updated successfully");
        }
      );
    } else {
      if (username && score !== null && score !== undefined) {
        let insertSQL = `INSERT INTO ${req.body.tablename} (username, score, like_love) VALUES (?, ?, 0)`;
        con.query(insertSQL, [username, score], (insertErr, insertResult) => {
          if (insertErr) throw insertErr;

          console.log("New user added successfully");
        });
      } else {
        console.log("Username or score is null");
      }
    }
  });
});

//ทำให้สมบูรณ์
app.post("/checkLogin", async (req, res) => {

  let sql = `SELECT username, img, password FROM userInfo`;
  let result = await queryDB(sql);
  result = Object.assign({}, result);
  var keys = Object.keys(result);
  var IsCorrect = false;
  for (var numberOfKeys = 0; numberOfKeys < keys.length; numberOfKeys++) {
    if (
      req.body.username == result[keys[numberOfKeys]].username &&
      req.body.password == result[keys[numberOfKeys]].password
    ) {
      console.log("login successful");
      res.cookie("username", result[keys[numberOfKeys]].username);
      res.cookie("img", result[keys[numberOfKeys]].img);
      IsCorrect = true;
      return res.redirect("Index.html");
    }
  }
  if (IsCorrect == false) {
    IsCorrect = false;
    console.log("login failed");
    return res.redirect("Login.html?error=1");
  }
  // ถ้าเช็คแล้ว username และ password ถูกต้อง
  // return res.redirect('feed.html');
  // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
  // return res.redirect('login.html?error=1')
});

app.listen(port, hostname, () => {
  console.log(`Server running at   http://${hostname}:${port}/Index.html`);
});
