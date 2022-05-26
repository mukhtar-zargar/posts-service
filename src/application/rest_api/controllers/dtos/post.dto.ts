import { Expose } from "class-transformer";
import { ArrayMinSize, IsArray, IsString, MinLength } from "class-validator";

export class PostDTO {
  @Expose()
  @MinLength(1)
  @IsString()
  public body: string;

  @Expose()
  @MinLength(1)
  @IsString()
  public headline: string;

  @Expose()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  public tags: string[];

  @Expose()
  @MinLength(1)
  @IsString()
  public postedBy: string;
}
