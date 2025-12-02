const body = document.getElementById("history-body");
const entries = loadEntries();

entries.forEach(e => {
  const row = `
    <tr>
      <td>${e.date}</td>
      <td>${e.type}</td>
      <td>${e.category}</td>
      <td>${e.amount}</td>
      <td>${e.description}</td>
    </tr>`;
  body.innerHTML += row;
});