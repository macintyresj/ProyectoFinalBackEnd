const HTMLProducts = document.querySelector('#app');

const renderProducts = (data) => {

    if (Object.keys(data)[0] != 'error') {
        const template = data.map((product) => `
            <div class="col">
                <div class="card">
                    <img src="${product.foto}" class="card-img-top p-3 w-50 mx-auto">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.nombre}</h5>
                        <p class="card-text"><b>$ ${product.precio}</b> <br> 
                            <small>Código: ${product.codigo} - Stock: ${product.stock}</small>
                        </p>
                        <p class="card-text">${product.descripcion}</p>
                    </div>
                    <div class="card-footer text-center">
                        <button class="btn btn-sm btn-save" type="button" onclick="agregarCarrito('${product.id}')">🛒
                        </button>
                        
                            <button class="btn btn-sm btn-add" type="button" data-toggle="modal" data-target="#modalEditProduct" onclick="editarProducto('${product.id}')">
                            🖊
                            </button>
                            <button class="btn btn-sm btn-cancel" type="button" onclick="eliminarProducto('${product.id}')">
                            🗑
                            </button>
                    
                    </div>
                </div>
            </div>`).join('');
        HTMLProducts.innerHTML = template;
    } else {
        const template = ("Ouch!", data.error, "error"); 
        HTMLProducts.innerHTML = template;
    }

}

const productosListar = async () => {
    try {
        const response = await fetch('/productos/listar', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    await productosListar();
})();

const formAddProduct = document.querySelector('#formAddProduct'),
    inputCodigo = document.getElementById('codigo'),
    inputNombre = document.getElementById('nombre'),
    inputDescripcion = document.getElementById('descripcion'),
    inputPrecio = document.getElementById('precio'),
    inputStock = document.getElementById('stock'),
    inputFoto = document.getElementById('foto');

formAddProduct.onsubmit = async (e) => {
    e.preventDefault();

    const datosFormulario = {
        codigo: inputCodigo.value,
        nombre: inputNombre.value,
        descripcion: inputDescripcion.value,
        precio: inputPrecio.value,
        stock: inputStock.value,
        foto: inputFoto.value
    };

    try {
        const response = await fetch('/productos/agregar', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            method: 'POST',
            body: JSON.stringify(datosFormulario)
        });

        const data = await response.json();

        if (Object.keys(data)[0] == 'error') {
            ("ocurrió un error", result.error, "error");

      
        } else if (Object.keys(data)[0] == 'errors') {
            let errorsTemplate = data.errors.map(e => {
                return `  ${e.value} --> ${e.msg}  `
            }).join('||');
            ("Error🤖", errorsTemplate, "error");
        } else {
            productosListar();
            const btn = document.querySelector('#btnCancelarAdd');
            btn.click();
        }
    } catch (error) {
        console.log(error);
    }
};

const btnCancelarAdd = document.querySelector('#btnCancelarAdd');
btnCancelarAdd.addEventListener('click', () => {
    formAddProduct.reset();
})

const formEditProduct = document.querySelector('#formEditProduct'),
    inputEditCodigo = document.getElementById('edit_codigo'),
    inputEditNombre = document.getElementById('edit_nombre'),
    inputEditDescripcion = document.getElementById('edit_descripcion'),
    inputEditPrecio = document.getElementById('edit_precio'),
    inputEditStock = document.getElementById('edit_stock'),
    inputEditFoto = document.getElementById('edit_foto');

const editarProducto = async (id) => {

    try {
        let response = await fetch(`/productos/listar/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        let data = await response.json();

        inputEditCodigo.setAttribute('value', `${data.codigo}`)
        inputEditNombre.setAttribute('value', `${data.nombre}`)
        inputEditDescripcion.setAttribute('value', `${data.descripcion}`)
        inputEditPrecio.setAttribute('value', `${data.precio}`)
        inputEditStock.setAttribute('value', `${data.stock}`)
        inputEditFoto.setAttribute('value', `${data.foto}`)

        formEditProduct.onsubmit = async (e) => {
            e.preventDefault();

            let formData = new FormData(formEditProduct)
            let datosEditFormulario = {
                codigo: formData.get('codigo'),
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                precio: formData.get('precio'),
                stock: formData.get('stock'),
                foto: formData.get('foto')
            };

            try {
                let response = await fetch(`/productos/actualizar/${data.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    method: 'PUT',
                    body: JSON.stringify(datosEditFormulario)
                });

                let result = await response.json();

                if (Object.keys(result)[0] == 'error') {
                    ("Ouch", result.error, "error")
                } else if (Object.keys(result)[0] == 'errors') {
                    let errorsTemplate = result.errors.map(e => {
                        return `  ${e.value} --> ${e.msg}  `
                    }).join('||');
                    ("Ouch!", errorsTemplate, error);
                } else {
                    await productosListar();
                    const btn = document.querySelector('#btnCancelarEdit');
                    btn.click();
                }
            } catch (error) {
                console.log(error);
            }
        }

    } catch (error) {
        console.log(error);
    }

}

const btnCancelarEdit = document.querySelector('#btnCancelarEdit');
btnCancelarEdit.addEventListener('click', () => {
    formEditProduct.reset();
})

const eliminarProducto = async (id) => {

    try {
        const response = await fetch(`/productos/borrar/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            method: 'delete'
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            await productosListar();
        } else {
            (data.error, data.descripcion, "error");
        }
    } catch (error) {
        console.log(error);
    }

}

const agregarCarrito = async (id_product) => {

    try {
        const response = await fetch(`/carrito/agregar/${id_product}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            method: 'POST',
            body: JSON.stringify({ cantidad: 1 })
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            swal("Producto agregado al carrito", "falta menos para que sea tuyo!", "success");
        } else {
            swal("Ouch", data.error, "error");
        }
    } catch (error) {
        console.log(error);
    }

}


// mostrar u ocultar campos de busqueda
const filterSelect = document.querySelector('#optionsSearch');
const buscarPorNombre = document.querySelector('#buscarPorNombre'),
    buscarPorCodigo = document.querySelector('#buscarPorCodigo'),
    buscarPorPrecio = document.querySelector('#buscarPorPrecio'),
    buscarPorStock = document.querySelector('#buscarPorStock'),
    formSearchBtns = document.querySelector('#formSearchBtns');

filterSelect.addEventListener('change', () => {
    switch (filterSelect.value) {
        case "1":
            buscarPorNombre.setAttribute("style", "display: flex;");
            buscarPorCodigo.setAttribute("style", "display: none;");
            buscarPorPrecio.setAttribute("style", "display: none;");
            buscarPorStock.setAttribute("style", "display: none;");
            formSearchBtns.setAttribute("style", "display: block;");
            limpiarInputsSearchForm();
            break;
        case "2":
            buscarPorNombre.setAttribute("style", "display: none;");
            buscarPorCodigo.setAttribute("style", "display: flex;");
            buscarPorPrecio.setAttribute("style", "display: none;");
            buscarPorStock.setAttribute("style", "display: none;");
            formSearchBtns.setAttribute("style", "display: block;");
            limpiarInputsSearchForm();
            break;
        case "3":
            buscarPorNombre.setAttribute("style", "display: none;");
            buscarPorCodigo.setAttribute("style", "display: none;");
            buscarPorPrecio.setAttribute("style", "display: flex; gap: 5px;");
            buscarPorStock.setAttribute("style", "display: none;");
            formSearchBtns.setAttribute("style", "display: block;");
            limpiarInputsSearchForm();
            break;
        case "4":
            buscarPorNombre.setAttribute("style", "display: none;");
            buscarPorCodigo.setAttribute("style", "display: none;");
            buscarPorPrecio.setAttribute("style", "display: none;");
            buscarPorStock.setAttribute("style", "display: flex; gap: 5px;");
            formSearchBtns.setAttribute("style", "display: block;");
            limpiarInputsSearchForm();
            break;
    }
})

// filtro de productos
const formSearch = document.querySelector('#formSearch');

formSearch.onsubmit = async (e) => {
    e.preventDefault();

    let formDataSearch = new FormData(formSearch);

    const datosFormSearch = {
        nombre: formDataSearch.get('inputSearchNombre'),
        codigo: formDataSearch.get('inputSearchCodigo'),
        precioMin: formDataSearch.get('inputSearchPrecioMin'),
        precioMax: formDataSearch.get('inputSearchPrecioMax'),
        stockMin: formDataSearch.get('inputSearchStockMin'),
        stockMax: formDataSearch.get('inputSearchStockMax')
    }

    try {
        const response = await fetch(`/productos/buscar?nombre=${datosFormSearch.nombre}&codigo=${datosFormSearch.codigo}&precioMin=${datosFormSearch.precioMin}&precioMax=${datosFormSearch.precioMax}&stockMin=${datosFormSearch.stockMin}&stockMax=${datosFormSearch.stockMax}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        })
        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.log(error);
    }

}

const limpiarFiltros = async () => {
    buscarPorNombre.setAttribute("style", "display: none;");
    buscarPorCodigo.setAttribute("style", "display: none;");
    buscarPorPrecio.setAttribute("style", "display: none;");
    buscarPorStock.setAttribute("style", "display: none;");
    formSearchBtns.setAttribute("style", "display: none;");
    await productosListar();
}

const limpiarInputsSearchForm = () => {
    document.getElementById('inputSearchNombre').value = '';
    document.getElementById('inputSearchCodigo').value = '';
    document.getElementById('inputSearchPrecioMin').value = '';
    document.getElementById('inputSearchPrecioMax').value = '';
    document.getElementById('inputSearchStockMin').value = '';
    document.getElementById('inputSearchStockMax').value = '';
}