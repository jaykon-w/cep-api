import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class CreateAddressDto {
  @IsNumberString(undefined, {
    message: 'Invalid CEP format',
  })
  @Length(8, 8, {
    message: 'Invalid CEP format',
  })
  @ApiProperty()
  cep: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  @ApiPropertyOptional()
  street?: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  @ApiPropertyOptional()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  @Length(3, 55)
  @ApiPropertyOptional()
  city?: string;

  @Transform((e) => e.value?.toUpperCase())
  @IsString()
  @Length(2, 2)
  @ApiProperty()
  state: string;
}
