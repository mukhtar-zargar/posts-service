import { inject, injectable } from "inversify";
import { MongoRepository } from "typeorm";
import { Post } from "../../../domain/posts/post";
import {
  IPostProps,
  TGetAllPostsProps
} from "../../../domain/posts/post.props";
import { IPostRepository } from "../../../domain/posts/post.repo";
import { Post as PostModel } from "../../typeorm/models/post.model";
import { Comment as CommentModel } from "../../typeorm/models/comment.model";
import { Logger, ILogger } from "../../logging/pino";
import { TYPES } from "../../../application/constants/types";
import { IAppDataSource } from "../../typeorm/typeorm.config";
import { getObjectId } from "../../typeorm/utils";
import { CustomError } from "../../errors/base.error";

@injectable()
export class PostRepository implements IPostRepository {
  protected logger: ILogger;
  protected postDataSource: MongoRepository<PostModel>;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.DataSource) appDataSource: IAppDataSource
  ) {
    this.logger = logger.get();
    this.postDataSource = appDataSource
      .instance()
      .getMongoRepository(PostModel);
  }

  async getById(id: string): Promise<Post> {
    try {
      const post = await this.postDataSource.findOneBy({
        _id: getObjectId(id)
      });

      if (!post) {
        throw new CustomError({
          message: "Invalid id",
          status: 400,
          errorCode: "INVALID_REQUEST"
        });
      }

      return Post.create({
        ...post,
        id: post.id.toString(),
        comments: post.comments?.map((comment) => {
          return { ...comment, id: comment.id.toString() };
        })
      });
    } catch (err) {
      this.logger.error(`<Error> PostRepositoryGetAll - ${err}`);

      throw err;
    }
  }

  async getAll({ postedBy }: TGetAllPostsProps): Promise<Post[]> {
    try {
      const filters = {
        ...(postedBy ? { postedBy } : {})
      };
      const posts = await this.postDataSource.find({
        where: filters
      });

      return posts.map((post) => {
        return Post.create({
          ...post,
          id: post.id.toString(),
          comments: post.comments?.map((comment) => {
            return { ...comment, id: comment.id.toString() };
          })
        });
      });
    } catch (err) {
      this.logger.error(`<Error> PostRepositoryGetAll - ${err}`);

      throw err;
    }
  }

  async create(post: IPostProps): Promise<Post> {
    try {
      let postToSave = this.postDataSource.create(post);
      const res = await this.postDataSource.save(postToSave);
      return Post.create({
        ...res,
        id: res.id.toString(),
        comments: res.comments?.map((el) => {
          return { ...el, id: el.id.toString() };
        })
      });
    } catch (err) {
      this.logger.error(`<Error> PostRepositoryCreate - ${err}`);

      throw err;
    }
  }

  update(post: IPostProps): Promise<Post> {
    throw new Error("Method not implemented.");
  }
}
