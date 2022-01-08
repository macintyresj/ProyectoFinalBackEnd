const HTMLCarrito = document.querySelector('#carrito');

const renderCarrito = async () => {

    try {
        const response = await fetch('/carrito/listar', {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            const template = data.map((carrito) => `
            <tr>
                <td> <img src="${carrito.producto.foto}" width="50" height="50" alt="foto producto"> </td>
                <td>${carrito.producto.nombre}</td>
                <td>${carrito.producto.descripcion}</td>
                <td style="text-align: center;">${carrito.cantidad}</td>
                <td style="text-align: right;">$ ${carrito.producto.precio}</td>
                <td>
                    <button class="btn btn-sm btn-cancel" type="button" onclick="eliminarCarrito('${carrito.id}')">
                        X
                    </button>
                </td>
            </tr>
            `).join('');
            HTMLCarrito.innerHTML = template;
        } else {
            const template = `<tr>
                                <td colspan="7">${data.error}</td>
                            </tr>`
            HTMLCarrito.innerHTML = template;
        }
    } catch (error) {
        console.log(error);
    }

}


(async () => {
    await renderCarrito();
})();


const eliminarCarrito = async (id) => {

    try {
        const response = await fetch(`/carrito/borrar/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            method: 'delete'
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            renderCarrito();
        } else {
            swal("Ouch!", data.error, "error");
        }
    } catch (error) {
        console.log(error);
    }

}


const newOrder = async () => {
    try {
        const response = await fetch('/ordenes/agregar', {
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            method: 'POST'
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            swal("Excelente!!", data.success, "success")
            renderCarrito()
        } else {
            swal("Ouch!", data.error, "error")
        }
    } catch (error) {
        console.log(error);
    }
}