const pg = require('pg');

const poolParams = {
    host: 'localHost',
    port: 5432,
    database: 'checklist',
    max: 3,
    idleTimeoutMillis: 15000
}

const pool = pg.Pool(poolParams);

// callback for when postgress connection is established
pool.on('connect', () => {
    console.log('PostgreSQL connected!');
});

// callback for postgress error
pool.on('error', (error) => {
    console.log('Error with postgres pool', error);
});

module.exports = pool;