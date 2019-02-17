const express       = require('express');
const bodyParser    = require('body-parser');
const pool          = require('./modules/pool');
const app = express();
const PORT = 5000;


// Have the express app listen on our port
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});

app.use(express.static('server/public'));
app.use(bodyParser({urlencoded: true}));

// Route for the client to get the full list of todos from the database.
app.get('/todo-list', (req, resp) => {
    // Query the database for our full todo list
    pool.query(`SELECT * FROM "checklist";`)
    .then(
        response => {
            resp.send(response.rows);
        }
    )
    .catch(
        error => {
            console.log('error when getting todo list from database', error);
            resp.sendStatus(500);
        }
    )
});


// Post a new element to the database from the client.
app.post('/todo-list', (req, resp) => {

    let newTodo = req.body;
    console.log('adding ', newTodo);

    pool.query(`
        INSERT INTO "checklist" ("date", "descr") 
        VALUES ($1, $2);`, [req.body.date, req.body.descr]
    )
    .then(
        result => {
            resp.sendStatus(201);
        }
    )
    .catch(
        error => {
            console.log('error when posting new element to database', req.body, error);
            resp.sendStatus(500);
        }
    );
});