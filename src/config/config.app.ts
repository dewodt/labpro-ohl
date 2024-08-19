import { Config } from './config.interface';

/**
 * @function loadConfig
 * loads the configuration from the environment variables.
 *
 * @returns Config
 */
export const appConfig = (): Config => ({
  env: process.env.NODE_ENV!,
  jwtSecret: process.env.JWT_SECRET!,
  app: {
    host: process.env.APP_HOST!,
    port: parseInt(process.env.APP_PORT!, 10),
    url: process.env.APP_URL!,
  },
  database: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
    folder: process.env.CLOUDINARY_FOLDER!,
  },
});
