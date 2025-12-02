// js/shared.js
function format(amount) {
  if (isNaN(amount)) return "₹0";
  return "₹" + amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
