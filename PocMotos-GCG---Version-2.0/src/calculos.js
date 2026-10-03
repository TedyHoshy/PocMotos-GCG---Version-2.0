// Calcula el costo total de los repuestos (CR)
calculoRepuestos = (x) => {
    if (!Array.isArray(x)) return 0;

    return x.reduce((acc, itera) => {
        // Soporta tanto 'price' como 'precio'
        const precio = Number(itera["price"] || itera["precio"] || 0);
        return acc + precio;
    }, 0);
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