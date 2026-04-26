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

const PORT = Number(process.env.PORT) || 3333;

app.get('/health', (req, res) => {
  return res.json({ message: "Servidor está rodando!" });
});


  app.listen(PORT, '0.0.0.0', () => { //o 0.0.0.0 aceita conexões de qualquer endereço IP
  console.log(`Server running on port ${PORT}`);
});


//só funciona localmente
//app.listen(PORT, '0.0.0.0', () => {
  //console.log(`Servidor rodando na rede em http://0.0.0.0:${PORT}`);
//});