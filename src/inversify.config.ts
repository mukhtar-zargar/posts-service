import { Container } from "inversify";

import { Logger } from "./infra/logging/pino";
import { TYPES } from "./application/constants/types";
import { AppDataSource } from "./infra/typeorm/typeorm.config";
import { PostRepository } from "./infra/repos/posts";

const container = new Container();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();
container.bind(TYPES.PostRepository).to(PostRepository);
container.bind(TYPES.DataSource).to(AppDataSource).inSingletonScope();

export { container };
