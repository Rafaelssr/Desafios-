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

let currentPage = 1;
let totalPerPage = 15;

const pagination = (array, page, guidesPerPage) => {
  return array.slice((page - 1) * guidesPerPage, page * guidesPerPage);
};
const body = document.querySelector('.body');

const tableDiv = document.querySelector(".tableDiv");
const table = document.createElement("table");
const tbody = document.createElement("tbody");

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

const clearTable = () => {
  const totalPages = Math.ceil(dataCopy.length / totalPerPage);
  for (let i = 0; i <= totalPages; i++) {
    const row = document.createElement("tr");
    row.insertCell().textContent = "";
    row.insertCell().textContent = "";
    row.insertCell().textContent = "";
    row.insertCell().textContent = "";
  }
};
const finalAttendanceData = uniteData([attendanceFilter]);
const finalFinanceData = uniteData([financeFilter]);
const finalProcedureData = uniteData([procedureIdFilter]);
const finalGroupKeyData = uniteData([groupKeyFilter]);

const createTable = () => {
  clearTable();

  const thead = document.createElement("thead");

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
    th.setAttribute("style", 'text-align : center');

    th.textContent = title;
    headingRow.appendChild(th);
  });

  finalAttendanceData.forEach((_filter, i) => {

    const keyFormatter = (key) => {
      const format = key.match(/IDX_\d+/);
      return format;
    }

    const row = document.createElement("tr");
    row.setAttribute("style", 'text-align: center');
    row.classList.add("table-dark");
    
    row.insertCell().textContent = finalAttendanceData[i].key;
    row.insertCell().textContent = finalFinanceData[i].key;
    row.insertCell().textContent = keyFormatter(finalGroupKeyData[i].key);
    row.insertCell().textContent = finalProcedureData[ i ]?.key;
    if (finalProcedureData[ i ]?.key === null) {
      finalProcedureData[ i ].key.textContent = ""}
    console.log(finalProcedureData[ i ]);
    tbody.appendChild(row);
  });

  tbody.appendChild(thead);
  table.appendChild(tbody);
  tableDiv.appendChild(table);

  table.classList.add("table", "table-bordered");
};

const createButtons = () => {
  for (let i = 0; i <= 4; i++){
    const button = document.createElement('button');
    button.classList.add("tableButtons");
    button.textContent = i;
    button.value = button.innerHTML;
    button.appendChild(tbody);
  }
}

createButtons();




document.addEventListener("DOMContentLoaded", () => {
  pagination(finalAttendanceData, currentPage, totalPerPage);
  pagination(finalFinanceData, currentPage, totalPerPage);
  createTable();
});

