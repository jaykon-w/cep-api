import { prop } from '@typegoose/typegoose';

export class Address {
  @prop({
    unique: true,
  })
  cep: string;

  @prop()
  street: string;

  @prop()
  neighborhood: string;

  @prop()
  city: string;

  @prop()
  state: string;
}
