
// 1. Esta ruta responde a la API /product

const express = require('express');
const router = express.Router();

// Importamos el model Product
const Product = require('../models/productCollection.cjs');

// 2. Rutas

// Ruta para crear un producto
router.post('/create', async (req, res)=>{

  console.log(req.body);// objeto con los datos del producto

  // Le asignamos una url de una imagen al producto
  let imagen = `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 100)}`;

  const producto = {
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,  
    brand: req.body.brand,
    category: req.body.category,
    sortDesc: req.body.sortDesc,
    longDesc: req.body.longDesc,
    edadMinima: req.body.edadMinima,
    edadMaxima: req.body.edadMaxima,
    envio: req.body.envio,
    imagen
    }

  try {
    await Product.create(producto);
    res.json({ message: "Producto creado con éxito", producto });
  } catch (error) {
    console.error("Error al crear el producto: ", error);
    res.status(400).json({ message: "No se pudo crear el producto", error: error.message });
  }

});


// Exportamos el enrutador
module.exports = router;
