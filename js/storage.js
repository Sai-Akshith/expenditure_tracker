const KEY = "spending-data";

function loadEntries() {
  return JSON.parse(localStorage.getItem(KEY) || "[]");
}

function saveEntries(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}