// ===================== BMI AUTO-CALCULATION =====================
document.getElementById('height').addEventListener('input', updateBMI);
document.getElementById('weight').addEventListener('input', updateBMI);

function updateBMI() {
  const height = parseFloat(document.getElementById('height').value) / 100;
  const weight = parseFloat(document.getElementById('weight').value);
  if (height > 0 && weight > 0) {
    const bmi = weight / (height * height);
    document.getElementById('bmi').value = bmi.toFixed(2);
  }
}

// ===================== FORM PREDICTION =====================
document.getElementById('predictionForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const age = parseInt(document.getElementById('age')?.value || 0);
  const gender = document.getElementById('gender').value;
  const height = parseFloat(document.getElementById('height').value) / 100;
  const weight = parseFloat(document.getElementById('weight').value);
  const smoker = document.getElementById('smoker')?.value || "no";
  const children = parseInt(document.getElementById('children').value);
  const region = document.getElementById('region').value;
  const bmiField = document.getElementById('bmi');

  // Validation for height & weight
  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    alert("Please enter valid height and weight.");
    return;
  }

  // Calculate BMI again to be safe
  const bmi = weight / (height * height);
  if (bmiField) bmiField.value = bmi.toFixed(2);

  // Simple prediction logic
  let price = (age * 10) + (bmi * 5) + (smoker === 'yes' ? 200 : 0);
  if (gender === 'female') price -= 50;

  // Display predicted price
  document.getElementById('predictedPrice').textContent = `$${price.toFixed(2)}`;
  document.querySelector('.result-section').style.display = 'block';

  // Chart display
  const ctx = document.getElementById('priceChart').getContext('2d');
  if (window.priceChartInstance) {
    window.priceChartInstance.destroy();
  }
  window.priceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Your Price', 'Market Average'],
      datasets: [{
        label: 'Insurance Price ($)',
        data: [price, 500],
        backgroundColor: ['#4B9B6E', '#A8DFBA']
      }]
    }
  });
});

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===================== ROTATING HERO QUOTES =====================
const quotes = [
  { text: "Health is wealth.", author: "Unknown" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "Your health is an investment, not an expense.", author: "Unknown" },
  { text: "Prevention is better than cure.", author: "Desiderius Erasmus" },
  { text: "Good health is true wealth.", author: "Urijah Faber" }
];

let index = 0;
function showNextQuote() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");

  if (quoteText && quoteAuthor) {
    quoteText.textContent = `“${quotes[index].text}”`;
    quoteAuthor.textContent = `– ${quotes[index].author}`;
    index = (index + 1) % quotes.length;
  }
}
setInterval(showNextQuote, 3000);
