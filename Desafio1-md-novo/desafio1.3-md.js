adicionarZero = (num) => {
  return num >= 10 ? num : `0${num}`;
};
formatarData = (dataInicial) => {
  const dia = adicionarZero(dataInicial.getDate());
  const mes = adicionarZero(dataInicial.getMonth() + 1);
  const ano = adicionarZero(dataInicial.getFullYear());
  const hora = adicionarZero(dataInicial.getHours());
  const minutos = adicionarZero(dataInicial.getMinutes());
  const segundos = adicionarZero(dataInicial.getSeconds());

  console.log(`${dia}/${mes}/${ano}`);
  console.log(`${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`);
};

const dataInicial = new Date();
const dataFormatada = formatarData(dataInicial);
