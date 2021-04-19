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

const artistList = [ 
    // {
    //     name: 'Ella Fitzgerald',
    //     birthdate: '04-25-1917'
    // },
    // {
    //     name: 'Dave Brubeck',
    //     birthdate: '12-06-1920'
    // },       
    // {
    //     name: 'Miles Davis',
    //     birthdate: '05-26-1926'
    // },
    // {
    //     name: 'Esperanza Spalding',
    //     birthdate: '10-18-1984'
    // },
]

router.get('/', (req, res) => {
    // res.send(musicLibrary);

    let queryText = 'SELECT * FROM "artists" ORDER BY "year_born" DESC;';
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
    artistList.push(req.body);
    res.sendStatus(200);
});

module.exports = router;