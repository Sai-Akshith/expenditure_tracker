// js/history.js
console.log("history.js loaded");

const tbody = document.getElementById("history-body");
const emptyMsg = document.getElementById("empty-msg");

// --- MODAL ELEMENTS ---
const modal = document.getElementById("edit-modal");
const modalInput = document.getElementById("modal-amount-input");
const saveBtn = document.getElementById("modal-save-btn");
const cancelBtn = document.getElementById("modal-cancel-btn");
let currentEditId = null; // Stores which ID we are currently editing

// --- MODAL FUNCTIONS ---
function openEditModal(id, currentAmount) {
  currentEditId = id;
  // Strip the '₹' symbol if present to just get the number
  const cleanAmount = currentAmount.replace(/[^0-9.]/g, ''); 
  modalInput.value = cleanAmount;
  
  modal.classList.remove("hidden");
  modalInput.focus();
}

function closeEditModal() {
  modal.classList.add("hidden");
  currentEditId = null;
  modalInput.value = "";
}

// Attach Modal Event Listeners
if(saveBtn) {
  saveBtn.onclick = async () => {
    if (!currentEditId) return;
    
    const newVal = parseFloat(modalInput.value);
    if (isNaN(newVal) || newVal < 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      await updateEntry(currentEditId, { amount: newVal });
      closeEditModal();
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };
}

if(cancelBtn) {
  cancelBtn.onclick = closeEditModal;
}

// Close modal if clicking outside the box
window.onclick = (e) => {
  if (e.target === modal) closeEditModal();
};


// --- MAIN LOGIC ---
firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) {
    if(tbody) tbody.innerHTML = "";
    if(emptyMsg) emptyMsg.textContent = "Please log in to view your history.";
    return;
  }

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
              <path class="trash-lid" stroke-linecap="round" stroke-linejoin="round" d="M10 4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3h6V4z M4 7h16" />
              <path class="trash-can" stroke-linecap="round" stroke-linejoin="round" d="M5 7l1 12a2 2 0 002 2h8a2 2 0 002-2l1-12 M10 11v6 M14 11v6" />
            </svg>
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // --- BUTTON LISTENERS ---
    
    // DELETE
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async () => {
        btn.classList.add("clicked"); // Animation
        await new Promise(r => setTimeout(r, 400)); // Wait for animation
        
        if (confirm("Delete this entry?")) {
          await deleteEntry(btn.dataset.id);
        }
        btn.classList.remove("clicked");
      };
    });

    // EDIT (Now opens our Custom Modal)
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = async () => {
        btn.classList.add("clicked"); // Animation
        await new Promise(r => setTimeout(r, 400)); // Wait for wiggle
        btn.classList.remove("clicked"); 

        // Get current amount from the table row to pre-fill the input
        const row = btn.closest("tr");
        const amountText = row.querySelector('td[data-label="Amount"]').textContent;
        
        openEditModal(btn.dataset.id, amountText);
      };
    });
  });
});
