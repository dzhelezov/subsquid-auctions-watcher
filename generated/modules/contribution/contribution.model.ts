import {
  BaseModel,
  IntField,
  NumericField,
  DateTimeField,
  Model,
  ManyToOne,
  StringField,
  JSONField,
} from '@subsquid/warthog';

import BN from 'bn.js';

import { Parachain } from '../parachain/parachain.model';
import { Crowdloan } from '../crowdloan/crowdloan.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Contribution extends BaseModel {
  @StringField({})
  account!: string;

  @ManyToOne(() => Parachain, (param: Parachain) => param.contributionparachain, {
    skipGraphQLField: true,

    modelName: 'Contribution',
    relModelName: 'Parachain',
    propertyName: 'parachain',
  })
  parachain!: Parachain;

  @ManyToOne(() => Crowdloan, (param: Crowdloan) => param.contributions, {
    skipGraphQLField: true,

    modelName: 'Contribution',
    relModelName: 'Crowdloan',
    propertyName: 'fund',
  })
  fund!: Crowdloan;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  amount!: BN;

  @IntField({})
  blockNum!: number;

  @DateTimeField({})
  createdAt!: Date;

  constructor(init?: Partial<Contribution>) {
    super();
    Object.assign(this, init);
  }
}
