const mysql = require('mysql2')
require('dotenv').config();
const { parse } = require('url');

// Si tienes la URL completa en el archivo .env
const dbUrl = process.env.MYSQL_URL || '';

const { hostname: host, pathname, auth } = parse(dbUrl);
const [user, password] = auth.split(':');
const database = pathname.replace('/', ''); // Elimina la barra inicial del pathname

const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    connectTimeout: 10000

})

db.getConnection((error) => {
    if(error) {
        console.log(`El error de conexion es: ${error}`)
        return
    }
    console.log('Conectado a la DB')
})

module.exports = db
