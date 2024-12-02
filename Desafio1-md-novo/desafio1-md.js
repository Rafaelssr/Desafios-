// montar um array que possua apenas numeros, a partir do array inicial:
const arrayNumeros = [0, "1", "1.5", 2, 3, 4, 5, 6, 7, "8", 9];
// [0,2,4,6];
// const arrayNovo = [];
// let acumulador = 0;

let arrayVazio = [];
let soma;
somaDeIndices = (array) => {
  for (let i = 0; i < arrayFiltrado.length; i++) {
    soma = array[i] += array[i + 1];
    arrayVazio.push(soma);
  }
};
// [
//   2,  5,  7,   9,
//  11, 13, 16, NaN
// ]
let arrayVazio2 = [];
filtraImpares = (array) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i] % 2 !== 0) {
      somaMeio = array[i - 1] += 0.5;
      arrayVazio2.push(somaMeio);
    }
  }
};

const arrayFiltrado = arrayNumeros.filter((valor) => typeof valor === "number");
const arrayFinal = somaDeIndices(arrayFiltrado);
const arraySemNaN = arrayFiltrado.filter((element) => !isNaN(element));

filtraImpares(arraySemNaN);
console.log(arraySemNaN);

// for (i = 0; i < arrayNumeros.length; i++) {
//   let indice = arrayNumeros[i];
//   if (typeof indice === "number") {
//     const indices = arrayNumeros[i];
//     acumulador += indices;
//     console.log(acumulador);
//     arrayNovo.push(acumulador);
//     // [0,2,5,9,14,20,27,36]
//   }
// }
// for (let [i] in arrayNovo) {
//   if (arrayNovo[i] % 2 !== 0) {
//     arrayNovo[i] = arrayNovo[i - 1] + 0.5;
//   }
// }
