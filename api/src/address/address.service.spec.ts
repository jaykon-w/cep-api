import '../setup';
import '../setup.tests';

import { ReturnModelType } from '@typegoose/typegoose';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(async () => {
    service = new AddressService({ create() {}, find() {} } as ReturnModelType<
      typeof Address
    >);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an address', async () => {
    const spy = jest
      .spyOn(service.addressModel, 'create')
      .mockReturnValue(Promise.resolve({} as any));

    await service.create({} as CreateAddressDto);
    expect(spy).toBeCalled();
  });

  it('should make a rounded cep table', async () => {
    const ceps = service.getRoundedCepTable('12013241');
    expect(ceps).toEqual([
      '10000000',
      '12000000',
      '12010000',
      '12013000',
      '12013200',
      '12013240',
      '12013241',
    ]);
  });

  it('should get an address by complete cep', async () => {
    const mockedAddress = [
      { cep: '12013000' },
      { cep: '12013200' },
      { cep: '12013240' },
      { cep: '12013241' },
    ];

    const spy = jest.spyOn(service.addressModel, 'find').mockReturnValue({
      exec: jest.fn().mockReturnValue(mockedAddress),
    } as any);

    const address = await service.findOneByCep('12013241');

    expect(address).toEqual({ cep: '12013241' });
  });

  it('should get an address by rounded cep', async () => {
    const mockedAddress = [{ cep: '12013200' }, { cep: '12013000' }];

    const spy = jest.spyOn(service.addressModel, 'find').mockReturnValue({
      exec: jest.fn().mockReturnValue(mockedAddress),
    } as any);

    const address = await service.findOneByCep('12013241');

    expect(address).toEqual({ cep: '12013200' });
  });
});
