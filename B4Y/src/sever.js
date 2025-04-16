const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 27017;

app.use(cors());
app.use(express.json());


app.get('/api/mensagem', (req, res) => {
  res.json({ mensagem: 'Hello, React com Node!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
