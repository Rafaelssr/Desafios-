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
let totalPages ;
let itemsPerPage = 10;

const table = document.createElement('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');
const tableDiv = document.querySelector('.tableDiv');

const paginateItems = (array, page, itemsPerPage) => {
  return array.slice((page - 1) * itemsPerPage, page * itemsPerPage);
};

const dataTreatment = (guides) => {
  const info = dataCopy
    .filter(guide => (value => value !== null && value !== undefined))
    .reduce((acc, key) => {
    let keyGroup = key[guides];

    if (!acc[keyGroup]) acc[keyGroup] = {count: 0}
    
    if (acc[keyGroup]) acc[keyGroup].count++;

    return acc;
    }, {});
  
  return info;
}



const createTable = () => {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headingRow = table.insertRow();
  const headingTitles = [ 'Attendance ids', 'Finance ids', 'group keys', 'procedure ids' ];

  headingTitles.forEach((title) => {
    const th = document.createElement('th');
    th.textContent = title;
    headingRow.appendChild(th);
    
  })


  finalData.forEach(row => {
    const tr = document.createElement('tr');

  })


  tbody.appendChild(thead);
  table.appendChild(tbody);
  tableDiv.appendChild(table);

  table.classList.add('table', 'table-bordered');

}


const attendanceFilter = dataTreatment('attendance_id');
const financeFilter = dataTreatment('finance_id');
const groupKeyFilter = dataTreatment('group_key');
const procedureIdFilter = dataTreatment('procedure_id');

const uniteData = (filters) => {
  const finalData = filters.reduce((acc, filter) => {
    Object.entries(filter).forEach(([key, value]) => {
      if (!acc[key]) acc[key] = {count :0};
      acc[key] = value.count;
    });

    return acc;
  }, {});

  return Object.entries(finalData).map(([key, counts]) => ({ key, ...counts }));
};

const startFunctions = () => {
  createTable();
  // const attendanceItens = Object.entries(attendanceFilter).map(([key, value]) => {});
  // const financeItens = Object.entries(financeFilter).map(([key, value]) => {});
  // const groupKeyItens = Object.entries(groupKeyFilter).map(([key, value]) => {console.log(key)});
}
const finalData = uniteData([attendanceFilter, financeFilter, groupKeyFilter, procedureIdFilter]);
console.log(finalData);
startFunctions();



