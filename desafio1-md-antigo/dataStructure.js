/*
PONTO ENCONTRADO: 
- Ao pesquisar por um nome que não estja na pagina não é exibido o resultado da pesquisa
- Botao de order paciente nao está funcionando
- Filtro de data está errado, o valor que se inicia não devia exibir nada



*/


let dataGuides;
let insuranceGuides;
let currentPage = 1;
const totalPerPage = 2;
let totalPages;
totalPages = 5;

const inputInitialDate = document.querySelector(".inputInitialDate");
const inputFinalDate = document.querySelector(".inputFinalDate");
// função para capturar os dados
const fetchPoints = async () => {
  try { // trocar try por catch .then e .catch
    const guideResponse = await fetch(
      "https://augustoferreira.com/augustoferreira/amigo/guides.json"
    ).catch((error) => {
      alert("Erro ao buscar dados do JSON :", error);
    }); // espaço entre o metodo fetch
    const insuranceResponse = await fetch(
      "https://augustoferreira.com/augustoferreira/amigo/insurances.json"
    ).catch((error) => {
      alert("Erro ao buscar dados do JSON :", error);
    });

    dataGuides = await guideResponse.json();
    insuranceGuides = await insuranceResponse.json();
    return { dataGuides, insuranceGuides };
  } catch (error) {
    console.error("error", error);
  }
};
// função para criar as células com as informações capturadas
const callFetch = async () => {
  const { dataGuides } = await fetchPoints(); // desestruturação mais não está sendo utilizada
  createCells(dataGuides.data.guides, currentPage);
};

callFetch();
let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
let finalDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

document.addEventListener("DOMContentLoaded", () => {
  // formatacao de linha errada, quebrando onde não deveria
  document.querySelector(".inputInitialDate").value =
    firstDay.toLocaleDateString("en-CA");
  // formatacao de linha errada, quebrando onde não deveria
  document.querySelector(".inputFinalDate").value =
    finalDay.toLocaleDateString("en-CA");

  createOptions();
  createList();
});
const table = document.querySelector(".table tbody");

// // função para apagar as linhas iniciais da tabela (utilizando nodeList)
const clearData = () => {
  const table = document.querySelector(".table");
  [...table.childNodes[3].children].forEach((tr) => // quabra de linha errada, se for quebrar linha usar as chaves {}
    table.childNodes[3].removeChild(tr)
  );
};

// função para criar as opções de convênio
const createOptions = async () => { // createOptions deve ser chamada quando insuranceGuides acabar de receber os valores do fetch
  await fetchPoints(); // se insuranceGuides já tem os valores pq chamar novamente?


  const select = document.querySelector(".select"); // sendo utilizada em mais de um lugar, entao deveria esta global
  let allOption = document.createElement("option"); // trocar let por const

  select.innerHTML = "";

  allOption.classList.add("insuranceOptions");
  allOption.value = 0;
  allOption.textContent = "Convênio";
  select.appendChild(allOption);

  insuranceGuides?.data.forEach((insurance) => {
    let option = document.createElement("option"); // trocar let por const
    option.classList.add("insuranceOptions");
    option.value = insurance.id;
    option.textContent = insurance.name;
    select.appendChild(option);
  });
};
// função para criar a paginação
const createList = async () => { // createList deve ser chamada quando dataGuides acabar de receber os valores do fetch
  await fetchPoints(); // se dataGuides já tem o valor, pq chamar novamente? 
  const parentElement = document.querySelector("#page-item-parent"); // deve está global

  parentElement.innerHTML = "";

  const totalGuides = dataGuides.data.guides.length;
  const numberOfPages = totalGuides / totalPerPage;

  for (i = 1; i <= numberOfPages; i++) {
    let li = document.createElement("li"); // trocar let por const
    let anchor = document.createElement("a"); // trocar let por const

    li.classList.add("page-item");
    anchor.classList.add("page-link");
    anchor.textContent = i;

    const page = i; // espaco após uma constante
    anchor.addEventListener("click", () => {
      createCells(dataGuides.data.guides, page);

      anchor.value = anchor.innerHTML;
      currentPage = anchor.value;
      createCells(dataGuides.data.guides, currentPage);
    });

    li.appendChild(anchor);
    parentElement.appendChild(li);
  }
}; // espaco depois de uma função
// função que cria as células e linhas da tabela
const createCells = (guides, page, guidesPerPage = totalPerPage) => {
  const arrayOfGuides = Array.isArray(guides) ? guides : [];

  const currentPageGuides = arrayOfGuides.slice( // deixar em linnha melhora a visualizacao nesse caso 
    (page - 1) * guidesPerPage,
    page * guidesPerPage
  );

  clearData(); // espaco
  currentPageGuides.forEach((guide) => {
    const data = new Date(guide.start_date).toLocaleDateString("pt-BR");
    let row = table.insertRow();// trocar let por const
    const profileImg = // deixar em linnha melhora a visualizacao nesse caso 
      guide.patient.thumb_url ||
      `https://cdn-icons-png.freepik.com/512/8742/8742495.png`;

    row.insertCell().innerHTML = data;
    row.insertCell().innerHTML = guide.number || `<td class="Null">-</td>`; // trocar nome de classe
    const name = guide.patient.name; // espaco no const ou utilizar  guide.patient.name no span abaixo diretemante
    row.insertCell().innerHTML =
      `<img src="${profileImg}" class="img"></img>` + `<span>${name}</span>`;

    const insuranceCell = row.insertCell();
    insuranceCell.innerHTML = // quebrar linha desnescessaria
      guide.health_insurance?.name || `<td class="Null">-</td>`;// trocar nome de classe
    if (guide.health_insurance?.is_deleted === true) { // não comparar booleanos com === true ou false
      insuranceCell.classList.add("linethrough");
    }

    isNaN(guide.price) || guide.price === null
      ? (row.insertCell().innerHTML = `<tdclass="Null">-</td>`) // formatacao errada e trocar nome de classe
      : (row.insertCell().innerHTML = guide.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }));
  });
}; // quebrar linha
//funções para os botões da paginação
const clickFirstPage = () => {
  currentPage = 1;
  clearData();
  createCells(dataGuides.data.guides, currentPage);
};// quebrar linha
let nextLink = document.getElementById("next"); // trocar let por const

const clickNextPage = () => {
  if (currentPage < totalPages) {
    currentPage++;
    clearData();
    createCells(dataGuides.data.guides, currentPage);
  } // quebrar linha
  updatePageLinks();
};

const clickPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    clearData();
    createCells(dataGuides.data.guides, currentPage);
  } // quebrar linha
  updatePageLinks();
}; // quebrar linha
// função para atualizar o estado dos botões de navegação
const updatePageLinks = () => {
  const totalGuides = dataGuides.data.guides.length;
  totalPages = totalGuides / totalPerPage;

  const previousLink = document.getElementById("previous"); // importar global
  if (currentPage === 1) {
    previousLink.disabled = true;
    previousLink.classList.add("blockedLink");
  } else {
    previousLink.disabled = false;
    previousLink.classList.remove("blockedLink");
  }

  const nextLink = document.getElementById("next"); // importar global
  if (currentPage === totalPages) {
    nextLink.disabled = true;
    nextLink.classList.add("blockedLink");
  } else {
    nextLink.disabled = false;
    nextLink.classList.remove("blockedLink");
  }
}; // quebrar linha
const clickLastPage = () => {
  currentPage = totalPages;
  clearData();
  createCells(dataGuides.data.guides, currentPage);
}; // quebrar linha
// função para a ordenação dos nomes dos pacientes
const patientButton = document.querySelector(".patientButton"); // importacao global no topo
const buttonStatus = () => {
  const icon = document.querySelector("i");
  const patientNames = dataGuides.data.guides;

  clearData();

  if (icon.classList.contains("fa-sort-up")) {
    patientNames.sort((a, b) => b.patient.name.localeCompare(a.patient.name));

    icon.classList.remove("fa-sort-up");
    icon.classList.add("fa-sort-down");
  } else {
    patientNames.sort((a, b) => a.patient.name.localeCompare(b.patient.name));

    icon.classList.remove("fa-sort-down");
    icon.classList.add("fa-sort-up");
  }
  createCells(patientNames);
};
patientButton.addEventListener("click", buttonStatus);

// função para o evento do select
function selectOptions() {
  const select = document.querySelector(".select"); // sendo utilizada em mais de um lugar, entao deveria esta global
  const selectedInsuranceId = parseInt(select.value);

  if (selectedInsuranceId === 0) {
    clearData();
    return createCells(dataGuides.data.guides, currentPage);
  }
  const selectionsFilter = dataGuides.data.guides.filter(
    (guide) => guide.insurance_id === selectedInsuranceId
  );
  if (selectionsFilter.length > 0) {
    clearData();
    createCells(selectionsFilter, currentPage);
  } else {
    clearData();
    table.insertRow().innerHTML = `<td colspan="5" style="text-align: center;">Nenhuma guia encontrada</td>`;
  }
}

//função para o evento da barra de pesquisa
function search() {
  const searchBar = document.querySelector(".input").value.toLowerCase().trim();
  clearData();
  const filteredGuides = dataGuides.data.guides.filter((guide) => {
    const nameIsEqual = guide.patient.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .includes(searchBar);
    const numberIsEqual = guide.number.includes(parseInt(searchBar));
    return nameIsEqual || numberIsEqual;
  });
  console.log(filteredGuides);
  if (!filteredGuides.length) {
    clearData();
    table.insertRow().innerHTML = `<td colspan="5" style="text-align: center;">Nenhuma guia encontrada</td>`;
  } else {
    clearData();
    createCells(filteredGuides, currentPage);
  }
}
// função para a pesquisa de pacientes por filtragem de data
const dateSelect = () => {
  const inputInitialDate = document.querySelector(".inputInitialDate").value; // importar global e usar o valor
  const inputFinalDate = document.querySelector(".inputFinalDate").value; // importar global e usar o valor
  const dateInitial = inputInitialDate;
  const dateFinal = inputFinalDate;
  const filteredGuidesByDate = dataGuides.data.guides.filter((guide) => {
    return guide.start_date >= dateInitial && guide.start_date <= dateFinal;
  });
  console.log(filteredGuidesByDate); // remover console.log
  if (filteredGuidesByDate.length === 0) {
    clearData();
    table.innerHTML = `<td colspan="5" style="text-align: center;">Nenhuma guia encontrada</td>`;
    return;
  }
  clearData();
  createCells(filteredGuidesByDate, currentPage);
}; // quebrar linha
// função para o botão que retorna para o primeiro e último dia do mês
setMonthButton = () => {
  document.querySelector(".inputInitialDate").value =
    firstDay.toLocaleDateString("en-CA");
  document.querySelector(".inputFinalDate").value =
    finalDay.toLocaleDateString("en-CA");
}; // quebrar linha
// função que retorna para o dia atual
setDayButton = () => {
  document.querySelector(".inputInitialDate").value =
    new Date().toLocaleDateString("en-CA");
  document.querySelector(".inputFinalDate").value =
    new Date().toLocaleDateString("en-CA");
};
