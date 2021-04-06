import '../setup';
import '../setup.tests';

import { BadRequestException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { transform$ } from '../shared/observables/transform.observable';
import { validate$ } from '../shared/observables/validate.observable';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/update-address.dto';
import { PatchAddressDto } from './dto/patch-address.dto';

describe('AddressController', () => {
  let controller: AddressController;
  const addressService = new AddressService(
    {} as ReturnModelType<typeof Address>,
  );
  const authGuard = new AuthGuard({} as AuthService);

  beforeEach(async () => {
    controller = new AddressController(addressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should to fail when create an empty instance of CreateAddressDto', async () => {
    try {
      await of({})
        .pipe(transform$(CreateAddressDto), validate$<CreateAddressDto>())
        .toPromise();
      throw new Error('Should not get here');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
    }
  });

  it('should to fail when create an instance of CreateAddressDto, with a wrong fields', async () => {
    try {
      await of({
        cep: 'a',
        city: 'Taubaté',
      } as CreateAddressDto)
        .pipe(transform$(CreateAddressDto), validate$<CreateAddressDto>())
        .toPromise();
      throw new Error('Should not get here');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.response.message.some((e) => e.property === 'cep')).toBeTruthy;
      expect(err.response.message.some((e) => e.property === 'state'))
        .toBeTruthy;
    }
  });

  it('should to pass when create a valid instance of CreateAddressDto', async () => {
    await of({
      cep: '12013241',
      street: 'Rua 1',
      neighborhood: 'Centro',
      city: 'Taubaté',
      state: 'SP',
    } as CreateAddressDto)
      .pipe(transform$(CreateAddressDto), validate$<CreateAddressDto>())
      .toPromise();
  });

  it('should to call userService.create', async () => {
    const spy = jest
      .spyOn(addressService, 'create')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    controller.create({} as CreateAddressDto);

    expect(spy).toBeCalled();
  });

  it('should to call userService.findOneByCep', async () => {
    const spy = jest
      .spyOn(addressService, 'findOneByCep')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    controller.findOne({ cep: '12013241' });

    expect(spy).toBeCalled();
  });

  it('should to call userService.update', async () => {
    const spy1 = jest
      .spyOn(addressService, 'findById')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    const spy2 = jest
      .spyOn(addressService, 'replace')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    await controller.update(new ObjectId(), {} as UpdateAddressDto).toPromise();

    expect(spy2).toBeCalled();
  });

  it('should to call userService.patch', async () => {
    const spy1 = jest
      .spyOn(addressService, 'findById')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    const spy2 = jest
      .spyOn(addressService, 'update')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    await controller.patch(new ObjectId(), {} as PatchAddressDto).toPromise();

    expect(spy2).toBeCalled();
  });

  it('should to call userService.remove', async () => {
    const spy1 = jest
      .spyOn(addressService, 'findById')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    const spy2 = jest
      .spyOn(addressService, 'remove')
      .mockImplementation()
      .mockReturnValue(Promise.resolve({} as any));

    await controller.remove(new ObjectId()).toPromise();

    expect(spy2).toBeCalled();
  });
});
