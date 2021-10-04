import { BaseModel, IntField, Model, StringField, JSONField } from '@subsquid/warthog';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class CrowdloanSequence extends BaseModel {
  @IntField({})
  curIndex!: number;

  @IntField({})
  blockNum!: number;

  constructor(init?: Partial<CrowdloanSequence>) {
    super();
    Object.assign(this, init);
  }
}
