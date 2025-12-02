// js/history.js
console.log("history.js loaded");

const tbody = document.getElementById("history-body");
const emptyMsg = document.getElementById("empty-msg");

// Ensure buttons exist
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
      const typeClass = entry.type === "Income" ? "income" : "expense";

      // 1. PENCIL: Standard SVG
      // 2. TRASH: Split into "Lid" and "Can" paths for animation
      tr.innerHTML = `
        <td data-label="Date">${entry.date}</td>
        <td data-label="Type"><span class="badge ${typeClass}">${entry.type}</span></td>
        <td data-label="Category">${entry.category}</td>
        <td data-label="Amount">₹${entry.amount.toFixed(2)}</td>
        <td data-label="Method">${entry.method || "-"}</td>
        <td data-label="Description">${entry.description || "-"}</td>
        <td class="actions-cell">
          
          <button class="btn-icon edit-btn" data-id="${entry.id}" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <button class="btn-icon delete-btn" data-id="${entry.id}" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path class="trash-lid" stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
          </button>
        </td>
      `;
      
      // REPLACING SVG WITH CLEANER SPLIT VERSION VIA JS TO ENSURE IT WORKS
      // We manually inject the split SVG for the delete button to ensure the lid moves separately.
      const deleteBtn = tr.querySelector('.delete-btn');
      deleteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path class="trash-lid" stroke-linecap="round" stroke-linejoin="round" d="M10 4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3h6V4z M4 7h16" />
          <path class="trash-can" stroke-linecap="round" stroke-linejoin="round" d="M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12 M10 11v6 M14 11v6" />
        </svg>
      `;

      tbody.appendChild(tr);
    });

    // --- LOGIC WITH DELAY FOR ANIMATION ---
    
    // DELETE
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async () => {
        // 1. Add class to trigger CSS animation
        btn.classList.add("clicked");

        // 2. Wait 400ms so user sees the lid open
        await new Promise(r => setTimeout(r, 400));

        // 3. Show popup
        if (confirm("Delete this entry?")) {
          await deleteEntry(btn.dataset.id);
        }

        // 4. Reset animation class
        btn.classList.remove("clicked");
      };
    });

    // EDIT
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = async () => {
        btn.classList.add("clicked");
        
        await new Promise(r => setTimeout(r, 400));

        const newAmount = prompt("Enter new amount:");
        if (newAmount && !isNaN(parseFloat(newAmount))) {
          await updateEntry(btn.dataset.id, { amount: parseFloat(newAmount) });
        }
        
        btn.classList.remove("clicked");
      };
    });
  });
});
