const mysql = require('mysql2')
require('dotenv').config();

const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,
    connectTimeout: 20000

})

db.getConnection((error) => {
    if(error) {
        console.log(`El error de conexion es: ${error}`)
        return
    }
    console.log('Conectado a la DB')
})

module.exports = db
