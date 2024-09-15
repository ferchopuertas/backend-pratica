const db = require('../database/db');
const AsisNec = {};

// Leer el stock
AsisNec.mostrar = (req, res) => {
    const command = 'SELECT * FROM asisnecesarias';
    db.query(command, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};

//Editar Asistencias Necesarias
AsisNec.actualizar = (req, res) => {
    const {id} = req.params
    const {AsisNec} = req.body
    const command = 'UPDATE asisnecesarias SET AsisNec = ? WHERE id = 1'
    
    db.query(command, [AsisNec, id], (error, results) => {
        if(error) throw error
        res.json({id, AsisNec})
    })
}



module.exports = AsisNec