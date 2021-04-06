import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { WinstonLogger } from '@payk/nestjs-winston';
import { ObjectId } from 'mongodb';
import { EMPTY, from, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { AuthGuard } from '../auth/guard/auth.guard';
import { BusinessError, ERRORS } from '../shared/errors/business.error';
import { throwNotFoundIfEmpty$ } from '../shared/observables/throw-not-found-if-empty.observable';
import { transform$ } from '../shared/observables/transform.observable';
import { ParseObjectIdPipe } from '../shared/pipes/parse-objectid.pipe';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { FindByCEPDto } from './dto/find_by_cep.dto';
import { PatchAddressDto } from './dto/patch-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRo } from './ro/address.ro';

@ApiTags('Address')
@Controller('address')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AddressController {
  private readonly logger = new WinstonLogger(AddressController.name);

  constructor(private readonly addressService: AddressService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create an address' })
  create(@Body() createAddressDto: CreateAddressDto): Observable<AddressRo> {
    return from(this.addressService.create(createAddressDto)).pipe(
      tap((created) =>
        this.logger.debug(
          `address created: ${JSON.stringify(created, undefined, 2)}`,
        ),
      ),
      transform$(AddressRo),
    );
  }

  @Get('by_cep/:cep')
  @ApiOperation({ summary: 'Find an address by CEP' })
  findOne(@Param() params: FindByCEPDto) {
    return from(this.addressService.findOneByCep(params.cep)).pipe(
      throwNotFoundIfEmpty$(),
      transform$(AddressRo),
    );
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Update fileds of an address' })
  patch(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() patchAddressDto: PatchAddressDto,
  ): Observable<AddressRo> {
    return from(this.addressService.findById(id)).pipe(
      throwNotFoundIfEmpty$(),
      mergeMap(() => this.addressService.update(id, patchAddressDto)),
      tap((updated) =>
        this.logger.debug(
          `address updated: ${JSON.stringify(updated, undefined, 2)}`,
        ),
      ),
      transform$(AddressRo),
    );
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Update an address' })
  update(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Observable<AddressRo> {
    return from(this.addressService.findById(id)).pipe(
      throwNotFoundIfEmpty$(),
      mergeMap((address) =>
        this.addressService.replace(id, updateAddressDto, address.cep),
      ),
      tap((updated) =>
        this.logger.debug(
          `address updated: ${JSON.stringify(updated, undefined, 2)}`,
        ),
      ),
      transform$(AddressRo),
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Delete an address' })
  remove(@Param('id', ParseObjectIdPipe) id: ObjectId): Observable<AddressRo> {
    return from(this.addressService.findById(id)).pipe(
      throwNotFoundIfEmpty$(),
      mergeMap((_) => this.addressService.remove(id)),
      tap((deleted) =>
        this.logger.debug(
          `address deleted: ${JSON.stringify(deleted, undefined, 2)}`,
        ),
      ),
      transform$(AddressRo),
    );
  }
}
