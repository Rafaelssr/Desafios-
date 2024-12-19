// - Suponhamos que você é gestor de uma clínica e deseja obter alguns dados para ter noção da movimentação e execução de procedimentos que estão sendo executados e se os mesmos estão gerando valor considerável.
// - Você quer saber se o seu faturamento está indo bem!

// - Quantidade de procedimentos agrupado por ID
// - Quantidade de procedimentos por group_key
// - Quantidade de procedimentos por attendance_id
// - Quantidade de procedimentos por finance_id
// - Total produzido (price), total liquido (liquid_price), total recebido (received_value) e total não recebido (liquid_price - received_value) por procedure_id
// - Totais por tiss_type (tipo de guia)
// - Agrupar procedimentos por atendimento
// - Agrupar procedimentos por financeiro
// - Totais por data (dia / mes / ano)

import _data from "./jsonDashboard.js";

console.log('total liquido', _data.reduce((acc, item) => acc + item.liquid_price, 0));
console.log('total price', _data.reduce((acc, item) => acc + item.price, 0));

const dataCopy = _data;

const nextPage = document.querySelector(".nextButton");
const prevPage = document.querySelector(".previousButton");
const firstPage = document.querySelector(".firstButton");
const lastPage = document.querySelector(".lastButton");
const changeInfoButton = document.querySelector(".changeInfoButton");
const cardDiv = document.querySelector(".cardDiv");
// const secondTableButton = document.querySelector(".secondTableButton");

const globalDiv = document.querySelector(".globalDiv")
const container = document.querySelector("#container");
const tableDiv = document.querySelector(".tableDiv");
const table = document.createElement("table");
const tbody = document.createElement("tbody");

const year = 365;
const months = 12;

let buttonIsClicked = false;
const firstCurrentPage = 1;
let currentPage = 1;
let totalPerPage = 10;
let totalPages = 26;

let lastCurrentPage = totalPages;


let totalFinanceId = {};
_data.forEach(item => {
  if (!totalFinanceId[item.finance_id]) {
    totalFinanceId[item.finance_id] =  1;
  } else {
    totalFinanceId[item.finance_id]++;
    // console.log(`total por finance_id`, (totalFinanceId[item.finance_id]));
  }
});

let totalNotReceived = {};
_data.forEach(item => {
  if (!totalNotReceived[item.procedure_id]) {
    totalNotReceived[item.procedure_id] =  item.liquid_price - item.received_value;
  } else {
    totalNotReceived[item.procedure_id] += item.liquid_price - item.received_value;
  }
}); 
console.log('total nao recebido por procedure_id', totalNotReceived);

let tissTypeTotal = {};
_data.forEach(item => {
  if (!tissTypeTotal[item.tiss_type]) {
    tissTypeTotal[item.tiss_type] =  1;
  } else {
    tissTypeTotal[item.tiss_type]++;
  }
  // console.log(tissTypeTotal[item.tiss_type]);
});
// console.log('total por tiss_type', tissTypeTotal[item.tiss_type]);
const tissType = "SADT";
console.log(`total count for ${tissType}`, tissTypeTotal[tissType])

let totalAttendances = {};
_data.forEach(item => {
  if (!totalAttendances[item.attendance_id]) {
    totalAttendances[item.attendance_id] =  1;
  } else {
    totalAttendances[item.attendance_id]++;
  }
});
console.log('total por attendance_id', totalAttendances);

let totalPerProcedureId = {};
_data.forEach(item => {
  if (!totalPerProcedureId[item.procedure_id]) {
    totalPerProcedureId[item.procedure_id] =  1;
  } else {
    totalPerProcedureId[item.procedure_id]++;
  }
});
console.log('total por procedure_id', totalPerProcedureId);

let totalPerGroupKey = {};
_data.forEach(item => {
  if (!totalPerGroupKey[item.group_key]) {
    totalPerGroupKey[item.group_key] =  1;
  } else {
    totalPerGroupKey[item.group_key]++;
  }
});
console.log('total por group_key', totalPerGroupKey);

let totalPerDate = {};
_data.forEach(item => {
  if (!totalPerDate[item.created_at]) {
    totalPerDate[item.created_at] =  item.liquid_price;
  } else {
    totalPerDate[item.created_at] += item.liquid_price;
  }
});
console.log('Totais por data', totalPerDate);

// Bater criterios de aceite acima


const pagination = (info, page) => {
  const array = Array.isArray(info) ? info : Object.entries(info);
  return array.slice((page - 1) * totalPerPage, page * totalPerPage);
};

const dataTreatment = (guides) => {
const info = dataCopy
.filter(() => (value) => value !== null && value !== undefined)
.reduce((acc, key) => {
  let keyGroup = key[guides];

  if (!acc[keyGroup]) acc[keyGroup] = { count: 0 };

  if (acc[keyGroup]) acc[keyGroup].count++;

  return acc;
}, {});

return info;
};

const uniteData = (filters) => {
const finalData = filters.reduce((acc, filter) => {
Object.entries(filter).forEach(([key, value]) => {
  if (!acc[key]) acc[key] = {count: 0};
  if (acc[key]) acc[key].count += value.count;
});
return acc;
}, {});

return Object.entries(finalData).map(([key, counts]) => ({key, ...counts}));
};

const attendanceFilter = dataTreatment("attendance_id");
const financeFilter = dataTreatment("finance_id");
const groupKeyFilter = dataTreatment("group_key");
const procedureIdFilter = dataTreatment("procedure_id");
const priceFilter = dataTreatment("price");
const liquidPriceFiter = dataTreatment("liquid_price");
const receivedValueFilter = dataTreatment("received_value");
const tissTypeFilter = dataTreatment("tiss_type");

const finalAttendanceData = uniteData([attendanceFilter]);
const finalFinanceData = uniteData([financeFilter]);
const finalProcedureData = uniteData([procedureIdFilter]);
const finalGroupKeyData = uniteData([groupKeyFilter]);
const finalTissTypeData = uniteData([ tissTypeFilter ]);

const finalPerAttendance = uniteData([totalAttendances]);
// console.log(finalPerAttendance);

const finalPrices = uniteData([priceFilter]);
const finalLiquidPrices = uniteData([liquidPriceFiter]);
const finalReceivedValues = uniteData([receivedValueFilter]);
console.log(finalGroupKeyData)

const totalOfValues = (price1, price2, price3) => {
const listOfValues = (list) =>
  list.reduce((acc, item) => {
    const keyValue = item.key;
    const countValue = item.count;

    if (isNaN(keyValue) || keyValue === null || keyValue === undefined) {

      return acc;
    }

    const result = acc + keyValue * countValue;
    return result;
  }, 0);

const totalLiquidValue = parseFloat(listOfValues(price1).toFixed(2));
const totalValue = parseFloat(listOfValues(price2).toFixed(2));
const recievedValues = parseFloat(listOfValues(price3).toFixed(2));
const valuesNotReceived = parseFloat((listOfValues(price2) - listOfValues(price3)).toFixed(2));

const totalValuePerDay = parseFloat((totalLiquidValue / year).toFixed(2));
const totalValuePerYear = totalLiquidValue;
const totalValuePerMonth = parseFloat((totalValuePerYear / months).toFixed(2));

return {totalValue, totalLiquidValue, recievedValues, valuesNotReceived, totalValuePerDay, totalValuePerMonth, totalValuePerYear};
};

const result = totalOfValues(finalLiquidPrices, finalPrices, finalReceivedValues);
console.log(result);


  const createCard = () => {
    const liquid = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.totalLiquidValue);
    const total = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(result.totalValue);
    cardDiv.innerHTML = `
    <p> Valor líquido : ${liquid} <br> Valor produzido : ${total}<p> 
    `
    globalDiv.appendChild(cardDiv);
  }


const createTable = (data, data2, data3, data4, data5) => {
  const headingRow = table.insertRow();
  const headingTitles = [" Id dos atendimentos", "Id das finanças", "chaves", "Id dos Procedimentos","Tipos de guias"];

  headingTitles.forEach((title) => {
  const th = document.createElement("th");
  th.classList.add("table-dark");
  th.setAttribute("style", "text-align : center");

  th.textContent = title;
  headingRow.appendChild(th);
  });

  tbody.innerHTML = "";

  const keyFormatter = (value) => {const format = value.match(/IDX_\d+/); return format};

  data.forEach((_filter, i) => {
  const tr = document.createElement("tr");
  tr.setAttribute("style", "text-align: center");
  tr.classList.add("table-dark");
  tr.textContent = "";

  tr.insertCell().textContent = data[i].key;
  tr.insertCell().textContent = data4[i]?.key;
  tr.insertCell().textContent = keyFormatter(data2[i].key);
  tr.insertCell().textContent = data3[i]?.key && data3[i]?.key !== "null" ? data3[i]?.key : "-";
  tr.insertCell().textContent = data5[i]?.key && data5[i].key !== "null" ? data5[i]?.key : "-";  

  tbody.appendChild(tr);
  return table;
  });

  // const finalGrouping = [finalAttendanceData, finalFinanceData, finalGroupKeyData, finalProcedureData, finalTissTypeData];

  // const groupRow = document.createElement("tr");
  // groupRow.setAttribute("style", "text-align: center");
  // groupRow.classList.add("table-dark");

  // finalGrouping.forEach((group) => {
  // const groupCell = document.createElement("td");
  // groupCell.textContent = `qnt : ${group.length}`;

  // groupRow.appendChild(groupCell);
  // });

  // tbody.appendChild(groupRow);
  table.appendChild(tbody);
  tableDiv.appendChild(table);

  table.classList.add("table", "table-bordered");
  return table;
};

const createGraphic = (data) => {
const graphicElement = document.getElementById("myChart");
graphicElement.setAttribute("style", "width: 45em;");
graphicElement.style.display = "block";

new Chart(graphicElement,{
  type: "bar",
  data: {
    labels: [
      "Total",
      "Líquido",
      "Recebido",
      "Não recebido",
      "Diário",
      "Mensal",
      "Anual",
    ],
    datasets: [
      {
        label: "Valores",
        data: [
          data.totalValue,
          data.totalLiquidValue,
          data.receivedValues,
          data.valuesNotReceived,
          data.totalValuePerDay,
          data.totalValuePerMonth,
          data.totalValuePerYear,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(100, 200, 100, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(100, 200, 100, 1)",
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
};

// const CreateSecondTable = (attData, fiData, grkData, prcdData) => {
//   const secondHeadingRow = table.insertRow();
//   const SecondheadingTitles = ["Total Attendance id ", " Total Finance ids", "Total group keys", "Total procedure ids","Total tiss types"];

//   SecondheadingTitles.forEach((title) => {
//   const th = document.createElement("th");
//   th.classList.add("table-dark");
//   th.setAttribute("style", "text-align : center");

//   th.textContent = title;
//   secondHeadingRow.appendChild(th);
//   });


//   attData.forEach(([tissType, tissValue], index) => {
//     const tr = document.createElement("tr");
//     tr.setAttribute("style", "text-align: center");
//       tr.classList.add("table-dark");
//       tr.textContent = "";
  
//       tr.insertCell().textContent = attData[ index ]?.[ 1 ];
//       tr.insertCell().textContent = fiData[ index ]?.[ 1 ];
//     tr.insertCell().textContent = grkData[ index ]?.[ 1 ];
//       tr.insertCell().textContent = prcdData[ index ]?.[ 1 ];
//     // tr.insertCell().textContent = attData[ index ]?.[ 1 ];
  
//     tbody.appendChild(tr);
//     return table;
//   });
// }

// secondTableButton.addEventListener('click', () => {
//   const totalPerAttendance = pagination(Object.entries(totalAttendances, currentPage));
//   const totalPerFinance = pagination(Object.entries(totalFinanceId, currentPage));
//   const totalGrks = pagination(Object.entries(totalPerGroupKey, currentPage));
//   const totalPrcds = pagination(Object.entries(totalPerProcedureId, currentPage));

//   CreateSecondTable(totalPerAttendance, totalPerFinance, totalGrks, totalPrcds);
//   document.querySelector(".tableDiv").style.display = "none";
// })


changeInfoButton.addEventListener('click', () => {
if (!buttonIsClicked) {
  changeInfoButton.textContent = "Procedimentos";
  container.style.display = "none";
  document.querySelector(".graphicDiv").style.display = "block";
  document.querySelector(".cardDiv").sdisplay = "none";
  buttonIsClicked = true;
} else {
  changeInfoButton.textContent = "Faturamento";
  container.style.display = "block";
  document.querySelector(".graphicDiv").style.display = "none";
  
  buttonIsClicked = false;
}
});

nextPage.addEventListener("click", () => {
if (currentPage < totalPages) {
  currentPage++;

  const arrayAtt = pagination(finalAttendanceData, currentPage);
  const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
  const prcdColumn = pagination(finalProcedureData, currentPage); 
  const financeColumn = pagination(finalFinanceData, currentPage);
  const tissTypeColumn = pagination(finalTissTypeData, currentPage);

  createTable(arrayAtt, grpKeyColumn, prcdColumn, financeColumn, tissTypeColumn);
} else return;
});

prevPage.addEventListener("click", () => {
if (currentPage !== firstCurrentPage) {
  currentPage--;
  const arrayAtt = pagination(finalAttendanceData, currentPage);
  const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
  const prcdColumn = pagination(finalProcedureData, currentPage);
  const financeColumn = pagination(finalFinanceData, currentPage);
  const tissTypeColumn = pagination(finalTissTypeData, currentPage);

  createTable(arrayAtt, grpKeyColumn, prcdColumn, financeColumn, tissTypeColumn);
} else return;
});

firstPage.addEventListener("click", () => {
if (currentPage > firstCurrentPage) {
  currentPage = 1;
  const attColumn = pagination(finalAttendanceData, currentPage);
  const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
  const prcdColumn = pagination(finalProcedureData, currentPage);
  const financeColumn = pagination(finalFinanceData, currentPage);
  const tissTypeColumn = pagination(finalTissTypeData, currentPage);
  createTable(attColumn, grpKeyColumn, prcdColumn, financeColumn, tissTypeColumn);
}
});

lastPage.addEventListener("click", () => {
if (currentPage < lastCurrentPage) {
  currentPage = lastCurrentPage;
  const attColumn = pagination(finalAttendanceData, currentPage);
  const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
  const prcdColumn = pagination(finalProcedureData, currentPage);
  const financeColumn = pagination(finalFinanceData, currentPage);
  const tissTypeColumn = pagination(finalTissTypeData, currentPage);

  createTable(attColumn, grpKeyColumn, prcdColumn, financeColumn, tissTypeColumn);
}
});

document.addEventListener("DOMContentLoaded", () => {
  const attColumn = pagination(finalAttendanceData, currentPage);
  const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
  const prcdColumn = pagination(finalProcedureData, currentPage);
  const financeColumn = pagination(finalFinanceData, currentPage);
  const tissTypeColumn = pagination(finalTissTypeData, currentPage);  
  createTable(attColumn, grpKeyColumn, prcdColumn, financeColumn, tissTypeColumn  );
  createGraphic(result);
  createCard()
  document.querySelector(".graphicDiv").style.display = "none";
});
