import type { Application, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadPath = path.join(__dirname, 'uploads');

export const createApp = (): Application => {
  const app: Application = express();

  const allowlist = [
    'http://localhost:3000',
    'http://localhost:5432',
    'http://localhost:3001',
  ];
  const corsOptions = {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, permission?: boolean) => void,
    ) => {
      if (!origin || allowlist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  };

  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use('/uploads', express.static(uploadPath));

  app.get('/', (_req: Request, res: Response) => {
    res.send('Hi there');
  });

  return app;
};

const app = createApp();

app.listen(3001, () => {
  console.log('Server is running on port 3001...');
});
