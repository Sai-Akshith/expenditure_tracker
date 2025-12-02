// js/history.js
console.log("history.js loaded");

const tbody = document.getElementById("history-body");
const emptyMsg = document.getElementById("empty-msg");

// --- EDIT MODAL ELEMENTS ---
const editModal = document.getElementById("edit-modal");
const modalInput = document.getElementById("modal-amount-input");
const saveBtn = document.getElementById("modal-save-btn");
const cancelBtn = document.getElementById("modal-cancel-btn");

// --- DELETE MODAL ELEMENTS ---
const deleteModal = document.getElementById("delete-modal");
const deleteConfirmBtn = document.getElementById("delete-confirm-btn");
const deleteCancelBtn = document.getElementById("delete-cancel-btn");

// STATE
let currentEditId = null;
let currentDeleteId = null;

// ===========================
//  MODAL FUNCTIONS
// ===========================

// --- EDIT ---
function openEditModal(id, currentAmount) {
  currentEditId = id;
  const cleanAmount = currentAmount.replace(/[^0-9.]/g, ''); 
  modalInput.value = cleanAmount;
  editModal.classList.remove("hidden");
  modalInput.focus();
}

function closeEditModal() {
  editModal.classList.add("hidden");
  currentEditId = null;
  modalInput.value = "";
}

// --- DELETE ---
function openDeleteModal(id) {
  currentDeleteId = id;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  deleteModal.classList.add("hidden");
  currentDeleteId = null;
}

// ===========================
//  EVENT LISTENERS (MODALS)
// ===========================

// Edit Logic
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
if(cancelBtn) cancelBtn.onclick = closeEditModal;

// Delete Logic
if(deleteConfirmBtn) {
  deleteConfirmBtn.onclick = async () => {
    if (!currentDeleteId) return;
    try {
      await deleteEntry(currentDeleteId);
      closeDeleteModal();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };
}
if(deleteCancelBtn) deleteCancelBtn.onclick = closeDeleteModal;

// Close any modal if clicking outside
window.onclick = (e) => {
  if (e.target === editModal) closeEditModal();
  if (e.target === deleteModal) closeDeleteModal();
};


// ===========================
//  MAIN TABLE LOGIC
// ===========================
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
    
    // DELETE (Triggers Animation + Modal)
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async () => {
        btn.classList.add("clicked"); // 1. Start Animation
        
        await new Promise(r => setTimeout(r, 400)); // 2. Wait for lid to open
        
        openDeleteModal(btn.dataset.id); // 3. Open Custom Modal
        
        btn.classList.remove("clicked"); // 4. Reset Animation
      };
    });

    // EDIT (Triggers Animation + Modal)
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = async () => {
        btn.classList.add("clicked");
        await new Promise(r => setTimeout(r, 400)); 
        btn.classList.remove("clicked"); 

        const row = btn.closest("tr");
        const amountText = row.querySelector('td[data-label="Amount"]').textContent;
        openEditModal(btn.dataset.id, amountText);
      };
    });
  });
});
