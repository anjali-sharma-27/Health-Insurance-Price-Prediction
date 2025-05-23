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

const modal = document.getElementById("authModal");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

function openAuthModal() {
  modal.style.display = "block";
  showLogin(); // default view
}

function closeAuthModal() {
  modal.style.display = "none";
}

function showLogin() {
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
  loginBtn.classList.add("active");
  signupBtn.classList.remove("active");
}

function showSignup() {
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
  signupBtn.classList.add("active");
  loginBtn.classList.remove("active");
}

// Form submission handlers
// loginForm.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const username = document.getElementById("loginUsername").value;
//   const password = document.getElementById("loginPassword").value;
//   alert(`Logging in as ${username}`);
//   loginForm.reset();
//   closeAuthModal();
// });

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // needed to include cookies like jwtToken
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    console.log(data,"data")

    if (!response.ok) {
      alert(data.error || "Login failed");
    } else {
      alert(`Welcome, ${data.user.username}`);
      loginForm.reset();
      closeAuthModal();
      window.location.href = "/Frontend/index.html";
    }
  } catch (err) {
    console.error("Login request error:", err.message);
    alert("Something went wrong");
  }
});


// signupForm.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const username = document.getElementById("signupUsername").value;
//   const email = document.getElementById("signupEmail").value;
//   const password = document.getElementById("signupPassword").value;
//   alert(`Signing up as ${username} with email ${email}`);
//   signupForm.reset();
//   closeAuthModal();
// });

signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // to receive jwt cookie
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Signup failed");
    } else {
      alert(`Welcome, ${data.user.username}`);
      signupForm.reset();
      closeAuthModal();
    }
  } catch (err) {
    console.error("Signup request error:", err.message);
    alert("Something went wrong");
  }
});

document.getElementById("logoutBtn").addEventListener("click", async function () {
  try {
    const response = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Logged out successfully");
    } else {
      alert(data.error || "Logout failed");
    }
  } catch (err) {
    console.error("Logout error:", err.message);
    alert("Something went wrong during logout.");
  }
});

// Close modal when clicking outside content
window.addEventListener("click", function (e) {
  if (e.target == modal) closeAuthModal();
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
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const bmi = bmiOutput.value;

    // Check required fields
    if (!gender || !region || !children || !bmi || !smoker || !age) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare data for backend
    const formData = {
      age: age,
      gender: gender,
      height: height,
      weight: weight,
      bmi: bmi,
      children: children,
      smoker: smoker,
      region: region,
    };

    try {
      const response = await fetch("http://127.0.0.1:5001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data); // Debug

      if (data.predicted_price) {
        const positivePrice = Math.abs(data.predicted_price);

        document.querySelector(".result-section").style.display = "block";
        document.getElementById("predictedPrice").innerText =
          "$" + positivePrice.toFixed(2);
      } else {
        alert("Prediction failed, please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
