import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { InjectModel } from 'nestjs-typegoose';
import * as R from 'ramda';
import { BindDocTo } from '../shared/decorators/bind-doc-to.decorator';
import { CreateAddressDto } from './dto/create-address.dto';
import { PatchAddressDto } from './dto/patch-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address)
    public readonly addressModel: ReturnModelType<typeof Address>,
  ) {}

  @BindDocTo(Address)
  create(createAddressDto: CreateAddressDto): Promise<Address> {
    return this.addressModel.create(createAddressDto);
  }

  @BindDocTo(Address)
  async findOneByCep(cep: string): Promise<Address | null> {
    const roundedCeps = this.getRoundedCepTable(cep);

    const findedCeps = await this.addressModel
      .find({
        cep: { $in: roundedCeps },
      })
      .exec();

    return (
      R.pipe(R.sortWith([R.descend(R.prop('cep'))]), R.head)(findedCeps) || null
    );
  }

  @BindDocTo(Address)
  findById(id: ObjectId): Promise<Address | null> {
    return this.addressModel.findById(id).exec();
  }

  getRoundedCepTable(cep: string) {
    return R.pipe(
      (_) => R.times((_) => cep, cep.length),
      R.addIndex(R.map)((e, i) =>
        R.pipe(R.take(i + 1), (e) => e.padEnd(cep.length, 0))(e),
      ),
      R.uniq,
    )();
  }

  @BindDocTo(Address)
  update(id: ObjectId, patchAddressDto: PatchAddressDto): Promise<Address> {
    return this.addressModel
      .findByIdAndUpdate(id, { $set: patchAddressDto }, { new: true })
      .exec();
  }

  @BindDocTo(Address)
  async replace(
    id: ObjectId,
    updateAddressDto: UpdateAddressDto,
    cep: string,
  ): Promise<Address> {
    await this.addressModel
      .replaceOne({ _id: id }, { ...updateAddressDto, cep })
      .exec();

    return this.addressModel.findById(id).exec();
  }

  @BindDocTo(Address)
  remove(id: ObjectId): Promise<Address> {
    return this.addressModel.findByIdAndRemove(id).exec();
  }
}
