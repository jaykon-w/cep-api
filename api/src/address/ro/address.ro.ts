import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AddressRo {
  @Expose()
  @ApiProperty()
  _id: string;

  @Expose()
  @ApiProperty()
  cep: string;

  @Expose()
  @ApiPropertyOptional()
  street?: string;

  @Expose()
  @ApiPropertyOptional()
  neighborhood?: string;

  @Expose()
  @ApiPropertyOptional()
  city?: string;

  @Expose()
  @ApiProperty()
  state: string;
}
