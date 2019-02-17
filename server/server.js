const express       = require('express');
const bodyParser    = require('body-parser');
const pool          = require('./modules/pool');
const app = express();
const PORT = 5000;
let sorting = 'default';


// Have the express app listen on our port
app.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});

app.use(express.static('server/public'));
app.use(bodyParser({urlencoded: true}));


// Route for the client to get the full list of todos from the database.
app.get('/todo-list', (req, resp) => {

    // Get the query string. It can be different based on how we want to sort.
    let queryString = `SELECT * FROM "checklist"`;
    if (sorting == 'default'){
        queryString += ` ORDER BY "id";`;
    }
    else if (sorting == 'completed') {
        queryString += ` ORDER BY "complete", "id";`;
    }

    // Query the database for our full todo list
    pool.query(queryString)
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


app.delete('/todo-list/:id', (req, resp) => {

    const id = req.params.id;
    pool.query(`DELETE FROM "checklist" WHERE "id" = $1`, [id])
    .then(
        result => {
            resp.sendStatus(204);
        }
    )
    .catch(
        error => {
            console.log('error deleting ID ' + id, error);
            resp.sendStatus(500);
        }
    );
});


app.put('/todo-list/:id', (req, resp) => {

    const id = req.params.id;
    const isComplete = req.body.complete;

    // javascript seems to interpret SQL bools as strings because reasons. 
    //So here's a strict conversion so that we can toggle it.
    let isCompleteBool = (isComplete === 'true');

    pool.query(`
        UPDATE "checklist"
        SET "complete" = $1
        WHERE "id" = $2`, [!isCompleteBool, id])
    .then(
        result => {
            resp.sendStatus(204);
        }
    )
    .catch(
        error => {
            console.log('error setting complete state to ' + isComplete 
            + ' on ID ' + id, error);
            resp.sendStatus(500);
        }
    );
});

// Route for the client to get the full list of placeholders from the database.
app.get('/placeholders', (req, resp) => {

    pool.query(`
        SELECT * FROM "placeholders"
        ORDER BY "id";`)
    .then(
        response => {
            resp.send(response.rows);
        }
    )
    .catch(
        error => {
            console.log('error when getting placeholders from database', error);
            resp.sendStatus(500);
        }
    )
});

app.put('/sorting', (req, resp) => {

    sorting = req.body.sorting;
    console.log('sorting is now', sorting);
    resp.sendStatus(201);
});