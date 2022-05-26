import { isMongoId } from "class-validator";
import { Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  queryParam,
  requestBody,
  requestParam,
  response
} from "inversify-express-utils";
import { IPostRepository } from "../../../domain/posts/post.repo";
import { Result } from "../../../domain/utilities/result";
import { validationMiddleware } from "../../../infra/middleware/validator.middleware";
import { TYPES } from "../../constants/types";
import { BaseController } from "../base/base.controller";
import { PostDTO } from "./dtos/post.dto";

@controller("/posts")
export class PostController extends BaseController {
  @inject(TYPES.PostRepository) postRepository: IPostRepository;

  @httpPost("/", validationMiddleware(PostDTO))
  private async create(
    @requestBody() body: PostDTO,
    @response() res: Response
  ) {
    try {
      const post = await this.postRepository.create(body);
      this.createResponse(res, Result.ok(post, "Post created successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller Create - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }

  @httpGet("/")
  private async getPosts(
    @queryParam("postedBy") postedBy: string,
    @response() res: Response
  ) {
    try {
      const posts = await this.postRepository.getAll({ postedBy });
      this.createResponse(
        res,
        Result.ok(posts, "Posts retrieved successfully")
      );
    } catch (err) {
      this.logger.error(`<Error> Controller GetPosts - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }

  @httpGet("/:id")
  private async get(@requestParam("id") id: string, @response() res: Response) {
    if (!id || !isMongoId(id)) {
      this.createResponse(res, Result.fail("Invalid id", "INVALID_REQUEST"));
      return;
    }
    try {
      const post = await this.postRepository.getById(id);
      this.createResponse(res, Result.ok(post, "Post retrieved successfully"));
    } catch (err) {
      this.logger.error(`<Error> Controller Get - ${err}`);
      const errMsg = err.status && err.status !== 500 ? err.message : "";
      this.createResponse(res, Result.fail(errMsg, err.errorCode));
    }
  }
}
