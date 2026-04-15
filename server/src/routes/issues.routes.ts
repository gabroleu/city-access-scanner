import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../lib/cloudinary.js';
import { prisma } from '../lib/prisma.js';
import { error } from 'node:console';

const issuesRoutes = Router();

// Configura o multer para usar a memória temporariamente
const upload = multer({ storage: multer.memoryStorage() });

// Rota para cadastrar uma nova denúncia
issuesRoutes.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, description, latitude, longitude, severity } = req.body;
      console.log('Body recebido:', req.body);

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'A foto da irregularidade é obrigatória.' });
    }

    // 1. Enviar imagem para o Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'city_access_scanner' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

    const imageUrl = (result as any).secure_url;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);


    // validação básica
    if(isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Latidude ou longitude inválidas.' });
    }

    // validação geográfica (Brasil - hesmisfério oeste)
    if (lat > 5 || lat < -35 || lng > -30 || lng < -75){
      return res.status(400).json({ error: 'Coordenadas fora do Brasil' });
    }

    // 2. Salvar no Banco de Dados
    const issue = await prisma.issue.create({
      data: {
        type,
        description,
        imageUrl,
        latitude: lat,
        longitude: lng,
        severity: Number(severity)
      },
    });

    return res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao salvar a denúncia.' });
  }
});

// Rota para listar todas as denúncias (para o mapa)
issuesRoutes.get('/', async (req, res) => {
  const issues = await prisma.issue.findMany();
  return res.json(issues);
});

export { issuesRoutes };
