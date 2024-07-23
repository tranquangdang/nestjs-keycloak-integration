import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => value.trim())
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  @Transform(({ value }) => value.trim())
  password: string;
}
