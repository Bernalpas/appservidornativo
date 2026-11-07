
// Capturamos el formulario
const productForm = document.querySelector('#product-form');

// Agregamos un evento submit al formulario
productForm.addEventListener('submit', (e)=>{
  e.preventDefault();

  // Creamos un objeto del form
  const product = new FormData(productForm);

  // Capturamos los datos del form
  const nameProduct = product.get('name');
  const priceProduct = product.get('price');
  const stockProduct = product.get('stock');
  const brandProduct = product.get('brand');
  const categoryProduct = product.get('category');
  const sortDescProduct = product.get('shortDesc');
  const longDescProduct = product.get('longDesc');
  const edadMinimaProduct = product.get('ageFrom');
  const edadMaximaProduct = product.get('ageTo');
  const envioProduct = product.get('freeShip') === 'si';

  // Creamos un objeto con los datos del producto
  let dataproduct = {
    name: nameProduct,
    price: priceProduct,
    stock: stockProduct,
    brand: brandProduct,
    category: categoryProduct,
    sortDesc: sortDescProduct,
    longDesc: longDescProduct,
    edadMinima: edadMinimaProduct,
    edadMaxima: edadMaximaProduct,
    envio: envioProduct,
  }

  console.log(dataproduct);

  // Enviamos los datos al backend
  fetch('/product/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataproduct)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
});