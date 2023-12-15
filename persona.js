export class Persona {
    // id: number;
    // nombre: string;
    // apellido: string;
    // fechaNacimiento: number;
    // sueldo: number;
    // telefono: string;
    // compras: number;
    // ventas: number;

    constructor(id, nombre, apellido, fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaNacimiento = fechaNacimiento;
    }
    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.fechaNacimiento}`;
    }
}
export class Ciudadano extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, dni) {
        super(id, nombre, apellido, fechaNacimiento);
        this.dni = dni;
    }
    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.fechaNacimiento} ${this.dni}`;
    }
}

export class Extranjero extends Persona {
    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
        super(id, nombre, apellido, fechaNacimiento);
        this.paisOrigen = paisOrigen;
    }
    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.fechaNacimiento} ${this.paisOrigen}`;
    }
}

export function toObjs(jsonArray){
    let personas = jsonArray.map((item) => {
        if (item.hasOwnProperty("dni")) {
            return new Ciudadano(item.id, item.nombre, item.apellido, item.fechaNacimiento, item.dni);
        } else if (item.hasOwnProperty("paisOrigen")) {
            return new Extranjero(item.id, item.nombre, item.apellido, item.fechaNacimiento, item.paisOrigen);
        } else {
            return new Persona(item.id, item.nombre, item.apellido, item.edad);
        }
    });
    return personas;
}

