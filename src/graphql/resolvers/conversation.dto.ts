import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateConversationDTO {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @ArrayMinSize(1)
  receiverIds: string[];
}
