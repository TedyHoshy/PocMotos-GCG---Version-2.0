const app = require("../main.js");

const {
    suma,
    calculoRepuestos,
    tarifaTotal
} = require("../calculos.js");

const repuestos = require("../datos/repuestos.json");
const mecanicos = require("../datos/data.json");

describe("Health", () => {

    it("test para ver si corre jest", async () => {
        expect(1).toEqual(1);
    });

    it("suma de dos numeros", async () => {
        const suma1 = suma(1, 3);
        expect(suma1).toEqual(4);
    });

    it("Prueba unitaria Calculo Repuestos", async () => {
        const calculo = calculoRepuestos(repuestos);

        expect(calculo).toEqual(175000);
    });

    it("Prueba unitaria Tarifa Total", async () => {
        const cr = calculoRepuestos(repuestos);

        const vhm = mecanicos[1]["price_hour"];

        const final = tarifaTotal(vhm, 2.5, cr);

        expect(final).toEqual(362500);
    });

});