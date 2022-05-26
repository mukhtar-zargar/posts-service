import { injectable } from "inversify";
import { DataSource } from "typeorm";
import { AppSettings } from "../../settings.ts/app.settings";
import { Comment } from "./models/comment.model";
import { Post } from "./models/post.model";

@injectable()
export class AppDataSource {
  private appDataSource: DataSource;

  constructor() {
    this.appDataSource = new DataSource({
      type: "mongodb",
      host: AppSettings.DB_HOST,
      port: Number(AppSettings.DB_PORT),
      database: AppSettings.DB_NAME,
      username: AppSettings.DB_USER,
      password: AppSettings.DB_PASSWORD,
      authSource: AppSettings.DB_AUTHSOURCE,
      entities: [Post, Comment],
      synchronize: true
    });
  }

  public instance(): DataSource {
    if (!this.appDataSource) {
      new AppDataSource();
    }
    return this.appDataSource;
  }
}

export interface IAppDataSource {
  instance(): DataSource;
}
