// js/history.js
const bodyEl = document.getElementById("history-body");
const emptyMsg = document.getElementById("empty-msg");

const entries = loadEntries();

// sort by date (newest first)
entries.sort((a, b) => {
  if (a.date === b.date) return b.createdAt - a.createdAt;
  return b.date.localeCompare(a.date); // latest date first
});

if (!entries.length) {
  emptyMsg.style.display = "block";
} else {
  emptyMsg.style.display = "none";
}

for (const e of entries) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${e.date}</td>
    <td>${e.type}</td>
    <td>${e.category}</td>
    <td>${format(e.amount)}</td>
    <td>${e.method || "-"}</td>
    <td>${e.description || "-"}</td>
  `;

  bodyEl.appendChild(tr);
}
