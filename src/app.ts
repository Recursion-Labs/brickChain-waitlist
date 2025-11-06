import express from "express";
import cors from "cors";
import router from "./routes";
import morgan from "morgan";
import helmet from "helmet";
import { errorConverter, errorHandler } from "./handlers/error.handler";

const app = express();

// Configure CORS to handle preflight requests properly
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost for development (only exact localhost origins)
    const localhostRegex = /^https?:\/\/localhost(:\d+)?$/;
    if (origin && localhostRegex.test(origin)) return callback(null, true);

    // Allow ngrok tunnels (only valid ngrok.io subdomains)
    const ngrokRegex = /^https?:\/\/([a-z0-9-]+)\.ngrok\.io$/;
    if (origin && ngrokRegex.test(origin)) return callback(null, true);

    // Allow specific domains if needed
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3030',
      'https://brickchain.in',
      'https://www.brickchain.in'
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(helmet());

app.use(router);

app.use(errorConverter);
app.use(errorHandler);

export default app;
