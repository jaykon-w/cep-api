import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class PatchAddressDto extends PartialType(
  OmitType(CreateAddressDto, ['cep']),
) {}
