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
    console.log("User not logged in → cannot load history");

    tbody.innerHTML = "";
    emptyMsg.textContent = "Please log in to view your history.";

    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    userInfo.textContent = "";
    return;
  }

  // UI for logged-in user
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
  userInfo.textContent = "Logged in as: " + user.email;

  console.log("User logged in → loading entries");

  // Subscribe to only this user’s entries
  subscribeToEntries((entries) => {
    const userEntries = entries.filter((e) => e.uid === user.uid);

    if (userEntries.length === 0) {
      tbody.innerHTML = "";
      emptyMsg.textContent = "No entries found.";
      return;
    }

    emptyMsg.textContent = "";
    tbody.innerHTML = "";

    // Render each entry
    userEntries.forEach((entry) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${entry.date}</td>
        <td>${entry.type}</td>
        <td>${entry.category}</td>
        <td>₹${entry.amount.toFixed(2)}</td>
        <td>${entry.method || "-"}</td>
        <td>${entry.description || "-"}</td>
        <td>
          <button class="edit-btn" data-id="${entry.id}">Edit</button>
          <button class="delete-btn" data-id="${entry.id}">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // DELETE functionality
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async () => {
        if (confirm("Are you sure you want to delete this entry?")) {
          const id = btn.dataset.id;
          try {
            await deleteEntry(id);
            console.log("Deleted:", id);
          } catch (err) {
            console.error("❌ Delete error:", err);
            alert("Failed to delete. Check console.");
          }
        }
      };
    });

    // EDIT functionality (simple version)
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = async () => {
        const id = btn.dataset.id;
        const newAmount = prompt("Enter new amount:");

        if (newAmount && !isNaN(parseFloat(newAmount))) {
          try {
            await updateEntry(id, { amount: parseFloat(newAmount) });
            console.log("Updated:", id);
          } catch (err) {
            console.error("❌ Update error:", err);
            alert("Failed to update. Check console.");
          }
        }
      };
    });
  });
});
