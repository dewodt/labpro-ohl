/**
 * @interface Config
 *
 * Config interface for the application.
 */
export interface Config {
  env: string;
  jwtSecret: string;
  app: {
    host: string;
    port: number;
    url: string;
  };
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}
