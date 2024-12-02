// desafio para utilizar o filter e o forEach 
const arrayNumeros = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
const a = arrayNumeros;

const arrayFiltrado = arrayNumeros.filter(valor => valor % 2 === 0);

let array = [];
arrayNumeros.forEach(valor => {
	if (valor % 2 === 0) {
		array.push(valor);
	}
}); 

console.log(array);