const db = require('../database/db');
const Stock = {};

// Leer el stock
Stock.mostrar = (req, res) => {
    const command = 'SELECT * FROM stock';
    db.query(command, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
};

// Actualizar stock
Stock.actualizar = (req, res) => {
    const {id} = req.params
    const {Cantidad } = req.body;
    const command = 'UPDATE stock SET Cantidad = ? WHERE id = ?';
    db.query(command, [Cantidad, id], (error, results) => {
        if (error) throw error;
        res.json({ id, Cantidad });
    });
};

module.exports = Stock;


