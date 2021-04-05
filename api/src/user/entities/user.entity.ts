import { pre, prop } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';

@pre<User>('save', async function () {
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
})
export class User {
  // tslint:disable-next-line:variable-name
  _id?: string;

  // tslint:disable-next-line:variable-name
  __v?: number;

  @prop()
  name: string;

  @prop({
    unique: true,
  })
  email: string;

  @prop()
  password: string;
}
