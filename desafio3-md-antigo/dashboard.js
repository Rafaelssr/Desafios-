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
const dataCopy = _data;

const nextPage = document.querySelector(".nextButton");
const prevPage = document.querySelector(".previousButton");
const firstPage = document.querySelector(".firstButton");
const lastPage = document.querySelector(".lastButton");
const firstCurrentPage = 1;

let currentPage = 1;
let totalPerPage = 15;
let totalPages = 10;
let lastCurrentPage = Math.ceil(dataCopy.length / totalPages);
console.log(lastCurrentPage);

const pagination = (array, page) => {
  // console.log(array);
  return array.slice((page - 1) * totalPerPage, page * totalPerPage);
};

const tableDiv = document.querySelector(".tableDiv");
const table = document.createElement("table");
const tbody = document.createElement("tbody");
// const thead = document.createElement("thead");

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
      if (!acc[key]) acc[key] = { count: 0 };
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

const finalAttendanceData = uniteData([attendanceFilter]);
const finalFinanceData = uniteData([financeFilter]);
const finalProcedureData = uniteData([procedureIdFilter]);
const finalGroupKeyData = uniteData([groupKeyFilter]);

const createTable = (data, data2, data3, data4) => {
  const headingRow = table.insertRow();
  const headingTitles = [
    "Attendance ids",
    "Finance ids",
    "group keys",
    "procedure ids",
  ];

  headingTitles.forEach((title) => {
    const th = document.createElement("th");
    th.classList.add("table-dark");
    th.setAttribute("style", "text-align : center");

    th.textContent = title;
    headingRow.appendChild(th);
  });

  tbody.innerHTML = "";

  data.forEach((_, i) => {
    const keyFormatter = (value) => {
      const format = value.match(/IDX_\d+/);

      return format;
    };
    const row = document.createElement("tr");

    row.setAttribute("style", "text-align: center");
    row.classList.add("table-dark");
    row.textContent = "";

    row.insertCell().textContent = data[i].key;
    row.insertCell().textContent = data4[i].key;
    row.insertCell().textContent = keyFormatter(data2[i].key);
    row.insertCell().textContent =
      data3[i]?.key && data3[i]?.key !== "null" ? data3[i]?.key : "-";

    tbody.appendChild(row);
  });

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
  console.log(currentPage);
  if (currentPage < lastCurrentPage) {
    currentPage = lastCurrentPage;
    const attColumn = pagination(finalAttendanceData, currentPage);
    const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
    const prcdColumn = pagination(finalProcedureData, currentPage);
    const financeColumn = pagination(finalFinanceData, currentPage);
    createTable(attColumn, grpKeyColumn, prcdColumn, financeColumn);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const attColumn = pagination(finalAttendanceData, currentPage);
  const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
  const prcdColumn = pagination(finalProcedureData, currentPage);
  const financeColumn = pagination(finalFinanceData, currentPage);
  createTable(attColumn, grpKeyColumn, prcdColumn, financeColumn);
});
