import { Entity } from "../entity";
import { IPostProps } from "./post.props";

export class Post extends Entity<IPostProps> {
  private constructor(props: IPostProps) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: IPostProps): Post {
    const instance = new Post(props);
    return instance;
  }

  get id(): string {
    return this._id;
  }

  get body(): string {
    return this.body;
  }

  get headline(): string {
    return this.headline;
  }

  set tags(text: string) {
    this.tags = text;
  }

  get postedBy(): string {
    return this.postedBy;
  }

  get upvotes(): string[] {
    return this.upvotes;
  }

  get downvotes(): string {
    return this.downvotes;
  }

  get comments(): string[] {
    return this.comments;
  }

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }
}
