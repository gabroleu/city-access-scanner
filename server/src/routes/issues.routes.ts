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
    const { type, description, latitude, longitude, severity, deviceId } = req.body;
      console.log('REQ BODY:', req.body);
      console.log('DEVICE ID:', req.body.deviceId);

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
        severity: Number(severity),
        deviceId,
      },
    });

    return res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro interno ao salvar a denúncia.' });
  }
});

// Rota para listar todas as denúncias (para o mapa)
//issuesRoutes.get('/', async (req, res) => {
  //const issues = await prisma.issue.findMany();
  //return res.json(issues);
//});

issuesRoutes.get('/', async (req, res) => {
  try {
    console.log('Buscando issues no banco...');

    const issues =
      await prisma.issue.findMany();

    const deviceId =
      req.query.deviceId;

    const formattedIssues =
      issues.map(issue => ({
        ...issue,

        isOwner:
          issue.deviceId ===
          deviceId,
      }));

    console.log(
      'Issues encontradas:',
      issues.length
    );

    return res.json(
      formattedIssues
    );

  } catch (error) {
    console.error('ERRO AO BUSCAR ISSUES:', error);

    return res.status(500).json({
      error: 'Erro interno ao buscar issues',
      details: String(error)
    });
  }
});

    // excluir denúncia
issuesRoutes.delete(
  '/:id',
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        deviceId
      } = req.body;

      const issue =
        await prisma.issue.findUnique({
          where: { id },
        });

      if (!issue) {
        return res
          .status(404)
          .json({
            error:
              'Denúncia não encontrada',
          });
      }

      if (
        issue.deviceId !==
        deviceId
      ) {
        return res
          .status(403)
          .json({
            error:
              'Você não pode excluir essa denúncia',
          });
      }

      await prisma.issue.delete({
        where: { id },
      });

      return res.json({
        success: true,
      });

    } catch (error) {
      console.error(
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Erro ao excluir denúncia',
        });
    }
  }
);


    // editar denúncia
issuesRoutes.patch(
  '/:id',
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const {
        type,
        severity,
        description,
        status,
        deviceId,
      } = req.body;

      const issue =
        await prisma.issue.findUnique({
          where: { id },
        });

      if (!issue) {
        return res
          .status(404)
          .json({
            error:
              'Denúncia não encontrada',
          });
      }

      if (
        issue.deviceId !==
        deviceId
      ) {
        return res
          .status(403)
          .json({
            error:
              'Você não pode editar essa denúncia',
          });
      }

      const updatedIssue =
        await prisma.issue.update({
          where: { id },

          data: {
            type,
            severity:
              Number(severity),

            description,
            status,
          },
        });

      return res.json(
        updatedIssue
      );

    } catch (error) {
      console.error(
        error
      );

      return res
        .status(500)
        .json({
          error:
            'Erro ao editar denúncia',
        });
    }
  }
);

issuesRoutes.patch(
  '/:id/status',
  async (req, res) => {
    try {


console.log('==========================');
console.log('PATCH STATUS CHAMADO');
console.log('ID:', req.params.id);
console.log('BODY:', req.body);
console.log('==========================');

      const { id } = req.params;

      const { status } = req.body;

      const issue =
        await prisma.issue.findUnique({
          where: { id },
        });


      if (!issue) {
        return res.status(404).json({
          error: 'Denúncia não encontrada',
        });
      }

      const updatedIssue =
        await prisma.issue.update({
          where: { id },

          data: {
            status,
          },
        });

      return res.json(updatedIssue);

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error: 'Erro ao atualizar status',
      });
    }
  }
);

export { issuesRoutes };
