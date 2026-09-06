// Calcula el costo total de los repuestos (CR)
calculoRepuestos = (x) => {
    let iterando = 0;

    for (const itera of x) {
        iterando += itera["precio"];
    }

    return iterando;   // → CR
};

// Calcula el total de la reparación: (VHM × TR) + CR
tarifaTotal = (vhm, th, cr) => {
    return (vhm * th) + cr;
};

// Función auxiliar de suma (la usas en los tests)
suma = (a, b) => {
    return a + b;
};

module.exports = {
    calculoRepuestos,
    tarifaTotal,
    suma
};