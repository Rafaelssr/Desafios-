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
console.log(dataCopy);




const arrayFiltering = () => {
  let attendanceId;
  let groupKeys;
  let financeId;
  let tissArray;
  const arrayGroups = dataCopy.filter((guides) => {
     attendanceId = guides.attendance_id;
     groupKeys = guides.group_key;
     financeId = guides.finance_id;
     tissArray = guides.tiss_type;
     console.log(financeId);
    })
  
}

const createTable = () => {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const tableDiv = document.querySelector('.tableDiv');

  const headingRow = table.insertRow();
  const headingTitles = [ 'Attendance_id', 'Finance_id', 'GroupKey', 'ID' ];

  headingTitles.forEach((title) => {
    const th = document.createElement('th');
    th.textContent = title;
    headingRow.appendChild(th);
    
  })
   tbody.appendChild(thead);
  table.appendChild(tbody);
  tableDiv.appendChild(table);
}




const awakeFunctions = () => {
  arrayFiltering();
  createTable();

}
awakeFunctions();