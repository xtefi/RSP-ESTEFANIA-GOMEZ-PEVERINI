import { Persona, Ciudadano, Extranjero, toObjs } from "./persona.js"
import { HttpHandler } from "./httpHandler.js";
import { crearSpinner, quitarSpinner } from "./spinner.js"

const entidades = "personas";

const opcionesTipos = ["Extranjero", "Ciudadano", "Elegir tipo"];
const opcionesIndices = {
    Extranjero: 0,
    Ciudadano: 1,
    ElegirTipo: 2
};

export function crearFormBaja(formulario, obj) {
    formulario.innerText = "Formulario Eliminacion";
    let elementos = [];
    let opciones = opcionesTipos;
    const selectorTipo = crearSelector(opciones);
    selectorTipo.disabled = true;

    if (obj instanceof Extranjero) selectorTipo.selectedIndex = opcionesIndices["Extranjero"];
    else if (obj instanceof Ciudadano) selectorTipo.selectedIndex = opcionesIndices["Ciudadano"];

    elementos.push(selectorTipo);
    if (obj === null) {
        obj = new Persona("", "", "", "");
    }

    let props = Object.getOwnPropertyNames(obj);
    props.forEach(p => {
        let soloLectura = false;
        if (p == "id") {
            soloLectura = true;
        }
        let ret = agregarCampos(p, obj[p], soloLectura);
        elementos.push(ret.nuevoLabel);
        elementos.push(ret.nuevoInput);
    });

    const botonAceptar = document.createElement('button');
    botonAceptar.innerText = "Aceptar";
    elementos.push(botonAceptar);

    const botonCancelar = document.createElement('button');
    botonCancelar.innerText = "Cancelar";
    elementos.push(botonCancelar);

    botonCancelar.addEventListener('click', () => {
        const eventRefrescar = new CustomEvent('refrescarTablaPersonas');
        document.dispatchEvent(eventRefrescar);
    });

    botonAceptar.addEventListener('click', (e) => {
        e.preventDefault();
        let inputs = [];
        props.forEach(p => {
            inputs[p] = document.getElementsByTagName("input")[p].value;
        });

        let obj_a_eliminar = null;

        if (!validarInputs(inputs, selectorTipo.selectedOptions[0].value)) {
            alert("Datos incorrectos");
            return;
        }
        if (obj instanceof Extranjero) {
            obj_a_eliminar = new Extranjero(obj.id, inputs["nombre"], inputs["apellido"], inputs["edad"], inputs["compras"], inputs["telefono"]);
        }
        else if (obj instanceof Ciudadano) {
            obj_a_eliminar = new Ciudadano(obj.id, inputs["nombre"], inputs["apellido"], inputs["edad"], inputs["sueldo"], inputs["ventas"]);
        }
        if (obj_a_eliminar) {
            try {                
                const httpHandler = new HttpHandler();

                crearSpinner();
                console.log("Antes del fetch");
                let response = httpHandler.sendDeleteAsync(obj_a_eliminar);
                response.then(response => response.text())
                    .then(response => {
                        console.log(response);
                        let LS_Personas = toObjs(localStorage.getObj(entidades));
                        LS_Personas = LS_Personas.filter((elemento) => elemento.id !== obj.id);

                        localStorage.removeItem(entidades);
                        localStorage.setObj(entidades, LS_Personas);
                        console.log("Quitando spiner...");
                        quitarSpinner();
                        const event = new CustomEvent('refrescarTablaPersonas', { detail: LS_Personas });
                        document.dispatchEvent(event);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            catch (error) {
                alert(JSON.stringify(error));
            }
        }
    });
    elementos.forEach((e) => formulario.appendChild(e));
}

export function crearFormUpdate(formulario, obj) {
    formulario.innerText = "Formulario Modificacion";
    let elementos = [];
    let opciones = opcionesTipos;
    const selectorTipo = crearSelector(opciones);
    selectorTipo.disabled = true;

    if (obj instanceof Extranjero) selectorTipo.selectedIndex = opcionesIndices["Extranjero"];
    else if (obj instanceof Ciudadano) selectorTipo.selectedIndex = opcionesIndices["Ciudadano"];

    elementos.push(selectorTipo);
    if (obj === null) {
        obj = new Persona("", "", "", "");
    }

    let props = Object.getOwnPropertyNames(obj);
    props.forEach(p => {
        let soloLectura = false;
        if (p == "id") {
            soloLectura = true;
        }
        let ret = agregarCampos(p, obj[p], soloLectura);
        elementos.push(ret.nuevoLabel);
        elementos.push(ret.nuevoInput);
    });

    const botonGuardar = document.createElement('button');
    botonGuardar.innerText = "Aceptar";
    elementos.push(botonGuardar);

    const botonCancelar = document.createElement('button');
    botonCancelar.innerText = "Cancelar";
    elementos.push(botonCancelar);

    botonCancelar.addEventListener('click', () => {
        const eventRefrescar = new CustomEvent('refrescarTablaPersonas');
        document.dispatchEvent(eventRefrescar);
    });

    botonGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        let inputs = [];
        props.forEach(p => {
            inputs[p] = document.getElementsByTagName("input")[p].value;
        });

        let objModificado = null;

        if (!validarInputs(inputs, selectorTipo.selectedOptions[0].value)) {
            alert("Datos incorrectos");
            return;
        }
        if (obj instanceof Extranjero) {
            objModificado = new Extranjero(obj.id, inputs["nombre"], inputs["apellido"], inputs["fechaNacimiento"], inputs["paisOrigen"]);
        }
        else if (obj instanceof Ciudadano) {
            objModificado = new Ciudadano(obj.id, inputs["nombre"], inputs["apellido"], inputs["fechaNacimiento"], inputs["dni"]);
        }
        if (objModificado) {
            try {
                const httpHandler = new HttpHandler();

                crearSpinner();
                console.log("Antes del fetch");
                let response = httpHandler.sendPutAsync(objModificado);
                response.then(response => {
                    response.text().then(response => {
                        let LS_Personas = toObjs(localStorage.getObj(entidades));
                        LS_Personas = LS_Personas.filter((elemento) => elemento.id !== obj.id);
                        LS_Personas.push(objModificado);

                        localStorage.removeItem(entidades);
                        localStorage.setObj(entidades, LS_Personas);
                        // siguienteId++;
                        // localStorage.setItem('nextId', siguienteId);
                        console.log("Quitando spiner...");
                        quitarSpinner();
                        const event = new CustomEvent('refrescarTablaPersonas', { detail: LS_Personas });
                        document.dispatchEvent(event);
                    });
                })
                    .catch(err => {
                        console.log(err);
                    })
            } catch (error) {
                alert(JSON.stringify(error));
            }
        }
    });

    elementos.forEach((e) => formulario.appendChild(e));
}


export function crearFormAlta(formulario) {
    formulario.innerText = "Formulario Alta";
    let obj = new Persona("", "", "", "");
    let elementos = [];
    let opciones = opcionesTipos;
    const selectorTipo = document.createElement("select");

    for (var i = 0; i < opciones.length; i++) {
        var option = document.createElement("option");
        option.value = opciones[i];
        option.text = opciones[i];
        selectorTipo.appendChild(option);
        elementos.push(selectorTipo);
    }

    selectorTipo.selectedIndex = opcionesIndices["ElegirTipo"]; // "Elegir tipo"
    selectorTipo.addEventListener("change", (event) => {
        botonGuardar.disabled = false;
        let nuevosFormFields = [];
        removerCampos();

        if (selectorTipo.selectedOptions[0].value == "Ciudadano") {
            if (!formulario["dni"]) {
                let ret = agregarCampos("dni", "", false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            obj = new Ciudadano(obj.id, obj.nombre, obj.apellido, obj.fechaNacimiento, "");
        }
        else if (selectorTipo.selectedOptions[0].value == "Extranjero") {
            if (!formulario["paisOrigen"]) {
                let ret = agregarCampos("paisOrigen", "", false);
                nuevosFormFields.push(ret.nuevoLabel);
                nuevosFormFields.push(ret.nuevoInput);
            }
            obj = new Extranjero(obj.id, obj.nombre, obj.apellido, "", "");
        }
        nuevosFormFields.forEach((e) => formulario.appendChild(e));
    })
    selectorTipo.selectedIndex = opcionesIndices["ElegirTipo"]; // "Elegir tipo"
    let props = Object.getOwnPropertyNames(obj);
    props.forEach(p => {
        let soloLectura = false;
        if (p == "id") {
            soloLectura = true;
        }
        let ret = agregarCampos(p, obj[p], soloLectura);
        elementos.push(ret.nuevoLabel);
        elementos.push(ret.nuevoInput);
    });

    const botonGuardar = document.createElement('button');
    botonGuardar.innerText = "Aceptar";
    botonGuardar.disabled = true;
    elementos.push(botonGuardar);

    // GUARDAR CAMBIOS
    botonGuardar.addEventListener('click', (e) => {
        e.preventDefault();
        let inputs = [];
        props = Object.getOwnPropertyNames(obj);
        props.forEach(p => {
            inputs[p] = document.getElementsByTagName("input")[p].value;
        });
        if (!validarInputs(inputs, selectorTipo.selectedOptions[0].value)) {
            alert("Datos incorrectos");
            return;
        }
        if (selectorTipo.selectedIndex == opcionesIndices["Ciudadano"]) {
            obj = new Ciudadano(undefined, inputs["nombre"], inputs["apellido"], inputs["fechaNacimiento"], inputs["dni"]);
        }
        else if (selectorTipo.selectedIndex == opcionesIndices["Extranjero"]) {
            obj = new Extranjero(undefined, inputs["nombre"], inputs["apellido"], inputs["fechaNacimiento"], inputs["paisOrigen"]);
        }
        if (obj) {
            console.log("Antes del fetch");
            try {
                const httpHandler = new HttpHandler();
                crearSpinner();
                let response = httpHandler.sendPostAsync(obj);
                response.then(response => {
                    response.json().then(response => {
                        console.log(response.id);
                        obj.id = response.id;
                        let LS_Personas = toObjs(localStorage.getObj(entidades));
                        LS_Personas.push(obj);

                        localStorage.removeItem(entidades);
                        localStorage.setObj(entidades, LS_Personas);
                        
                        console.log("Quitando spiner...");
                        quitarSpinner();
                        const event = new CustomEvent('refrescarTablaPersonas', { detail: LS_Personas });
                        document.dispatchEvent(event);
                    });
                })
                    .catch(err => {
                        console.log(err);
                    })
            } catch (error) {
                alert(JSON.stringify(error));
            }
            quitarSpinner();
        };

    });

    const botonCancelar = document.createElement('button');
    botonCancelar.innerText = "Cancelar";
    elementos.push(botonCancelar);

    botonCancelar.addEventListener('click', () => {
        const eventRefrescar = new CustomEvent('refrescarTablaPersonas');
        document.dispatchEvent(eventRefrescar);
    });

    elementos.forEach((e) => formulario.appendChild(e));
}

function agregarCampos(innerText, value, soloLectura) {
    const nuevoLabel = document.createElement('label');
    const nuevoInput = document.createElement("input");
    nuevoLabel.innerText = innerText;
    nuevoLabel.id = innerText;
    nuevoInput.value = value;
    nuevoInput.readOnly = soloLectura;
    nuevoInput.id = innerText;
    return { nuevoLabel, nuevoInput };
}

function removerCampos() {
    const formulario = document.getElementById("formDatos");
    // propiedades de las clases hijas no presentes en la clase padre
    const elementosAEliminar = ["dni", "paisOrigen"];
    // Filtra los hijos del formulario que no deben ser eliminados
    const hijosFiltrados = Array.from(formulario.children).filter((hijo) => {
        return !elementosAEliminar.includes(hijo.id);
    });
    // Reemplaza los hijos del formulario con los hijos filtrados
    while (formulario.firstChild) {
        formulario.removeChild(formulario.firstChild);
    }
    hijosFiltrados.forEach((hijo) => {
        formulario.appendChild(hijo);
    });
}

function validarInputs(inputs, objType) {
    return true;
}

export function crearSelector(opciones) {
    const selectorTipo = document.createElement("select");
    for (var i = 0; i < opciones.length; i++) {
        var o = document.createElement("option");
        o.value = opciones[i];
        o.text = opciones[i];
        selectorTipo.appendChild(o);
    }
    return selectorTipo;
}