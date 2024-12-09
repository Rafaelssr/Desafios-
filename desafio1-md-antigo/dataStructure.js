let dataGuides;
let insuranceGuides;
let currentPage = 1;
const totalPerPage = 2;
let totalPages;
totalPages = 5;

const table = document.querySelector(".table tbody");
const select = document.querySelector(".select");
const previousLink = document.getElementById("previous");
const firstPage = document.getElementById("first");
const nextLink = document.getElementById("next");
const lastPage = document.getElementById("last");

const parentElement = document.querySelector("#page-item-parent");
const patientButton = document.querySelector(".patientButton");
const inputInitialDate = document.querySelector(".inputInitialDate");
const inputFinalDate = document.querySelector(".inputFinalDate");

// função para capturar os dados
const fetchPoints = async () => {
  try {
    const guideResponse = await fetch(
      "https://augustoferreira.com/augustoferreira/amigo/guides.json"
    );

    const insuranceResponse = await fetch(
      "https://augustoferreira.com/augustoferreira/amigo/insurances.json"
    );

    dataGuides = await guideResponse.json();
    insuranceGuides = await insuranceResponse.json();
  } catch (error) {
    console.error("error", error);
  }
};
const pagination = (array, page, guidesPerPage) => {
  return array.slice((page - 1) * guidesPerPage, page * guidesPerPage);
};

let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
let finalDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

document.addEventListener("DOMContentLoaded", async () => {
  await fetchPoints();

  document.querySelector(".inputInitialDate").value =
    firstDay.toLocaleDateString("en-CA");
  document.querySelector(".inputFinalDate").value =
    finalDay.toLocaleDateString("en-CA");

  const initalArray = pagination(dataGuides.data.guides, currentPage, totalPerPage);

  createCells(initalArray);
  createOptions();
  createList();
});

// função para apagar as linhas iniciais da tabela (utilizando nodeList)
const clearData = () => {
  const table = document.querySelector(".table");
  [...table.childNodes[3].children].forEach((tr) =>
    table.childNodes[3].removeChild(tr)
  );
};

const dynamicAnchorCreation = () => {
  parentElement.innerHTML = "";

  const totalGuides = dataGuides.data.guides.length;
  const numberOfPages = Math.ceil(totalGuides / totalPerPage);

  for (i = 1; i <= numberOfPages; i++) {
    const li = document.createElement("li");
    const anchor = document.createElement("a");

    li.classList.add("page-item");
    anchor.classList.add("page-link");
    anchor.textContent = i;

    anchor.addEventListener("click", () => {
      const pageIndex = pagination(
        dataGuides.data.guides,
        currentPage,
        totalPerPage
      );
      createCells(pageIndex, i);
      anchor.value = anchor.innerHTML;
      currentPage = anchor.value;
    });

    li.appendChild(anchor);
    parentElement.appendChild(li);
  }
};

// função para criar as opções de convênio
const createOptions = async () => {
  await fetchPoints();
  const allOption = document.createElement("option");

  select.innerHTML = "";

  allOption.classList.add("insuranceOptions");
  allOption.value = 0;
  allOption.textContent = "Convênio";
  select.appendChild(allOption);

  insuranceGuides.data.forEach((insurance) => {
    const option = document.createElement("option");
    option.classList.add("insuranceOptions");
    option.value = insurance.id;
    option.textContent = insurance.name;
    select.appendChild(option);
  });
};

// função para criar a paginação
const createList = async () => {
  await fetchPoints();
  dynamicAnchorCreation();
};

// função que cria as células e linhas da tabela
const createCells = (guides) => {
  clearData();

  guides.forEach((guide) => {
    const data = new Date(guide.start_date).toLocaleDateString("pt-BR");
    const row = table.insertRow();
    const profileImg = guide.patient.thumb_url || `https://cdn-icons-png.freepik.com/512/8742/8742495.png`;

    row.insertCell().innerHTML = data;
    row.insertCell().innerHTML = guide.number || `<td class="absentGuideInfo">-</td>`;
    row.insertCell().innerHTML = `<img src="${profileImg}" class="img"></img>`+`<span>${guide.patient.name}</span>`;

    const insuranceCell = row.insertCell();
    insuranceCell.innerHTML =
      guide.health_insurance?.name || `<td class="absentGuideInfo">-</td>`;
    if (guide.health_insurance?.is_deleted) {
      insuranceCell.classList.add("linethrough");
    }

    isNaN(guide.price) || guide.price === null
      ? (row.insertCell().innerHTML = `<tdclass="absentGuideInfo">-<td>`)
      : (row.insertCell().innerHTML = guide.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }));
  });
};

//funções para os botões da paginação
const clickFirstPage = () => {
  const pageIndex = pagination(dataGuides.data.guides, currentPage, totalPerPage);
  currentPage = 1;
  clearData();
  createCells(pageIndex, currentPage);
};

const clickNextPage = () => {
  if (currentPage < totalPages) {
    currentPage++;
    const pageIndex = pagination(dataGuides.data.guides, currentPage, totalPerPage);
    clearData();
    createCells(pageIndex, currentPage);
  }

  updatePageLinks();
};

const clickPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    const pageIndex = pagination(dataGuides.data.guides, currentPage, totalPerPage);
    clearData();
    createCells(pageIndex, currentPage);
  }

  updatePageLinks();
};

// função para atualizar o estado dos botões de navegação
const updatePageLinks = () => {
  if (currentPage === 1) {
    previousLink.disabled = true;
    previousLink.classList.add("blockedLink");
    firstPage.disabled = true;
    firstPage.classList.add("blockedLink");
  } else {
    previousLink.disabled = false;
    previousLink.classList.remove("blockedLink");
    firstPage.disabled = false;
    firstPage.classList.remove("blockedLink");
  }

  if (currentPage === totalPages) {
    nextLink.disabled = true;
    nextLink.classList.add("blockedLink");
    lastPage.disabled = true;
    lastPage.classList.add("blockedLink");
  } else {
    nextLink.disabled = false;
    nextLink.classList.remove("blockedLink");
    lastPage.disabled = false;
    lastPage.classList.remove("blockedLink");
  }
  return;
};

const clickLastPage = () => {
  const pageIndex = pagination(
    dataGuides.data.guides,
    currentPage,
    totalPerPage
  );
  currentPage = totalPages;
  clearData();
  createCells(pageIndex, currentPage);
};

// função para a ordenação dos nomes dos pacientes
const buttonStatus = async () => {
  await fetchPoints();
  const patientsPerPage = pagination(
    dataGuides.data.guides,
    currentPage,
    totalPerPage
  );

  clearData();

  const icon = document.querySelector("i");
  if (icon.classList.contains("fa-sort-up")) {
    patientsPerPage.sort((a, b) =>
      b.patient.name.localeCompare(a.patient.name)
    );

    icon.classList.add("fa-sort-down");
    icon.classList.remove("fa-sort-up");
  } else {
    patientsPerPage.sort((a, b) =>
      a.patient.name.localeCompare(b.patient.name)
    );

    icon.classList.remove("fa-sort-down");
    icon.classList.add("fa-sort-up");
  }

  createCells(patientsPerPage, currentPage);
};

patientButton.addEventListener("click", buttonStatus);

// função para o evento do select
function selectOptions() {
  const selectedInsuranceId = parseInt(select.value);
  const patientsPerPage = pagination(dataGuides.data.guides, currentPage, totalPerPage);

  if (selectedInsuranceId === 0) {
    clearData();
    return createCells(patientsPerPage);
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
      .normalize("NFC")
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, "")
      .includes(searchBar);
    const numberIsEqual = guide.number.includes(parseInt(searchBar));
    return nameIsEqual || numberIsEqual;
  });

  if (!filteredGuides.length) {
    clearData();
    table.insertRow().innerHTML = `<td colspan="5" style="text-align: center;">Nenhuma guia encontrada</td>`;
  } else {
	  clearData();
	  const filteredBySearchBar = pagination(filteredGuides, currentPage, totalPerPage);
    createCells(filteredBySearchBar, currentPage);
  }
}

// função para a pesquisa de pacientes por filtragem de data
const dateSelect = (first, last) => {
  const pageIndex = pagination(dataGuides.data.guides,currentPage, totalPerPage);

  const dateInitial = first;
  const dateFinal = last;

  const filteredGuidesByDate = pageIndex.filter((guide) => {
    return guide.start_date >= dateInitial && guide.start_date <= dateFinal;
  });

  if (filteredGuidesByDate.length === 0) {
    clearData();
    table.innerHTML = `<td colspan="5" style="text-align: center;">Nenhuma guia encontrada</td>`;
    return;
  }

  clearData();
  createCells(filteredGuidesByDate, currentPage);
};

// função para o botão que retorna para o primeiro e último dia do mês
setMonthButton = () => {
  document.querySelector(".inputInitialDate").value =
    firstDay.toLocaleDateString("en-CA");
  document.querySelector(".inputFinalDate").value =
    finalDay.toLocaleDateString("en-CA");
  dateSelect(firstDay, finalDay);
};

// função que retorna para o dia atual
setDayButton = () => {
  const firstDay = (document.querySelector(".inputInitialDate").value =
    new Date().toLocaleDateString("en-CA"));
  const finalDay = (document.querySelector(".inputFinalDate").value =
    new Date().toLocaleDateString("en-CA"));
  dateSelect(firstDay, finalDay);
};
