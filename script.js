const searchForm = document.getElementById("searchForm");
const resultsSection = document.getElementById("results-section");
const flightsDiv = document.getElementById("flights");
const seatSection = document.getElementById("seat-section");
const seatMapDiv = document.getElementById("seatMap");
const summarySection = document.getElementById("summary-section");
const summaryDiv = document.getElementById("summary");
const confirmSeatBtn = document.getElementById("confirmSeatBtn");
const finishBookingBtn = document.getElementById("finishBookingBtn");

let selectedFlight = null;
let selectedSeat = null;
let passengersCount = 1;

// Dummy flight data
const flights = [
  { id: 1, from: "Delhi", to: "Mumbai", time: "10:00 AM", basePrice: 5000 },
  { id: 2, from: "Delhi", to: "Bangalore", time: "01:30 PM", basePrice: 6500 },
  { id: 3, from: "Delhi", to: "Kolkata", time: "06:00 PM", basePrice: 5500 },
];

// Class multipliers
function getMultiplier(cls) {
  if (cls === "economy") return 1;
  if (cls === "premium") return 1.2;
  if (cls === "business") return 1.5;
  if (cls === "first") return 2;
  return 1;
}

// Handle search
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  passengersCount = parseInt(document.getElementById("passengers").value);

  flightsDiv.innerHTML = "";
  resultsSection.classList.remove("hidden");

  flights.forEach(flight => {
    if (flight.from.toLowerCase() === from.toLowerCase() && flight.to.toLowerCase() === to.toLowerCase()) {
      const card = document.createElement("div");
      card.className = "flight-card";
      card.innerHTML = `
        <h3>${flight.from} → ${flight.to}</h3>
        <p>Departure: ${flight.time}</p>
        <p>Base Price: ₹${flight.basePrice}</p>
        <label>Class: 
          <select class="classSelect">
            <option value="economy">Economy</option>
            <option value="premium">Premium Economy</option>
            <option value="business">Business</option>
            <option value="first">First Class</option>
          </select>
        </label><br><br>
        <button onclick="selectFlight(${flight.id}, this)">Book This Flight</button>
      `;
      flightsDiv.appendChild(card);
    }
  });
});

// Select flight
function selectFlight(id, btn) {
  selectedFlight = flights.find(f => f.id === id);
  selectedFlight.classType = btn.parentElement.querySelector(".classSelect").value;

  resultsSection.classList.add("hidden");
  seatSection.classList.remove("hidden");
  generateSeatMap();
}

// Generate seat map
function generateSeatMap() {
  seatMapDiv.innerHTML = "";
  const layout = ["window","middle","aisle","aisle","middle","window"];
  for (let row=1; row<=6; row++) {
    const rowDiv = document.createElement("div");
    layout.forEach(type => {
      const seat = document.createElement("div");
      seat.className = "seat " + type;
      seat.textContent = row + type[0].toUpperCase();
      seat.addEventListener("click", () => selectSeat(seat, type));
      rowDiv.appendChild(seat);
    });
    seatMapDiv.appendChild(rowDiv);
  }
}

// Select seat
function selectSeat(seatElement, type) {
  document.querySelectorAll(".seat").forEach(s => s.classList.remove("selected"));
  seatElement.classList.add("selected");
  selectedSeat = seatElement.textContent + ` (${type})`;
}

// Confirm seat
confirmSeatBtn.addEventListener("click", () => {
  if (!selectedSeat) {
    alert("Please select a seat first!");
    return;
  }
  seatSection.classList.add("hidden");
  summarySection.classList.remove("hidden");

  const mult = getMultiplier(selectedFlight.classType);
  const total = selectedFlight.basePrice * mult * passengersCount;

  summaryDiv.innerHTML = `
    <p><b>Flight:</b> ${selectedFlight.from} → ${selectedFlight.to}</p>
    <p><b>Time:</b> ${selectedFlight.time}</p>
    <p><b>Class:</b> ${selectedFlight.classType}</p>
    <p><b>Seat:</b> ${selectedSeat}</p>
    <p><b>Passengers:</b> ${passengersCount}</p>
    <h3>Total Price: ₹${total}</h3>
  `;
});

// Finish booking
finishBookingBtn.addEventListener("click", () => {
  alert("🎉 Booking Confirmed! Thank you for choosing SkyBook ✈");
  window.location.reload();
});