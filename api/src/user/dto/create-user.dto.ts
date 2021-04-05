import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(3, 255)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(55)
  @ApiProperty()
  password: string;
}
