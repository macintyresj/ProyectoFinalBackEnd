class UserDTO {

    #id
    #email
    #password
    #nombre
    #direccion
    #edad
    #telefono
    #foto

    constructor(id, email, password, nombre, direccion, edad, telefono, foto) {
        this.#id = id;
        this.#email = email;
        this.#password = password;
        this.#nombre = nombre;
        this.#direccion = direccion;
        this.#edad = edad;
        this.#telefono = telefono;
        this.#foto = foto;
    }

    getId() {
        return this.#id;
    }

    getEmail() {
        return this.#email;
    }

    getPassword() {
        return this.#password;
    }

    getNombre() {
        return this.#nombre;
    }

    getDireccion() {
        return this.#direccion;
    }

    getEdad() {
        return this.#edad;
    }

    getTelefono() {
        return this.#telefono;
    }

    getFoto() {
        return this.#foto;
    }

    ToJSON() {
        return {
            id: this.#id,
            email: this.#email,
            password: this.#password,
            nombre: this.#nombre,
            direccion: this.#direccion,
            edad: this.#edad,
            telefono: this.#telefono,
            foto: this.#foto
        }
    }

}

module.exports = UserDTO;