import { Post } from "./post";
import { IPostProps, TGetAllPostsProps } from "./post.props";

export interface IPostRepository {
  getById(id: string): Promise<Post>;
  getAll(props: TGetAllPostsProps): Promise<Post[]>;
  create(post: IPostProps): Promise<Post>;
  update(post: IPostProps): Promise<Post>;
}
