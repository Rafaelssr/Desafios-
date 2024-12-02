let dataGuides;
let insuranceGuides;
let currentPage = 1;
const totalPerPage = 2;
let totalPages;
totalPages = 5;
const inputInitialDate = document.querySelector(".inputInitialDate");
const inputFinalDate = document.querySelector(".inputFinalDate");

const fetchPoints = async () => {
  try {
    const guideResponse = await fetch(
      "https://augustoferreira.com/augustoferreira/amigo/guides.json"
    ).catch((error) => {
      alert("Erro ao buscar dados do JSON :", error);
    });
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

const callFetch = async () => {
  const { dataGuides } = await fetchPoints();
  createCells(dataGuides.data.guides, currentPage);
};

callFetch();
let date = new Date();
let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
let finalDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".inputInitialDate").value =
    firstDay.toLocaleDateString("en-CA");
  document.querySelector(".inputFinalDate").value =
    finalDay.toLocaleDateString("en-CA");

  createOptions();
  createList();
});
const table = document.querySelector(".table tbody");
// // função para apagar as linhas iniciais da tabela (utilizando nodeList)
const clearData = () => {
  const table = document.querySelector(".table");
  [...table.childNodes[3].children].forEach((tr) =>
    table.childNodes[3].removeChild(tr)
  );
};

const createOptions = async () => {
  await fetchPoints();

  const select = document.querySelector(".select");
  let allOption = document.createElement("option");

  select.innerHTML = "";

  allOption.classList.add("insuranceOptions");
  allOption.value = 0;
  allOption.textContent = "Convênio";
  select.appendChild(allOption);

  insuranceGuides?.data.forEach((insurance) => {
    let option = document.createElement("option");
    option.classList.add("insuranceOptions");
    option.value = insurance.id;
    option.textContent = insurance.name;
    select.appendChild(option);
  });
};

const createList = async () => {
  await fetchPoints();
  const parentElement = document.querySelector("#page-item-parent");

  parentElement.innerHTML = "";

  const totalGuides = dataGuides.data.guides.length;
  const numberOfPages = totalGuides / totalPerPage;

  for (i = 1; i <= numberOfPages; i++) {
    let li = document.createElement("li");
    let anchor = document.createElement("a");

    li.classList.add("page-item");
    anchor.classList.add("page-link");
    anchor.textContent = i;

    const page = i;
    anchor.addEventListener("click", () => {
      createCells(dataGuides.data.guides, page);

      anchor.value = anchor.innerHTML;
      currentPage = anchor.value;
      createCells(dataGuides.data.guides, currentPage);
    });

    li.appendChild(anchor);
    parentElement.appendChild(li);
  }
};

const createCells = (guides, page, guidesPerPage = totalPerPage) => {
  const arrayOfGuides = Array.isArray(guides) ? guides : [];

  const currentPageGuides = arrayOfGuides.slice(
    (page - 1) * guidesPerPage,
    page * guidesPerPage
  );
  // console.log(currentPageGuides);

  clearData();
  currentPageGuides.forEach((guide) => {
    console.log("Linha para o paciente:", guide.patient.name);

    const data = new Date(guide.start_date).toLocaleDateString("pt-BR");
    let row = table.insertRow();
    const profileImg =
      guide.patient.thumb_url ||
      `https://cdn-icons-png.freepik.com/512/8742/8742495.png`;

    row.insertCell().innerHTML = data;
    row.insertCell().innerHTML = guide.number || `<td class="Null">-</td>`;
    const name = guide.patient.name;
    row.insertCell().innerHTML =
      `<img src="${profileImg}" class="img"></img>` + `<span>${name}</span>`;

    const insuranceCell = row.insertCell();
    insuranceCell.innerHTML =
      guide.health_insurance?.name || `<td class="Null">-</td>`;
    if (guide.health_insurance?.is_deleted === true) {
      insuranceCell.classList.add("linethrough");
    }

    isNaN(guide.price) || guide.price === null
      ? (row.insertCell().innerHTML = `<tdclass="Null">-</td>`)
      : (row.insertCell().innerHTML = guide.price.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }));
  });
};

const clickFirstPage = () => {
  currentPage = 1;
  clearData();
  createCells(dataGuides.data.guides, currentPage);
  console.log(currentPage, "currentPage");
};
let nextLink = document.getElementById("next");

const clickNextPage = () => {
  if (currentPage < totalPages) {
    currentPage++;
    clearData();
    createCells(dataGuides.data.guides, currentPage);
  }
  updatePageLinks();
};

const clickPreviousPage = () => {
  if (currentPage > 1) {
    currentPage--;
    clearData();
    createCells(dataGuides.data.guides, currentPage);
  }
  updatePageLinks();
};

const updatePageLinks = () => {
  const totalGuides = dataGuides.data.guides.length;
  totalPages = totalGuides / totalPerPage;

  const previousLink = document.getElementById("previous");
  if (currentPage === 1) {
    previousLink.disabled = true;
    previousLink.classList.add("blockedLink");
  } else {
    previousLink.disabled = false;
    previousLink.classList.remove("blockedLink");
  }

  const nextLink = document.getElementById("next");
  if (currentPage === totalPages) {
    nextLink.disabled = true;
    nextLink.classList.add("blockedLink");
  } else {
    nextLink.disabled = false;
    nextLink.classList.remove("blockedLink");
  }
};
const clickLastPage = () => {
  currentPage = totalPages;
  clearData();
  createCells(dataGuides.data.guides, currentPage);
};

const patientButton = document.querySelector(".patientButton");
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
  const select = document.querySelector(".select");
  const selectedInsuranceId = parseInt(select.value);

  if (selectedInsuranceId === 0) {
    clearData();
    createCells(dataGuides.data.guides);
    return;
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
  console.log(searchBar);
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
const dateSelect = () => {
  const inputInitialDate = document.querySelector(".inputInitialDate").value;
  const inputFinalDate = document.querySelector(".inputFinalDate").value;
  const dateInitial = inputInitialDate;
  const dateFinal = inputFinalDate;
  const filteredGuidesByDate = dataGuides.data.guides.filter((guide) => {
    return guide.start_date >= dateInitial && guide.start_date <= dateFinal;
  });
  console.log(filteredGuidesByDate);
  if (filteredGuidesByDate.length === 0) {
    clearData();
    table.innerHTML = `<td colspan="5" style="text-align: center;">Nenhuma guia encontrada</td>`;
    return;
  }
  clearData();
  createCells(filteredGuidesByDate, currentPage);
};

setMonthButton = () => {
  document.querySelector(".inputInitialDate").value =
    firstDay.toLocaleDateString("en-CA");
  document.querySelector(".inputFinalDate").value =
    finalDay.toLocaleDateString("en-CA");
};

setDayButton = () => {
  document.querySelector(".inputInitialDate").value =
    new Date().toLocaleDateString("en-CA");
  document.querySelector(".inputFinalDate").value =
    new Date().toLocaleDateString("en-CA");
};
