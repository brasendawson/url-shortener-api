import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL database connected successfully');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};