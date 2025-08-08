const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/books');
const loanRoutes = require('./routes/loans');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/books', bookRoutes);
app.use('/loans', loanRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
