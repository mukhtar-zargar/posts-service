import { ICommentProps } from "../comments/comment.props";

export interface IPostProps {
  id?: string;
  body: string;
  headline: string;
  tags: string[];
  postedBy: string;
  upvotes?: string[];
  downvotes?: string[];
  comments?: ICommentProps[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type TGetAllPostsProps = {
  postedBy: string;
};
