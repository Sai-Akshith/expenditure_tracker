// js/history.js
console.log("history.js loaded");

const tbody = document.getElementById("history-body");
const emptyMsg = document.getElementById("empty-msg");

// Ensure buttons exist in DOM (for auth.js to find)
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

// Wait for login state
firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    if(tbody) tbody.innerHTML = "";
    if(emptyMsg) emptyMsg.textContent = "Please log in to view your history.";
    return;
  }

  // Subscribe to entries
  subscribeToEntries((entries) => {
    const userEntries = entries.filter((e) => e.uid === user.uid);

    if (userEntries.length === 0) {
      if(tbody) tbody.innerHTML = "";
      if(emptyMsg) emptyMsg.textContent = "No entries found.";
      return;
    }

    if(emptyMsg) emptyMsg.textContent = "";
    if(tbody) tbody.innerHTML = "";

    userEntries.forEach((entry) => {
      const tr = document.createElement("tr");
      
      // Determine badge class
      const typeClass = entry.type === "Income" ? "income" : "expense";

      // Create row with data-labels for Mobile view
      tr.innerHTML = `
        <td data-label="Date">${entry.date}</td>
        <td data-label="Type"><span class="badge ${typeClass}">${entry.type}</span></td>
        <td data-label="Category">${entry.category}</td>
        <td data-label="Amount">₹${entry.amount.toFixed(2)}</td>
        <td data-label="Method">${entry.method || "-"}</td>
        <td data-label="Description">${entry.description || "-"}</td>
        <td class="actions-cell">
          <button class="btn-icon edit-btn" data-id="${entry.id}" title="Edit">✎</button>
          <button class="btn-icon delete-btn" data-id="${entry.id}" title="Delete">🗑</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Attach Event Listeners
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async () => {
        if (confirm("Delete this entry?")) {
          await deleteEntry(btn.dataset.id);
        }
      };
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = async () => {
        const newAmount = prompt("Enter new amount:");
        if (newAmount && !isNaN(parseFloat(newAmount))) {
          await updateEntry(btn.dataset.id, { amount: parseFloat(newAmount) });
        }
      };
    });
  });
});
