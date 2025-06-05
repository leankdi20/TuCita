//Esto guarda el token en el navegador temporalmente

export function setAuthToken(token) {
    localStorage.setItem('token', token);
}

// Lee el token del navegador
export function getAuthToken() {
    return localStorage.getItem('token');
}

// Elimina el token al cerrar sesión
export function removeAuthToken() {
    localStorage.removeItem('token');
}
