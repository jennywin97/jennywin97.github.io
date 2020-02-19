'use strict';

const path = require('path'); //  Helps resolve relative paths, into absolute baths, independent of operating system
const express = require('express'); // Express is a very common webserver for Node.js
const db = require('./database');

const port = 8989;
const publicPath = path.join(__dirname, 'public');
const app = express();

// Register a custom middleware for logging incoming requests
app.use((req, res, next) => {
  // This is a middleware that logs all incoming requests.
  // It logs:
  //  - if the result status
  //  - the request URL
  //  - the time (in milliseconds) it took for the server to respond

  const t = Date.now();
  next();
  console.log(`[${res.statusCode}] ${req.url} (${Date.now() - t}ms)`);
});

// Register a middleware that adds support for a URL encoded request body.
// This is needed in order to send data to express using a FORM with a POST action.
app.use(express.urlencoded({
  extended: true,
}));

// Serve the login page if a GET request is sent to the root url.
app.get('/', (req, res) => {
  res.sendFile(
    path.join(publicPath, 'login.html'),
  );
});

app.post('/authenticate', (req, res) => {
  console.log(req.body);

  db.serialize(() => {
    db.each('SELECT rowid AS id, username, password FROM allUsers', (err, row) => {
      if (err) { throw new Error(err); }
      console.log(`${row.id}: ${row.username} , ${row.password}`);
    });
  });


  if (req.body.register) {
      if (checkValid(req.body.username,req.body.password)===true){

        db.get('SELECT username FROM allUsers WHERE username = ?;', [req.body.username], (err, row) => {
            if (err) { throw new Error(err); }
            if (row) {
              res.redirect('/?registration=faild_taken');
            }else{
              insertTable(req);
              res.redirect('/?registration=successful');
            }
          })

      } else if (checkValid(req.body.username,req.body.password)===false) {
          res.redirect('/?registration=failed');
      }

  } else if (req.body.login) {
    db.get('SELECT username FROM allUsers WHERE username = ? AND password=?;', [req.body.username, req.body.password], (err, row) => {
        if (err) { throw new Error(err); }
        if (row) {
          res.redirect(`/profile?user=${req.body.username}`);
        }else{
          res.redirect('/?login=faild');
        }
      })
  }
});

app.get('/profile', (req, res) => {
  res.send(`Welcome ${req.query.user}!`);
});

app.listen(port, () => {
  console.info(`Listening on port ${port}!`);
});


function checkValid(username,password){
  var mix =/^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+)[0-9a-zA-Z]*$/;
  var swemix =/^([0-9]+[a-zA-ZäöåÄÖÅ]+|[a-zA-ZäöåÄÖÅ]+[0-9]+)[0-9a-zA-ZäöåÄÖÅ]*$/;
return username.length>5 && password.length>5 && (swemix.test(username) || mix.test(username)) && mix.test(password);
}

function insertTable(req){
  const statement = db.prepare("INSERT INTO allUsers (username, password) VALUES (?,?)");
    statement.run(`${req.body.username}` ,`${req.body.password}`);
    statement.finalize();
}
