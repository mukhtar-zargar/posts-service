import { Container } from "inversify";
import { Logger } from "./infra/logging/pino";
import { TYPES } from "./application/constants/types";
import { AppDataSource } from "./infra/typeorm/typeorm.config";

const container = new Container();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();
container.bind(TYPES.DataSource).to(AppDataSource).inSingletonScope();

export { container };
