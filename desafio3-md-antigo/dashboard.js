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

import data from "./jsonDashboard.js";
import _data from "./jsonDashboard.js";
const dataCopy = _data;

const nextPage = document.querySelector(".nextButton");
const prevPage = document.querySelector(".previousButton");
const firstPage = document.querySelector(".firstButton");
const lastPage = document.querySelector(".lastButton");
const changeInfoButton = document.querySelector(".changeInfoButton");
const globalDiv = document.querySelector(".globalDiv");
const tableDiv = document.querySelector(".tableDiv");
const table = document.createElement("table");
const tbody = document.createElement("tbody");
const container = document.querySelector("#container");

const firstCurrentPage = 1;
let currentPage = 1;
let totalPerPage = 10;
let totalPages = 18;
let lastCurrentPage =  totalPages;

const pagination = (array, page) => {
  return array.slice((page - 1) * totalPerPage, page * totalPerPage);
};

const dataTreatment = (guides) => {
  const info = dataCopy.filter(() => (value) => value !== null && value !== undefined)
    .reduce((acc, key) => {
      let keyGroup = key[guides];

      if (!acc[keyGroup]) acc[keyGroup] = { count: 0 };

      if (acc[keyGroup]) acc[keyGroup].count++;

      return acc;
    }, {});

  return info;
};

const uniteData = (filters) => {
  const finalData = filters.reduce((acc, filter) => {Object.entries(filter).forEach(([key, value]) => {
      if (!acc[key]) acc[key] = {count: 0};
      if (acc[key]) acc[key].count += value.count;
    });
    return acc;
  }, {});

  return Object.entries(finalData).map(([key, counts]) => ({ key, ...counts }));
};

const attendanceFilter = dataTreatment("attendance_id");
const financeFilter = dataTreatment("finance_id");
const groupKeyFilter = dataTreatment("group_key");
const procedureIdFilter = dataTreatment("procedure_id");
const priceFilter = dataTreatment("price");
const liquidPriceFiter = dataTreatment("liquid_price");
const receivedValueFilter = dataTreatment("received_value"); 
const tissTypeFilter = dataTreatment("tiss_type");
// console.log(tissTypeFilter)
const finalAttendanceData = uniteData([attendanceFilter]);
const finalFinanceData = uniteData([financeFilter]);
const finalProcedureData = uniteData([procedureIdFilter]);
const finalGroupKeyData = uniteData([groupKeyFilter]);

const finalPrices = uniteData([priceFilter]);
const finalLiquidPrices = uniteData([liquidPriceFiter]);
const finalReceivedValues = uniteData([receivedValueFilter]);
const finalTissType = uniteData([tissTypeFilter]);
console.log(finalLiquidPrices)



// CRIAR UMA FUNÇÃO QUE REALIZE OS REDUCES NOS VALORES DESEJADOS. A FUNÇÃO TERÁ O SEGUINTE FORMATO :
const totalPrice = finalPrices.reduce((acc, item) => {
  const keyValue = item.key;
  const countValue = item.count;
  if (isNaN(keyValue) || keyValue === null || keyValue === undefined) {
    console.log('invalid key : ', keyValue);
    return;
  }

  const result = (acc + (keyValue * countValue));
 
  return result;
}, 0)
const tmp = totalPrice.toFixed(3);
console.log(tmp)
// NESTE REDUCE EU RECEBI O VALOR DESEJADO EM RELAÇÃO AO TOTAL PRICE, MAS PRECISO REALIZAR O MESMO PROCEDIMENTO COM OUTROS ASPECTOS DAS FINANÇAS

// console.log(priceFilter)
// console.log(finalPrices)



const createTable = (data, data2, data3, data4) => {
  const headingRow = table.insertRow();
  const headingTitles = ["Attendance ids", "Finance ids", "group keys", "procedure ids"];

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
    tr.insertCell().textContent = data4[i].key;
    tr.insertCell().textContent = keyFormatter(data2[i].key);
    tr.insertCell().textContent = data3[i]?.key && data3[i]?.key !== "null" ? data3[i]?.key : "-";
  
    tbody.appendChild(tr);
  });
  
  const finalGrouping = [ finalAttendanceData, finalFinanceData, finalGroupKeyData, finalProcedureData ];

  const groupRow = document.createElement("tr");
  groupRow.setAttribute("style", "text-align: center");
  groupRow.classList.add("table-dark");

  finalGrouping.forEach((group) => {
    const groupCell = document.createElement("td");
    groupCell.textContent = `qnt : ${group.length}`;

      groupRow.appendChild(groupCell);
    })
    
  tbody.appendChild(groupRow);
  table.appendChild(tbody);
  tableDiv.appendChild(table);

  table.classList.add("table", "table-bordered");
};

nextPage.addEventListener("click", () => {
  console.log(currentPage);
  if (currentPage < totalPages) {
    currentPage++;
    const arrayAtt = pagination(finalAttendanceData, currentPage);
    const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
    const prcdColumn = pagination(finalProcedureData, currentPage);
    const financeColumn = pagination(finalFinanceData, currentPage);
    createTable(arrayAtt, grpKeyColumn, prcdColumn, financeColumn);

  } else return;
});

prevPage.addEventListener("click", () => {
  console.log(currentPage);
  if (currentPage !== firstCurrentPage) {
    currentPage--;
    const arrayAtt = pagination(finalAttendanceData, currentPage);
    const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
    const prcdColumn = pagination(finalProcedureData, currentPage);
    const financeColumn = pagination(finalFinanceData, currentPage);
    createTable(arrayAtt, grpKeyColumn, prcdColumn, financeColumn);
  } else return;
});

firstPage.addEventListener("click", () => {
  console.log(currentPage);
  if (currentPage > firstCurrentPage) {
    currentPage = 1;
    const attColumn = pagination(finalAttendanceData, currentPage);
    const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
    const prcdColumn = pagination(finalProcedureData, currentPage);
    const financeColumn = pagination(finalFinanceData, currentPage);
    createTable(attColumn, grpKeyColumn, prcdColumn, financeColumn);
  }
});

lastPage.addEventListener("click", () => {
  if (currentPage < lastCurrentPage) {
    currentPage = lastCurrentPage;
    const attColumn = pagination(finalAttendanceData, currentPage);
    const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
    const prcdColumn = pagination(finalProcedureData, currentPage);
    const financeColumn = pagination(finalFinanceData, currentPage);
    createTable(attColumn, grpKeyColumn, prcdColumn, financeColumn);
  }
});

const clearTableElements = () => {
  container.innerHTML = "";
  changeInfoButton.remove(); 
}

const createGraphic = () => {
  const ctx = document.getElementById('myChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}



 const returnButton = document.createElement("button");
 returnButton.addEventListener("click", () => {
  createGraphic();
 })

changeInfoButton.addEventListener("click", () => {
  clearTableElements();
  globalDiv.appendChild(returnButton);
});







document.addEventListener("DOMContentLoaded", () => {
  const attColumn = pagination(finalAttendanceData, currentPage);
  const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
  const prcdColumn = pagination(finalProcedureData, currentPage);
  const financeColumn = pagination(finalFinanceData, currentPage);
  createTable(attColumn, grpKeyColumn, prcdColumn, financeColumn);
});
