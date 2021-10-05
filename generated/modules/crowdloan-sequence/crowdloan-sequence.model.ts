import { BaseModel, IntField, DateTimeField, Model, StringField, JSONField } from '@subsquid/warthog';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class CrowdloanSequence extends BaseModel {
  @IntField({})
  curIndex!: number;

  @DateTimeField({})
  createdAt!: Date;

  @IntField({})
  blockNum!: number;

  constructor(init?: Partial<CrowdloanSequence>) {
    super();
    Object.assign(this, init);
  }
}
