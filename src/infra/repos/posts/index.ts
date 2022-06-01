import { inject, injectable } from "inversify";
import { MongoRepository } from "typeorm";
import { v4 } from "uuid";

import { Post } from "../../../domain/posts/post";
import { IPostProps, TGetAllPostsProps } from "../../../domain/posts/post.props";
import { IPostRepository } from "../../../domain/posts/post.repo";
import { Post as PostModel } from "../../typeorm/models/post.model";
import { Comment as CommentModel } from "../../typeorm/models/comment.model";
import { Logger, ILogger } from "../../logging/pino";
import { TYPES } from "../../../application/constants/types";
import { IAppDataSource } from "../../typeorm/typeorm.config";
import { getObjectId } from "../../typeorm/utils";
import { CustomError } from "../../errors/base.error";
import { IDomainProducerMessagingRepository } from "../../../domain/ports/messaging/producer";
import { PostEvents, Topics } from "../../../application/constants/messaging.constants";

@injectable()
export class PostRepository implements IPostRepository {
  protected logger: ILogger;
  protected postDataSource: MongoRepository<PostModel>;

  protected producer: IDomainProducerMessagingRepository;

  constructor(
    @inject(TYPES.Logger) logger: Logger,
    @inject(TYPES.DataSource) appDataSource: IAppDataSource,
    @inject(TYPES.MessagingProducer) producer: () => IDomainProducerMessagingRepository
  ) {
    this.logger = logger.get();
    this.postDataSource = appDataSource.instance().getMongoRepository(PostModel);

    this.producer = producer();
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
      this.producer.publish(
        Topics.PostService,
        {
          partition: 0,
          dateTimeOccurred: new Date(),
          eventId: v4(),
          data: postToSave,
          eventSource: Topics.PostService,
          eventType: PostEvents.Created
        },
        {
          noAvroEncoding: true,
          nonTransactional: true
        }
      );

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
