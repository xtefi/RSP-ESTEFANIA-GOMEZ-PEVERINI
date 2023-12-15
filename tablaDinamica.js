export function crearTabla(header, datos) {
    if (!Array.isArray(datos)) {
        return null;
    }
    header.push("Modificar");
    header.push("Eliminar");
    const tabla = document.createElement("table");
    tabla.setAttribute('id', 'tabla');
    tabla.appendChild(crearHeader(header));
    tabla.appendChild(crearBody(datos, header));

    return tabla;
}

function crearHeader(propiedades) {
    let tr = document.createElement("tr");
    const header = document.createElement("thead");
    propiedades.forEach((p) => {
        const th = document.createElement("th");
        th.textContent = p;
        th.id = p;
        tr.appendChild(th);
    })
    tr.classList.add("header");
    header.appendChild(tr);
    return header;
}

function crearBody(datos, header) {
    const cuerpo = document.createElement("tbody");
    datos.forEach(obj => {
        const fila = document.createElement("tr");
        header.forEach(c => {
            const celda = document.createElement("td");
            if (c === "id") {
                fila.setAttribute("id", obj[c]);
            }
            if (c === "Modificar") { // CREO BOTON MODIFICAR
                const boton = document.createElement('button');
                boton.innerText = c;
                boton.addEventListener('click', () => {
                    const eventMostrarForm = new CustomEvent('mostrarFormularioModificacion', { detail: fila.id});
                    document.dispatchEvent(eventMostrarForm);
                });
                celda.appendChild(boton);
            }
            else if (c === "Eliminar"){    // CREO BOTON ELIMINAR
                const boton = document.createElement('button');
                boton.innerText = c;
                boton.addEventListener('click', () => {
                    const eventMostrarForm = new CustomEvent('eliminarEntidad', { detail: fila.id});
                    document.dispatchEvent(eventMostrarForm);
                });
                celda.appendChild(boton);
            }
            else {
                celda.textContent = obj[c] ? obj[c] : "N/A";
                celda.id = c;
            }
            celda.id = c;
            fila.appendChild(celda);
        });
        cuerpo.appendChild(fila);
    });
    return cuerpo;
}