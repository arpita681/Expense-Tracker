let transactions = JSON.parse(localStorage.getItem("data")) || [];
let chart;

// UPDATE UI
function updateUI(data = transactions){
  let list = document.getElementById("list");
  list.innerHTML = "";

  let balance = 0;
  let income = 0;
  let expense = 0;

  data.forEach((t, index)=>{
    let li = document.createElement("li");

    li.innerHTML = `
      ${t.desc} - ₹${t.amount}
      <button onclick="deleteItem(${index})">❌</button>
    `;

    list.appendChild(li);

    if(t.type === "income"){
      balance += t.amount;
      income += t.amount;
    } else {
      balance -= t.amount;
      expense += t.amount;
    }
  });

  document.getElementById("balance").innerText = balance;
  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;

  localStorage.setItem("data", JSON.stringify(transactions));

  updateChart(income, expense);
}

// ADD
function addTransaction(){
  let desc = document.getElementById("desc").value;
  let amount = document.getElementById("amount").value;
  let type = document.getElementById("type").value;
  let category = document.getElementById("category").value;
  let date = document.getElementById("date").value;

  if(desc === "" || amount === "" || date === ""){
    alert("Fill all fields!");
    return;
  }

  transactions.push({
    desc,
    amount: Number(amount),
    type,
    category,
    date
  });

  updateUI();
}

// DELETE
function deleteItem(index){
  transactions.splice(index,1);
  updateUI();
}

// SEARCH
document.getElementById("search").addEventListener("input", function(){
  let val = this.value.toLowerCase();
  let filtered = transactions.filter(t => t.desc.toLowerCase().includes(val));
  updateUI(filtered);
});

// MONTH FILTER
document.getElementById("monthFilter").addEventListener("change", function(){
  let selectedMonth = this.value;

  if(selectedMonth === "all"){
    updateUI();
    return;
  }

  let filtered = transactions.filter(t=>{
    let month = new Date(t.date).getMonth();
    return month == selectedMonth;
  });

  updateUI(filtered);
});

// CHART
function updateChart(income, expense){
  let ctx = document.getElementById("chart");

  if(chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense]
      }]
    }
  });
}

// DOWNLOAD CSV
function downloadCSV(){
  let csv = "Description,Amount,Type,Category,Date\n";

  transactions.forEach(t=>{
    csv += `${t.desc},${t.amount},${t.type},${t.category},${t.date}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "report.csv";
  a.click();
}

// INIT
updateUI();