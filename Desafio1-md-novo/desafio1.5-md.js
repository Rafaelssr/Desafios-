const data = new Date();

formatadorDeData = () => {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();
  
  console.log(`${dia}`); // DIA
  console.log(`${dia}/${mes}`); // DIA/MES
  console.log(`${dia}/${mes}/${ano}`); // DIA/MES/ANO
};
const dataFormatada = formatadorDeData(data);

