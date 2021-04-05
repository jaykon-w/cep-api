import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginRo {
  @Expose()
  @ApiProperty()
  token: string;
}
