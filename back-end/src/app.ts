import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './controller/authController';
import { competitionRouter } from './controller/competitionController';
import { matchRouter } from './controller/matchController';
import { playerRouter } from './controller/playerController';
import { userRouter } from './controller/userController';
import { errorHandler } from './util/middleware';
import { swaggerSpec } from './util/swagger';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'] }));
app.use(express.json());

app.get('/status', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRouter);
app.use('/api/competition', competitionRouter);
app.use('/api/matches', matchRouter);
app.use('/api/players', playerRouter);
app.use('/api/users', userRouter);

app.use(errorHandler);

const port = Number(process.env.APP_PORT || 3001);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
