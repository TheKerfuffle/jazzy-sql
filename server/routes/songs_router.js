const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// SET UP PG TO CONNECT TO THE DB
const pg = require('pg');
// const Pool = pg.Pool; // ALT entry: const { Pool } = require('pg.pool');
const pool = new Pool({
    database: 'jazzy_sql',
    host: 'localhost',
    port: '5432',
    max: 10,
    idleTimeoutMillis: 30000
});


// .on looks familiar, right? Just so we know the connection succeeded.
// Million things can go wrong!

// Handle CONNECTION events!
pool.on('connect' , () => {
    console.log('Postgresql connected! W00t!');
})
// Handle ERRORs from the DB
pool.on('error', error => {
    console.log('Error with postgres pool', error);
});

const songList = [
    // {
    //     title: 'Take Five',
    //     length: '5:24',
    //     released: '1959-09-29'
    // },
    // {
    //     title: 'So What',
    //     length: '9:22',
    //     released: '1959-08-17'
    // },
    // {
    //     title: 'Black Gold',
    //     length: '5:17',
    //     released: '2012-02-01'
    // }
];

router.get('/', (req, res) => {
    // res.send(musicLibrary);

    let queryText = 'SELECT * FROM "songs" ORDER BY "title";';
    pool.query(queryText)
    .then(dbResult => {
        res.send(dbResult.rows);
    })
    .catch((error) => {
        console.log('Error! It broke trying to query', error);
        res.sendStatus(500);
        
    })
});

router.post('/', (req, res) => {
    const artist = {
        name: req.body.name,
        birthdate: req.body.birthdate
    }

    let queryText = `INSERT INTO "songs" ("artist_name", "year_born")
                        VALUES($1, $2)
                        RETURNING "id";`;

    pool.query(queryText,[req.body.name, req.body.birthdate])
    .then( result=> {
        console.log('new artist id is: ', result);
        res.sendStatus(201);
    })
    .catch( err=>{
        console.log(`this didn't work, ${queryText}, ${err}`);
        res.sendStatus(500);
    })
});

module.exports = router;