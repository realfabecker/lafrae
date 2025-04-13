import { DataSource, DataSourceOptions } from "typeorm";

const sourceConfig: DataSourceOptions = {
  type: "postgres",
  database: "donatelo",
  username: "postgres",
  password: "donatelo",
  host: "database",
  port: 5432,
  synchronize: false,
  logging: false,
  migrations: [
    "/home/nonroot/app/src/database/migrations/*{ts,js}",
    "/home/nonroot/app/dist/database/migrations/*{ts,js}",
  ],
  entities: [
    "/home/nonroot/app/src/database/entities/*{ts,js}",
    "/home/nonroot/app/dist/database/entities/*{ts,js}",
  ],
  ssl: process.env.NODE_ENV !== "development",
};
export const AppDataSource = new DataSource(sourceConfig);
