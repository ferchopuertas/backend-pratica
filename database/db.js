const mysql = require('mysql2')
require('dotenv').config();

const db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME

})

db.getConnection((error) => {
    if(error) {
        console.log(`El error de conexion es: ${error}`)
        return
    }
    console.log('Conectado a la DB')
})

module.exports = db