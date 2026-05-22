const form = document.querySelector("#bookingForm");
const statusMessage = document.querySelector("#formStatus");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const service = data.get("service");
  const vehicleType = data.get("vehicleType");
  const date = data.get("date");
  const time = data.get("time");

  statusMessage.textContent = `${service} for your ${vehicleType} is pencilled in for ${date} at ${time}.`;
  form.reset();
});
