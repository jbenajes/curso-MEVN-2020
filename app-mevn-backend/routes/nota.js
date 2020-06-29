import express from 'express';
const router = express.Router();

// importar el modelo nota
import Nota from '../models/nota';

const { verificarAuth } = require('../middleware/autenticacion')

// Agregar una nota
router.post('/nueva-nota', verificarAuth, async(req, res) => {
  const body = req.body;

  body.usuarioId = req.usuario._id

  try {
    const notaDB = await Nota.create(body);
    return res.status(200).json(notaDB); 
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

// Get con parámetros
router.get('/nota/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const notaDB = await Nota.findOne({_id});
    return res.json(notaDB);
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

// Get con todos los documentos
// router.get('/notas', verificarAuth, async(req, res) => {

//   const usuarioId = req.usuario._id;

//   try {
//     const notaDb = await Nota.find({ usuarioId });
//     return res.json(notaDb);
//   } catch (error) {
//     return res.status(400).json({
//       mensaje: 'Ha ocurrido un error',
//       error
//     })
//   }
// });

// Get con paginación
router.get('/notas', verificarAuth, async(req, res) => {

  const usuarioId = req.usuario._id;

  const limit = Number(req.query.limit) || 5;
  const skip = Number(req.query.skip) || 0;

  try {
    const notaDB = await Nota.find({ usuarioId }).limit(limit).skip(skip);

    // Contar documentos
    const totalNotas = await Nota.find({ usuarioId }).countDocuments();

    return res.json({ notaDB, totalNotas });
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

// Delete eliminar una nota
router.delete('/nota/:id', async(req, res) => {
  const _id = req.params.id;
  try {
    const notaDb = await Nota.findByIdAndDelete({_id});
    if(!notaDb){
      return res.status(400).json({
        mensaje: 'No se ha encontrado el id indicado',
        error
      })
    }
    return res.json(notaDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

// Put actualizar una nota
router.put('/nota/:id', async(req, res) => {
  const _id = req.params.id;
  const body = req.body;
  try {
    const notaDb = await Nota.findByIdAndUpdate(
      _id,
      body,
      {new: true});
    return res.json(notaDb);  
  } catch (error) {
    return res.status(400).json({
      mensaje: 'Ha ocurrido un error',
      error
    })
  }
});

// Exportamos la configuración de express app
module.exports = router;
