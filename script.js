// 1. Initialize an empty list of entries
let entries = [];

//2. Load saved entries on page load
window.onload = function () {
  let saved = localStorage.getItem("entries");
  if (saved) {
    entries = JSON.parse(saved);
    entries.forEach(entry => displayEntry(entry));
  }

// Call this AFTER the chart is created
  updateChart();

};

//3. Add a new entry when button is clicked
function addEntry() {
  const goalInput = document.getElementById("goalInput");
  const moodSelect = document.getElementById("moodSelect");
  const goal = goalInput.value.trim();
  const mood = moodSelect.value;

  if (goal === "" || mood === "") {
    alert("Please enter a goal and select a mood.");
    return;
  }

  const date = new Date().toLocaleDateString();
  const entry = { goal, mood, date };

  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  displayEntry(entry);

  goalInput.value = "";
  moodSelect.value = "";

  updateChart(); // ✅ Update chart right after logging entry

  document.getElementById("moodFilter").value = "all";
  filterEntries();

}

// 4. Display on entry in the log list
function displayEntry(entry) {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${entry.date}</strong>: ${entry.goal} <span style="float:right;">${entry.mood}</span>`;

  // Color-code based on mood
  switch (entry.mood) {
    case "😊":
      li.style.backgroundColor = "#fff9c4"; // light yellow
      break;
    case "😐":
      li.style.backgroundColor = "#eeeeee"; // light gray
      break;
    case "😔":
      li.style.backgroundColor = "#bbdefb"; // light blue
      break;
    case "😡":
      li.style.backgroundColor = "#ffcdd2"; // light red
      break;
    case "😴":
      li.style.backgroundColor = "#e1bee7"; // light purple
      break;
    default:
      li.style.backgroundColor = "#e0e0e0";
  }

  document.getElementById("logList").appendChild(li);
}

// 6. Update the mood chart
function updateChart() {
  const moodCounts = {
    "😊": 0,
    "😐": 0,
    "😔": 0,
    "😡": 0,
    "😴": 0
  };

  // Count how many of each mood
  entries.forEach(entry => {
    if (moodCounts.hasOwnProperty(entry.mood)) {
      moodCounts[entry.mood]++;
    }
  });

  // Update the chart data
  moodChart.data.datasets[0].data = Object.values(moodCounts);
  moodChart.update();

}


// 5. Clear entries from the log list
function clearEntries() {
  const confirmClear = confirm("Are you sure you want to delete all entries?");
  if (!confirmClear) return;

  entries = [];
  localStorage.removeItem("entries");

  // Clear the visual list
  document.getElementById("logList").innerHTML = "";

  updateChart();

  document.getElementById("moodFilter").value = "all";
  filterEntries();

}


// Initialize mood chart
const moodChart = new Chart(document.getElementById("moodChart"), {
  type: "bar",
  data: {
    labels: ["😊", "😐", "😔", "😡", "😴"],
    datasets: [{
      label: "Mood Frequency",
      data: [0, 0, 0, 0, 0], //inital data
      backgroundColor: [
        "#fff59d", // happy
        "#eeeeee", // neutral
        "#90caf9", // sad
        "#ef9a9a", // angry
        "#ce93d8", // tired 
      ],
      borderWidth: 1
     }]
   },
   options: {
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           stepSize: 1
         }
       }
     }
   }
});

// ✅ NOW it's safe to call this after the chart exists
updateChart();

// Filter entries
function filterEntries() {
  const filter = document.getElementById("moodFilter").value;
  const logList = document.getElementById("logList");

  logList.innerHTML = "";

  const filtered = (filter === "all")
    ? entries
    : entries.filter(entry => entry.mood === filter);
 
  filtered.forEach(entry => displayEntry(entry));
}
	