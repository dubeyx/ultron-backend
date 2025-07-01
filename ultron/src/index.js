const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Ultron backend works fine 💥');
});

app.listen(PORT, () => {
  console.log(`Ultron server running on http://localhost:${PORT}`);
});
