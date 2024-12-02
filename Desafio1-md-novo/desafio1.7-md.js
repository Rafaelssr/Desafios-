const array1 = [ 0, 1, 2, 3, 4, 5, 6, 70, 8, 9 ];
const array2 = [ 0, 100, 200, 300, 4, 500, 6, 70, 88, 9 ];
const array3 = [ 0o0, 1, 2, 88, 9, 88, 5, 8, 0, 200, 100 ];

const arrayCompleto = array1.concat(array2, array3);

const lista = new Set(arrayCompleto);
const array = Array.from(lista);
console.log(array)

