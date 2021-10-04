import { BaseModel, BooleanField, Model, StringField, JSONField } from '@subsquid/warthog';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Account extends BaseModel {
  @BooleanField({})
  isFund!: boolean;

  constructor(init?: Partial<Account>) {
    super();
    Object.assign(this, init);
  }
}
