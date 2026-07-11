const express = require('express');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Pozdrav iz aplikacije Kulturna baština!');
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});