const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

// Route to handle prediction requests
app.post("/predict", (req, res) => {
  // Here, you'll handle the request to make predictions
  // This can be done by calling your machine learning model (in Python)
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
