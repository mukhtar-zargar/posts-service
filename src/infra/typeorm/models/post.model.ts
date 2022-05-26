import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectID,
  ObjectIdColumn,
  UpdateDateColumn
} from "typeorm";
import { Comment } from "./comment.model";

@Entity()
export class Post {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  body: string;

  @Column()
  headline: string;

  @Column()
  tags: string[];

  @Column()
  postedBy: string;

  @Column()
  upvotes: string[];

  @Column()
  downvotes: string[];

  @Column((type) => Comment)
  comments: Comment[];

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)"
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)"
  })
  updatedAt: Date;
}
