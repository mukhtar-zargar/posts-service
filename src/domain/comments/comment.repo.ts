import { Comment } from "./comment";
import { ICommentProps } from "./comment.props";

export interface ICommentRepository {
  getById(id: string): Promise<Comment>;
  getAll(): Promise<Comment[]>;
  create(comment: ICommentProps): Promise<Comment>;
  update(comment: ICommentProps): Promise<Comment>;
}
