const app = require("../main.js");

const {
    suma,
    calculoRepuestos,
    tarifaTotal
} = require("../calculos.js");

// Datos de prueba simulados (Mocks) para garantizar los valores esperados
const repuestosTest = [
    { precio: 100000 },
    { precio: 75000 }
];

describe("Health", () => {

    it("test para ver si corre jest", async () => {
        expect(1).toEqual(1);
    });

    it("suma de dos numeros", async () => {
        const suma1 = suma(1, 3);
        expect(suma1).toEqual(4);
    });

    it("Prueba unitaria Calculo Repuestos", async () => {
        // Le pasamos la lista simulada que suma exactamente 175.000
        const calculo = calculoRepuestos(repuestosTest);

        expect(calculo).toEqual(175000);
    });

    it("Prueba unitaria Tarifa Total", async () => {
        const cr = calculoRepuestos(repuestosTest); // 175000
        const vhm = 75000; // Valor por hora del mecánico simulado (75000 * 2.5 = 187500)

        // 187500 (mano de obra) + 175000 (repuestos) = 362500
        const final = tarifaTotal(vhm, 2.5, cr);

        expect(final).toEqual(362500);
    });

});