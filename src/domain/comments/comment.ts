import { Entity } from "../entity";
import { ICommentProps } from "./comment.props";

export class Comment extends Entity<ICommentProps> {
  private constructor(props: ICommentProps) {
    const { id, ...data } = props;
    super(data, id);
  }

  public static create(props: ICommentProps): Comment {
    const instance = new Comment(props);
    return instance;
  }

  get id(): string {
    return this._id;
  }

  get comment(): string {
    return this.comment;
  }

  get commentedBy(): string {
    return this.commentedBy;
  }

  get createdAt(): Date {
    return this.createdAt;
  }

  get updatedAt(): Date {
    return this.updatedAt;
  }
}
