const db = require('../database/db');
const Miembros = {};

// Leer todos los miembros
Miembros.mostrar = (req, res) => {
    const command = 'SELECT * FROM miembros';
    db.query(command, (error, results) => {
        if (error) throw error;
        
        const command2 = 'SELECT * FROM miembros ORDER BY Nombre ASC';
        db.query(command2, (error, results) => {
            if (error) {
                console.error('Error fetching members:', error);
                return res.status(500).send('Error fetching members');
            }
            res.json(results);
        });

    });
};

// Crear un nuevo miembro
Miembros.crear = (req, res) => {
    const { Nombre } = req.body;
    const command = 'INSERT INTO miembros (Nombre) VALUES (?)';
    db.query(command, [Nombre], (error, results) => {
        if (error) throw error;
        res.status(201).json({ id: results.insertId, Nombre });
    });
};

// Actualizar un miembro existente
Miembros.actualizar = (req, res) => {
    const { id } = req.params;
    const { Nombre, Asistencias, Cobrar } = req.body;
    const command = 'UPDATE miembros SET Nombre = ?, Asistencias = ?, Cobrar = ? WHERE id = ?';
    db.query(command, [Nombre, Asistencias, Cobrar, id], (error, results) => {
        if (error) throw error;
        res.json({ id, Nombre, Asistencias, Cobrar });
    });
};

// Eliminar un miembro
Miembros.eliminar = (req, res) => {
    const { id } = req.params;
    const command = 'DELETE FROM miembros WHERE id = ?';
    db.query(command, [id], (error, results) => {
        if (error) throw error;
        res.status(204).send(); // No content
    });
};


  
// Controlador para restar 7 asistencias
Miembros.calcularCobros = (req, res) => {
    const command = `UPDATE miembros SET Asistencias = GREATEST(Asistencias - 7, 0);`;

    db.query(command, (error) => {
        if (error) throw error;

        
        const command2 = `UPDATE miembros
            SET Cobrar = LEAST(FLOOR(Asistencias / (SELECT AsisNec FROM asisnecesarias LIMIT 1)) * 5, 15)`
        db.query(command2, (error) => {
            if (error) throw error;
            
            const command3 = 'SELECT * FROM miembros ORDER BY Nombre ASC';

            db.query(command3, (error, results) => {
                if(error) throw error
                res.json(results)
            })
        });
    });
};

//Controlador para cambios al cobrar
Miembros.Cobrar = (req, res) => {
    const miembroId = req.params.id;

    // Primero verificamos el stock disponible de box
    const checkStockCommand = 'SELECT Cantidad FROM stock WHERE Item = "box"';
    db.query(checkStockCommand, (error, stockResults) => {
        if (error) {
            console.error('Error fetching stock:', error);
            return res.status(500).send('Error verificando el stock');
        }

        const stockDisponible = stockResults[0]?.Cantidad || 0;

        // Verificamos cuántas box va a cobrar el miembro
        const checkMiembroCommand = 'SELECT Cobrar FROM miembros WHERE id = ?';
        db.query(checkMiembroCommand, [miembroId], (error, miembroResults) => {
            if (error) {
                console.error('Error fetching member:', error);
                return res.status(500).send('Error verificando al miembro');
            }

            const boxACobrar = miembroResults[0]?.Cobrar || 0;

            // Si el stock es insuficiente para el cobro, retornamos un error
            if (boxACobrar > stockDisponible) {
                return res.status(400).json({ message: 'Stock insuficiente para realizar el cobro' });
            }

            // Si el stock es suficiente, ejecutamos el procedimiento almacenado
            const command = 'CALL CobrarMiembro(?)';
            db.query(command, [miembroId], (error) => {
                if (error) {
                    console.error('Error executing stored procedure:', error);
                    return res.status(500).send('Error ejecutando el procedimiento almacenado');
                }

                // Después de cobrar, devolvemos los miembros y el stock actualizado
                const command2 = 'SELECT * FROM miembros ORDER BY Nombre ASC';
                db.query(command2, (error, results) => {
                    if (error) {
                        console.error('Error fetching members:', error);
                        return res.status(500).send('Error fetching members');
                    }

                    const command3 = 'SELECT * FROM stock WHERE Item = "box"';
                    db.query(command3, (error, stockResults) => {
                        if (error) {
                            console.error('Error fetching stock:', error);
                            return res.status(500).send('Error fetching stock');
                        }

                        res.json({ members: results, stock: stockResults });
                    });
                });
            });
        });
    });
};

// Endpoint para verificar si el miembro existe
Miembros.verificar = (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre es requerido', existe: false });
    }

    const query = 'SELECT COUNT(*) AS count FROM miembros WHERE Nombre = ?';
    db.query(query, [nombre], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const existe = results[0].count > 0;
        if (!existe) {
            return res.status(404).json({ error: `El miembro "${nombre}" no está registrado.`, existe: false });
        }

        res.json({ existe });
    });
};


// Endpoint para actualizar asistencias
Miembros.sumarAsis = (req, res) => {
    const { nombre, asistencias } = req.body;

    if (!nombre || asistencias === undefined) {
        return res.status(400).json({ mensaje: 'Nombre y asistencias son requeridos' });
    }

    const query = 'UPDATE miembros SET Asistencias = Asistencias + ? WHERE Nombre = ?';
    db.query(query, [asistencias, nombre], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Miembro no encontrado' });
        }

        res.json({ mensaje: 'Asistencias actualizadas correctamente' });
    });
};


module.exports = Miembros;

