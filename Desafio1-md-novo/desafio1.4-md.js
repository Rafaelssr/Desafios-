const dataAtual = new Date("2022-02-07T01:01:06.336Z");
//Função que retorna o mês do ano a partir de um array que contenha todas as opções para se retornar
retornaMesExtenso = (mes) => {
  const calendario = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  return calendario[mes];
};
// uma variável que captura o mês fornecido pela data informada
const mesAtual = dataAtual.getMonth();
// uma variável para armazenar a transformação da data recebida de número para extenso, a partir da funão criada
const mesExtenso = retornaMesExtenso(mesAtual);
console.log(mesExtenso);
