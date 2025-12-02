// js/history.js

const bodyEl = document.getElementById("history-body");
const emptyMsg = document.getElementById("empty-msg");

// modal elements
const modal = document.getElementById("edit-modal");
const editForm = document.getElementById("edit-form");
const editDate = document.getElementById("edit-date");
const editType = document.getElementById("edit-type");
const editCategory = document.getElementById("edit-category");
const editAmount = document.getElementById("edit-amount");
const editMethod = document.getElementById("edit-method");
const editDescription = document.getElementById("edit-description");
const editCancel = document.getElementById("edit-cancel");

let currentEntries = [];
let editingId = null;

// Render entries on screen
function render(entries) {
  currentEntries = entries;
  bodyEl.innerHTML = "";

  if (!entries.length) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  entries.forEach((e) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${e.date}</td>
      <td>${e.type}</td>
      <td>${e.category}</td>
      <td>${format(e.amount)}</td>
      <td>${e.method || "-"}</td>
      <td>${e.description || "-"}</td>
      <td>
        <button class="edit-btn" data-id="${e.id}">Edit</button>
        <button class="delete-btn" data-id="${e.id}">Delete</button>
      </td>
    `;

    bodyEl.appendChild(tr);
  });
}

// Subscribe to Firestore (realtime sync)
subscribeToEntries((entries) => {
  entries.sort((a, b) => {
    if (a.date === b.date) return (b.createdAt || 0) - (a.createdAt || 0);
    return b.date.localeCompare(a.date);
  });
  render(entries);
});

// Click actions for edit/delete
bodyEl.addEventListener("click", async (e) => {
  const id = e.target.getAttribute("data-id");
  if (!id) return;

  if (e.target.classList.contains("delete-btn")) {
    const ok = confirm("Delete this entry?");
    if (ok) await deleteEntry(id);
    return;
  }

  if (e.target.classList.contains("edit-btn")) {
    openEditModal(id);
  }
});

// Open modal with data
function openEditModal(id) {
  const item = currentEntries.find(e => e.id === id);
  if (!item) return;

  editingId = id;

  editDate.value = item.date;
  editType.value = item.type;
  editCategory.value = item.category;
  editAmount.value = item.amount;
  editMethod.value = item.method || "";
  editDescription.value = item.description || "";

  modal.classList.remove("hidden");
}

// Close modal
function closeEditModal() {
  modal.classList.add("hidden");
  editingId = null;
}

editCancel.addEventListener("click", closeEditModal);

// Close when clicking backdrop
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.classList.contains("modal-backdrop")) {
    closeEditModal();
  }
});

// Save edited entry
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!editingId) return;

  const updated = {
    date: editDate.value,
    type: editType.value,
    category: editCategory.value,
    amount: parseFloat(editAmount.value),
    method: editMethod.value.trim(),
    description: editDescription.value.trim()
  };

  if (!updated.date || isNaN(updated.amount) || updated.amount <= 0) {
    alert("Please enter valid date/amount.");
    return;
  }

  await updateEntry(editingId, updated);
  closeEditModal();
});
