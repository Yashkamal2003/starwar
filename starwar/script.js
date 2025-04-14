let currentPage = 1;
let isSearchMode = false;
let searchQuery = "";

const characterList = document.getElementById("character-list");
const prevBtn = document.getElementById("prev");
const addMoreBtn = document.getElementById("add-more");
const pageNumber = document.getElementById("page-number");

function fetchCharacters(page, append = false) {
  const url = isSearchMode
    ? `https://swapi.py4e.com/api/people/?search=${searchQuery}&page=${page}`
    : `https://swapi.py4e.com/api/people/?page=${page}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      displayCharacters(data.results, append);
      updatePagination(data);
    })
    .catch((err) => console.error("Fetch Error:", err));
}

function displayCharacters(characters, append = false) {
  if (!append) characterList.innerHTML = "";
  characters.forEach((char) => {
    const div = document.createElement("div");
    div.textContent = char.name;
    characterList.appendChild(div);
  });
}

function updatePagination(data) {
  pageNumber.textContent = isSearchMode
    ? `Search Page ${currentPage}`
    : `Page ${currentPage}`;
  prevBtn.disabled = currentPage <= 1;
  addMoreBtn.disabled = !data.next;
}

function handleSearch() {
  const input = document.getElementById("search-input");
  const query = input.value.trim();
  if (query) {
    isSearchMode = true;
    searchQuery = query;
    currentPage = 1;
    fetchCharacters(currentPage, false);
  }
}

function clearSearch() {
  document.getElementById("search-input").value = "";
  isSearchMode = false;
  searchQuery = "";
  currentPage = 1;
  fetchCharacters(currentPage, false);
}

function attachEvents() {
  document.getElementById("search-btn").addEventListener("click", handleSearch);
  document.getElementById("clear-btn").addEventListener("click", clearSearch);

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchCharacters(currentPage, false);
    }
  });

  addMoreBtn.addEventListener("click", () => {
    currentPage++;
    fetchCharacters(currentPage, true);
  });
}

function init() {
  fetchCharacters(currentPage);
  attachEvents();
}

init();
