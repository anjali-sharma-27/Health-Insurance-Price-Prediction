// // ===================== SMOOTH SCROLL =====================
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// // ===================== ROTATING HERO QUOTES =====================
const quotes = [
  { text: "Health is wealth.", author: "Unknown" },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  { text: "Your health is an investment, not an expense.", author: "Unknown" },
  { text: "Prevention is better than cure.", author: "Desiderius Erasmus" },
  { text: "Good health is true wealth.", author: "Urijah Faber" },
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



//Hamburge logic 
const hamburger = document.getElementById("hamburger-icon");
const navLinks = document.querySelector(".nav-links");

// Toggle the nav-links visibility on hamburger click
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("predictionForm");

  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");
  const bmiOutput = document.getElementById("bmi");

  const generateBMI = () => {
    const heightFeet = parseFloat(heightInput.value);
    const weightKg = parseFloat(weightInput.value);

    if (isNaN(heightFeet) || isNaN(weightKg) || heightFeet <= 0 || weightKg <= 0) {
      bmiOutput.value = "";
      return;
    }
  
    const heightInMetre = heightFeet * 0.3048;
    let bmi = weightKg / (heightInMetre * heightInMetre);
    console.log(bmi, heightFeet,weightKg,"bmi")
    bmiOutput.value = bmi.toFixed(2);
  };

  heightInput.addEventListener("input", generateBMI);
  weightInput.addEventListener("input", generateBMI);

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form default submission

    // Get form data
    const gender = document.getElementById("gender").value;
    const region = document.getElementById("region").value;
    const children = document.getElementById("children").value;
    const smoker = document.getElementById("smoker").value;
    const age = document.getElementById("age").value;
    const bmi =  bmiOutput.value

    // Check required fields
    if (!gender || !region || !children || !bmi || !smoker || !age) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare data for backend
    const formData = {
      age: age,
      gender: gender,
      bmi: bmi,
      children: children,
      smoker: smoker,
      region: region,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data); // Debug

      if (data.predicted_price) {
        document.querySelector(".result-section").style.display = "block";
        document.getElementById("predictedPrice").innerText =
          "$" + data.predicted_price.toFixed(2);
      } else {
        alert("Prediction failed, please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
