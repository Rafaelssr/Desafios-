// - Suponhamos que você é gestor de uma clínica e deseja obter alguns dados para ter noção da movimentação e execução de procedimentos que estão sendo executados e se os mesmos estão gerando valor considerável.
// - Você quer saber se o seu faturamento está indo bem!

// - Quantidade de procedimentos agrupado por ID - ok (concluído)
// - Quantidade de procedimentos por group_key - ok (concluído)
// - Quantidade de procedimentos por attendance_id - ok (concluído)
// - Quantidade de procedimentos por finance_id - ok (concluído)

// - Total produzido (price) - ok , total liquido (liquid_price) - ok , total recebido (received_value) e total não recebido (liquid_price - received_value) por  (concluídos)

// - Totais por tiss_type (tipo de guia) - ok (concluído)

// - Agrupar procedimentos por atendimento - ok (concluído)
// - Agrupar procedimentos por financeiro - ok (concluído)

// - Totais por data (dia / mes / ano) - ok (concluído)

// adicionar funcionalidade de filtro para os ids da tabela

import _data from "./jsonDashboard.js";

const liquidPrice = _data.reduce((acc, item) => acc + item.liquid_price, 0);
const totalPrice = _data.reduce((acc, item) => acc + item.price, 0);
const valueNotReceived = _data.reduce((acc, item) => acc + (item.liquid_price - item.received_value), 0);
const dataCopy = _data;

const nextPage = document.querySelector(".nextButton");
const prevPage = document.querySelector(".previousButton");
const firstPage = document.querySelector(".firstButton");
const lastPage = document.querySelector(".lastButton");
const changeInfoButton = document.querySelector(".changeInfoButton");
const additionalInfoDiv = document.querySelector(".additionalInfoDiv");
const paginationArea = document.querySelector(".paginationArea");
const valueText = document.querySelector(".valueText");
const dayGraphicButton = document.createElement("button");
const monthGraphicButton = document.createElement("button");
const yearGraphicButton = document.createElement("button");

dayGraphicButton.classList.add("button");
monthGraphicButton.classList.add("button");
yearGraphicButton.classList.add("button");

const container = document.querySelector("#container");
const table = document.createElement("table");
const tbody = document.createElement("tbody");

let currentChart;
let buttonIsClicked = false;
const firstCurrentPage = 1;
let currentPage = 1;
let totalPerPage = 10;
let totalPages = 26;

let lastCurrentPage = totalPages;

let totalFinanceId = {};
_data.forEach((item) => {
  if (!totalFinanceId[item.finance_id]) {
    totalFinanceId[item.finance_id] = 1;
  } else {
    totalFinanceId[item.finance_id]++;
  }
});

let totalNotReceived = {};
_data.forEach((item) => {
  if (!totalNotReceived[item.procedure_id]) {
    totalNotReceived[item.procedure_id] =
    item.liquid_price - item.received_value;
  } else {
    totalNotReceived[item.procedure_id] +=
    item.liquid_price - item.received_value;
  }
});


let tissTypeTotal = {};
_data.forEach((item) => {
  if (!tissTypeTotal[item.tiss_type]) {
    tissTypeTotal[item.tiss_type] = 1;
  } else {
    tissTypeTotal[item.tiss_type]++;
  }
});

let totalAttendances = {};
_data.forEach((item) => {
  if (!totalAttendances[item.attendance_id]) {
    totalAttendances[item.attendance_id] = 1;
  } else {
    totalAttendances[item.attendance_id]++;
  }
});

let totalPerProcedureId = {};
_data.forEach((item) => {
  if (!totalPerProcedureId[item.procedure_id]) {
    totalPerProcedureId[item.procedure_id] = 1;
  } else {
    totalPerProcedureId[item.procedure_id]++;
  }
});

let totalPerGroupKey = {};
_data.forEach((item) => {
  if (!totalPerGroupKey[item.group_key]) {
    totalPerGroupKey[item.group_key] = 1;
  } else {
    totalPerGroupKey[item.group_key]++;
  }
});

const formatISODate = (dateString) => {
  const [datePart] = dateString.split(' ');
  const [ year, month, day ] = datePart.split('-');

  return `${day}/${month}/${year}`;
}

let totalPerDate = {};
_data.forEach((item) => {
  let formattedDate = formatISODate(item.created_at);
  if (!totalPerDate[item.created_at]) {
    totalPerDate[formattedDate] = item.liquid_price;
  } else {
  totalPerDate[formattedDate] += item.liquid_price;
  }
});

let totalPerMonth = {};
let totalPerYear = {};

_data.forEach((item) => {
  let date = formatISODate(item.created_at);
  let [day, month, yearAndTime] = date.split('/');
  let year = yearAndTime.split(' ')[0];

  let dayLabel = `${day}/${month}/${year}`;
  let monthLabel = `${year}-${month}`;
  let yearLabel = year;

  totalPerDate[dayLabel] = (totalPerDate[dayLabel] || 0) + item.liquid_price;

  totalPerMonth[monthLabel] = (totalPerMonth[monthLabel] || 0) + item.liquid_price;

  totalPerYear[yearLabel] = (totalPerYear[yearLabel] || 0) + item.liquid_price;
});

let dailyLabels = Object.keys(totalPerDate);
let dailyData = Object.values(totalPerDate);

let monthlyLabels = Object.keys(totalPerMonth);
let monthlyData = Object.values(totalPerMonth);

let yearlyLabels = Object.keys(totalPerYear);
let yearlyData = Object.values(totalPerYear);

const pagination = (info, page) => {
  const array = Array.isArray(info) ? info : Object.entries(info);
  return array.slice((page - 1) * totalPerPage, page * totalPerPage);
};

const dataTreatment = (guides) => {
  const info = dataCopy
    .filter(() => value => value !== null && value !== undefined)
    .reduce((acc, key) => {
      let keyGroup = key[guides];

      if (!acc[keyGroup]) acc[keyGroup] = {count: 0};

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
const tissTypeFilter = dataTreatment("tiss_type");

const finalAttendanceData = uniteData([attendanceFilter]);
const finalFinanceData = uniteData([financeFilter]);
const finalProcedureData = uniteData([procedureIdFilter]);
const finalGroupKeyData = uniteData([groupKeyFilter]);
const finalTissTypeData = uniteData([tissTypeFilter]);

const createTable = (data, data2, data3, data4) => {

  let repetitionCounts = {totalAttendances, totalFinanceId, totalPerProcedureId, totalPerGroupKey};

  const headingRow = table.insertRow();

  const headingTitles = ["Id dos atendimentos", "Id das finanças", "chaves", "Id dos Procedimentos", "atendimento/finança","atendimento/procedimento"];

  headingTitles.forEach((title) => {
    const th = document.createElement("th");
    th.classList.add("table-dark");
    th.setAttribute("style", "text-align : center");

    th.textContent = title;
    headingRow.appendChild(th);
  });

  tbody.innerHTML = "";

  const createIconWithTooltip = (id, count) => {

    const iconHolder = document.createElement("span");
    let infoIcon = document.createElement("i");
    let filterIcon = document.createElement("i");

    filterIcon.classList.add("fa-solid", "fa-filter");

    infoIcon.classList.add("fa-solid", "fa-circle-info");

    const repetitionCount = count || 0;
    infoIcon.setAttribute("title", `Este ID se repete ${repetitionCount} vez(es).`);

    filterIcon.setAttribute("title", `você gostaria de filtrar a tabela pelo  ID ${id}?`);

    iconHolder.appendChild(infoIcon);
    iconHolder.appendChild(filterIcon);

    return iconHolder;
  }

  const keyFormatter = (value) => {const format = value.match(/IDX_\d+/); return format};

  const idFormatter = (info1, info2, repetitionCount1, repetitionCount2) => {
    if (!info1 || !info2 || info1 === "null" || info2 === "null") {
      return "-";
    } else {
      const infoIcon = document.createElement("i");
      const filterIcon = document.createElement("i");
      filterIcon.classList.add("fa-solid", "fa-filter");

      infoIcon.classList.add("fa-solid", "fa-circle-info");
      infoIcon.setAttribute("title", `O ID ${info1} é repetido ${repetitionCount1} vez(es), e o ID ${info2} é repetido ${repetitionCount2} vez(es)`);

      filterIcon.setAttribute("title", `Você gostaria de filtrar a tabela pelo ID ${info1}, ou pelo ID ${info2}?`)
      return `${info1}-${info2} ${infoIcon.outerHTML} ${filterIcon.outerHTML}`;
    }
  };

  data.forEach((_filter, i) => {

    const tr = document.createElement("tr");
    tr.classList.add("table-dark");
    tr.innerHTML = "";

    const attendanceId = data[ i ]?.key;
    const financeId = data2[i]?.key;
    const procedureId = data4[i]?.key;
    const groupKey = data3[i]?.key;

    const attendanceCell = tr.insertCell();
    attendanceCell.innerHTML = attendanceId;
    attendanceCell.appendChild(createIconWithTooltip(attendanceId, repetitionCounts.totalAttendances[attendanceId]));

    const financeCell = tr.insertCell();
    financeCell.innerHTML = financeId;
    financeCell.appendChild(createIconWithTooltip(financeId, repetitionCounts.totalFinanceId[financeId]));

    const groupKeyCell = tr.insertCell();
    groupKeyCell.innerHTML = keyFormatter(groupKey);
    groupKeyCell.appendChild(createIconWithTooltip(groupKey, repetitionCounts.totalPerGroupKey[groupKey]));

    const procedureCell = tr.insertCell();
    procedureCell.innerHTML = procedureId && procedureId !== "null" ? procedureId : "-";
    if (procedureId && procedureId !== "null") {
      procedureCell.appendChild(createIconWithTooltip(procedureId, repetitionCounts.totalPerProcedureId[procedureId]));
    }

    const attendanceFinanceCell = tr.insertCell();
    const attendanceWithFinance = idFormatter(attendanceId, financeId, repetitionCounts.totalAttendances[attendanceId] , repetitionCounts.totalFinanceId[financeId]);
    attendanceFinanceCell.innerHTML = attendanceWithFinance;

    const attendanceProcedureCell = tr.insertCell();
    const attendanceWithProcudure = idFormatter(attendanceId, procedureId, repetitionCounts.totalAttendances[attendanceId], repetitionCounts.totalPerProcedureId[procedureId]);
    attendanceProcedureCell.innerHTML = attendanceWithProcudure;

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
  container.appendChild(paginationArea);
  table.classList.add("table", "table-bordered");

  return table;
};


const createDateGraphics = (labels, data) => {
  if (currentChart) { currentChart.destroy(); }

  const canvas = document.getElementById("chartCanvas").getContext('2d');
  currentChart = new Chart(canvas,{
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Faturamento',
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)"
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

changeInfoButton.addEventListener("click", () => {
  if (!buttonIsClicked) {
    changeInfoButton.textContent = "Procedimentos";
    paginationArea.classList.add("show-only-last");
    additionalInfoDiv.style.display = "none";
    table.style.display = "none"

    container.appendChild(dayGraphicButton);
    container.appendChild(monthGraphicButton);
    container.appendChild(yearGraphicButton);

    dayGraphicButton.textContent = "Faturamento Diário";
    monthGraphicButton.textContent = "Faturamento Mensal";
    yearGraphicButton.textContent = "Faturamento Anual";

    dayGraphicButton.style.display = "block";
    monthGraphicButton.style.display = "block";
    yearGraphicButton.style.display = "block";

    valueText.style.display = "flex;"
    document.querySelector(".graphic").style.display = "block";

    buttonIsClicked = true;
  } else {
    changeInfoButton.textContent = "Faturamento";
    table.style.display = "block";
    table.removeAttribute("style", "min-height: 622px;");

    paginationArea.style.display = "flex";
    paginationArea.classList.remove("show-only-last");

    additionalInfoDiv.style.display = "grid";

    dayGraphicButton.style.display = "none";
    monthGraphicButton.style.display = "none";
    yearGraphicButton.style.display = "none";

    document.querySelector(".graphic").style.display = "none";

    buttonIsClicked = false;
  }
});

const formatValues = new Intl.NumberFormat("pt-BR", { currency: "BRL", style: "currency", });

const addInfoToDiv = () => {
  valueText.textContent = `
    total não recebido : ${formatValues.format(valueNotReceived)}
    total Recebido: ${formatValues.format(totalPrice)}
    total líquido: ${formatValues.format(liquidPrice)}
  `
}

nextPage.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;

    const attColumn = pagination(finalAttendanceData, currentPage);
    const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
    const prcdColumn = pagination(finalProcedureData, currentPage);
    const financeColumn = pagination(finalFinanceData, currentPage);
    const tissTypeColumn = pagination(finalTissTypeData, currentPage);

    createTable(attColumn, financeColumn, grpKeyColumn, prcdColumn, tissTypeColumn);
  } else return;
});

prevPage.addEventListener("click", () => {
  if (currentPage !== firstCurrentPage) {
    currentPage--;

    const attColumn = pagination(finalAttendanceData, currentPage);
    const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
    const prcdColumn = pagination(finalProcedureData, currentPage);
    const financeColumn = pagination(finalFinanceData, currentPage);
    const tissTypeColumn = pagination(finalTissTypeData, currentPage);

    createTable(attColumn, financeColumn, grpKeyColumn, prcdColumn, tissTypeColumn);
  }
});
firstPage.addEventListener("click", () => {
  if (currentPage > firstCurrentPage) {
    currentPage = 1;

    const attColumn = pagination(finalAttendanceData, currentPage);
    const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
    const prcdColumn = pagination(finalProcedureData, currentPage);
    const financeColumn = pagination(finalFinanceData, currentPage);
    const tissTypeColumn = pagination(finalTissTypeData, currentPage);

    createTable(attColumn, financeColumn, grpKeyColumn, prcdColumn, tissTypeColumn);
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

    createTable( attColumn, financeColumn, grpKeyColumn, prcdColumn, tissTypeColumn);
  }
});

dayGraphicButton.addEventListener('click', () => {
  createDateGraphics(dailyLabels, dailyData);
});

monthGraphicButton.addEventListener('click', () => {
  createDateGraphics(monthlyLabels, monthlyData);
});

yearGraphicButton.addEventListener('click', () => {
  createDateGraphics(yearlyLabels, yearlyData);
});

document.addEventListener("DOMContentLoaded", () => {
  const attColumn = pagination(finalAttendanceData, currentPage);
  const grpKeyColumn = pagination(finalGroupKeyData, currentPage);
  const prcdColumn = pagination(finalProcedureData, currentPage);
  const financeColumn = pagination(finalFinanceData, currentPage);
  const tissTypeColumn = pagination(finalTissTypeData, currentPage);

  createTable(attColumn, financeColumn, grpKeyColumn, prcdColumn, tissTypeColumn);
  createDateGraphics(dailyLabels, dailyData);

  document.querySelector(".graphic").style.display = "none";
  addInfoToDiv();
});
