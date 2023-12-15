import { crearTabla } from "./tablaDinamica.js";
import { crearFormUpdate, crearFormAlta, crearSelector, crearFormBaja } from "./formulario.js";
import { toObjs } from "./persona.js"
import { Arr_GetAllUniqueProps } from "./arrayHelper.js"
import { HttpHandler } from "./httpHandler.js";
import { crearSpinner, quitarSpinner } from "./spinner.js"

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

crearSpinner();
const httpHandler = new HttpHandler();
const personas = httpHandler.sendGetSync();

localStorage.setObj("personas", personas);

window.addEventListener('load', inicializarManejadores);

quitarSpinner();

let divTabla;
let formDatos;
let dataOut = document.getElementById("dataOut");
const entidades = "personas";

export function inicializarManejadores() {
    const LS_Personas = localStorage.getObj(entidades);
    divTabla = document.getElementById('divTabla');
    formDatos = document.getElementById('formDatos');

    actualizarTabla(LS_Personas);    
    document.addEventListener('refrescarTablaPersonas', (event) => {
        const personas = localStorage.getObj(entidades);
        vaciarElemento(formDatos);
        actualizarTabla(personas);
        dataOut.style.display = "block";
    });
    document.addEventListener('mostrarFormularioModificacion', (event) => {
        const LS_Personas = toObjs(localStorage.getObj(entidades));
        let idFila = event.detail;
        let obj = LS_Personas.find((persona) => persona.id == idFila);
        vaciarElemento(formDatos);
        GenerarVista("form");
        crearFormUpdate(formDatos, obj);
    });
    document.addEventListener('eliminarEntidad', (event) => {
        const LS_Personas = toObjs(localStorage.getObj(entidades));
        let idFila = event.detail;
        let obj = LS_Personas.find((persona) => persona.id == idFila);
        vaciarElemento(formDatos);
        GenerarVista("form");
        crearFormBaja(formDatos, obj);
    });
}

export function actualizarTabla(personas) {
    GenerarVista("tabla");
    vaciarElemento(divTabla);

    let props = Arr_GetAllUniqueProps(personas);
    divTabla.appendChild(crearTabla(props ,personas));

    const botonAgregar = document.createElement('button');
    botonAgregar.innerHTML = "Agregar Elemento";
    botonAgregar.addEventListener('click', () => {
        GenerarVista("form");
        crearFormAlta(formDatos);
    });
    divTabla.appendChild(botonAgregar);
}

export function vaciarElemento(elemento) {
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function GenerarVista(mostrar) {
    if (mostrar == "form") {
        dataOut.style.display = "none";
        dataIn.style.display = "block";
    }
    else if (mostrar == "tabla") {
        dataIn.style.display = "none";
        dataOut.style.display = "inline-flex";
        dataOut.flexDirection = "column";
    }

}