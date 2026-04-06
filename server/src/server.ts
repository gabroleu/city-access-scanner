import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import { issuesRoutes } from './routes/issues.routes.js';

dotenv.config();

const app = express();

app.use(cors()); // Permite que o React acesse a API - ******** depois preciso verificar isso ******** 
app.use(express.json()); // Permite que a API entenda textos em formato JSON

// registra as rotas de denúnias
app.use('/issues', issuesRoutes);

const PORT = process.env.PORT || 3333;

app.get('/health', (req, res) => {
  return res.json({ message: "Servidor está rodando!" });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
