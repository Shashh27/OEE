// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',         // Replace with your PostgreSQL username
    host: '172.18.100.214',        // Use the IP address of your server
    database: 'OEE',       // Your database name
    password: 'root1234',      // Replace with your database password
    port: 5432,                // Default PostgreSQL port
});

module.exports = pool;
