import { IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateLinkDto {
  @IsNotEmpty()
  @IsUrl()
  originalUrl: string;

  @IsNotEmpty()
  @IsUrl()
  shortUrl: string;
}
