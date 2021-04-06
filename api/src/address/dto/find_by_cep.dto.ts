import { PartialType, PickType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class FindByCEPDto extends PartialType(
  PickType(CreateAddressDto, ['cep']),
) {}
