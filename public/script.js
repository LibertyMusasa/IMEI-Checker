// Dummy IMEI dataset
const imeiDB = ["123456789012345", "987654321098765", "112233445566778"];

// Utility function: Validate IMEI is exactly 15 digits
function isValidIMEI(imei) {
  return /^\d{15}$/.test(imei);
}

// ===== CHECK IMEI =====
document.getElementById("check-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("check-imei").value.trim();
  const result = document.getElementById("check-result");

  if (!isValidIMEI(input)) {
    result.textContent = "IMEI must be exactly 15 digits.";
    return;
  }

  if (imeiDB.includes(input)) {
    result.innerHTML = `<span class="alert">This device has been reported stolen.</span>`;
  } else {
    result.textContent = "This IMEI is not listed as stolen.";
  }
});

// ===== REPORT STOLEN IMEI =====
document.getElementById("report-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("report-imei").value.trim();
  const result = document.getElementById("report-result");

  if (!isValidIMEI(input)) {
    result.textContent = "IMEI must be exactly 15 digits.";
    return;
  }

  if (!imeiDB.includes(input)) {
    imeiDB.push(input);
    result.textContent = "IMEI has been reported as stolen.";
  } else {
    result.innerHTML = `<span class="alert">This IMEI is already reported.</span>`;
  }
});

// ===== REQUEST REMOVAL WITH POLICE REPORT =====
document.getElementById("remove-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const imei = document.getElementById("remove-imei").value.trim();
  const file = document.getElementById("police-report").files[0];
  const result = document.getElementById("remove-result");

  if (!isValidIMEI(imei)) {
    result.textContent = "IMEI must be exactly 15 digits.";
    return;
  }

  if (!file) {
    result.textContent = "Please upload a police report file (PDF, PNG, JPG).";
    return;
  }

  // Dummy simulation for now
  // In real case, send to backend using fetch/formData
  result.textContent = "Your request has been submitted for review.";
});

