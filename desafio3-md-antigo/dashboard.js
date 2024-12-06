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
//console.log(dataCopy); 

let currentPage = 1;
let totalPages = dataCopy.length;
let itemsPerPage = 10;

const table = document.createElement('table');
const thead = document.createElement('thead');
const tbody = document.createElement('tbody');
const tableDiv = document.querySelector('.tableDiv');

const paginateItems = (array, page, itemsPerPage) => {
  return array.slice((page - 1) * itemsPerPage, page * itemsPerPage);
};

const arrayFiltering = () => {
  const groupedbyAttendance = dataCopy // acessar o attendance_id e verificar quantas vezes os valores se repetem 
    .filter(guide => guide['procedure_id'] !== null)
    .reduce((acc, key) => {
      let keygroup = key[ 'procedure_id' ];

      if (!acc[keygroup]) {
        acc[ keygroup ] = {
          count: 1
        }
      }
      if(acc[keygroup]){
        acc[ keygroup ].count++;
      }

      return acc;
    }, {});
    console.log(groupedbyAttendance);
}

arrayFiltering();
  // const financeIdArray = arrayKeys.finance_id;
  // const attendanceIdArray = arrayKeys.attendance_id;
  // const groupKeyArray = arrayKeys.group_key;
  // const procedureIdArray = arrayKeys.procedure_id;

  // const arrayOfPrices = arrayKeys.price;
  // const arrayOfRecievedValue = arrayKeys.received_value;
  // const arrayOfLiquidPrices = arrayKeys.liquid_price;
  // const arrayOfTiss = arrayKeys.tiss_type;


  // attendanceIdArray.forEach(el => {
  //   const tr = document.createElement('tr');
  //   const td = document.createElement('td');

  //   td.textContent = `ids : ${el}`;

  //   thead.appendChild(td);
  //   thead.appendChild(tr);

  // })

// }

const createTable = () => {
  const headingRow = table.insertRow();
  const headingTitles = [ 'Attendance ids', 'Finance ids', 'group keys', 'ID' ];

  headingTitles.forEach((title) => {
    const th = document.createElement('th');
    th.textContent = title;
    headingRow.appendChild(th);
    
  })

  tbody.appendChild(thead);
  table.appendChild(tbody);
  tableDiv.appendChild(table);

  table.classList.add('table', 'table-bordered');

}




const startFunctions = () => {
  // arrayFiltering();
  createTable();
}

startFunctions();



