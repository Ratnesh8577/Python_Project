
const API_BASE = "http://127.0.0.1:8000";

// Fetch all patients and display
async function fetchPatients() {
  const response = await fetch(`${API_BASE}/view`);
  const data = await response.json();
  const tableBody = document.querySelector("#patients-table tbody");
  tableBody.innerHTML = "";

  for (const [id, patient] of Object.entries(data)) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${id}</td>
      <td>${patient.name}</td>
      <td>${patient.city}</td>
      <td>${patient.age}</td>
      <td>${patient.gender}</td>
      <td>${patient.height}</td>
      <td>${patient.weight}</td>
      <td>${patient.bmi}</td>
      <td>${patient.verdict}</td>
      <td>
        <button onclick="viewPatient('${id}')">View</button>
        <button onclick="updatePatientPrompt('${id}')">Update</button>
        <button onclick="deletePatient('${id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }
}

// View single patient
async function viewPatient(id) {
  const res = await fetch(`${API_BASE}/patient/${id}`);
  const patient = await res.json();
  alert(JSON.stringify(patient, null, 2));
}

// // Update patient using prompt
// async function updatePatientPrompt(id) {
//   const name = prompt("Enter new name (leave blank to keep same):");
//   const city = prompt("Enter new city (leave blank to keep same):");

//   const body = {};
//   if (name) body.name = name;
//   if (city) body.city = city;

//   const res = await fetch(`${API_BASE}/edit/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   if (res.ok) {
//     alert("Patient updated!");
//     fetchPatients();
//   } else {
//     const err = await res.json();
//     alert("Error: " + err.detail);
//   }
// }
// Update patient using prompt for all fields
async function updatePatientPrompt(id) {
  const name = prompt("Enter new name (leave blank to keep same):");
  const city = prompt("Enter new city (leave blank to keep same):");
  const age = prompt("Enter new age (leave blank to keep same):");
  const gender = prompt("Enter new gender (male/female/others, leave blank to keep same):");
  const height = prompt("Enter new height in meters (leave blank to keep same):");
  const weight = prompt("Enter new weight in kg (leave blank to keep same):");

  const body = {};
  if (name) body.name = name;
  if (city) body.city = city;
  if (age) body.age = Number(age);
  if (gender) body.gender = gender;
  if (height) body.height = Number(height);
  if (weight) body.weight = Number(weight);

  const res = await fetch(`${API_BASE}/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    alert("Patient updated!");
    fetchPatients();
  } else {
    const err = await res.json();
    alert("Error: " + err.detail);
  }
}

// Delete patient
async function deletePatient(id) {
  if (!confirm("Are you sure you want to delete this patient?")) return;
  const res = await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });

  if (res.ok) {
    alert("Patient deleted!");
    fetchPatients();
  } else {
    const err = await res.json();
    alert("Error: " + err.detail);
  }
}

// Sort patients by field
async function sortPatients(field) {
  const res = await fetch(`${API_BASE}/sort?sort_by=${field}&order=asc`);
  const data = await res.json();
  const tableBody = document.querySelector("#patients-table tbody");
  tableBody.innerHTML = "";

  for (const patient of data) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${patient.id ?? "N/A"}</td>
      <td>${patient.name}</td>
      <td>${patient.city}</td>
      <td>${patient.age}</td>
      <td>${patient.gender}</td>
      <td>${patient.height}</td>
      <td>${patient.weight}</td>
      <td>${patient.bmi}</td>
      <td>${patient.verdict}</td>
      <td>
        <button onclick="viewPatient('${patient.id ?? ''}')">View</button>
        <button onclick="updatePatientPrompt('${patient.id ?? ''}')">Update</button>
        <button onclick="deletePatient('${patient.id ?? ''}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }
}

// Create patient form
document.getElementById("create-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  data.age = Number(data.age);
  data.height = Number(data.height);
  data.weight = Number(data.weight);

  const res = await fetch(`${API_BASE}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) {
    alert("Patient Created!");
    fetchPatients();
  } else {
    const err = await res.json();
    alert("Error: " + err.detail);
  }
});

// Initial load
fetchPatients();
