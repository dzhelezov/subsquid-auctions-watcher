import {
  BaseModel,
  BooleanField,
  IntField,
  NumericField,
  DateTimeField,
  Model,
  ManyToOne,
  OneToMany,
  StringField,
  JSONField,
} from '@subsquid/warthog';

import BN from 'bn.js';

import { Parachain } from '../parachain/parachain.model';
import { Contribution } from '../contribution/contribution.model';
import { Bid } from '../bid/bid.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Crowdloan extends BaseModel {
  @ManyToOne(() => Parachain, (param: Parachain) => param.funds, {
    skipGraphQLField: true,

    modelName: 'Crowdloan',
    relModelName: 'Parachain',
    propertyName: 'parachain',
  })
  parachain!: Parachain;

  @StringField({})
  depositor!: string;

  @StringField({
    nullable: true,
  })
  verifier?: string;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  cap!: BN;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  raised!: BN;

  @IntField({})
  lockExpiredBlock!: number;

  @IntField({
    nullable: true,
  })
  blockNum?: number;

  @IntField({})
  firstSlot!: number;

  @IntField({})
  lastSlot!: number;

  @StringField({})
  status!: string;

  @IntField({
    nullable: true,
  })
  leaseExpiredBlock?: number;

  @IntField({
    nullable: true,
  })
  dissolvedBlock?: number;

  @DateTimeField({
    nullable: true,
  })
  updatedAt?: Date;

  @DateTimeField({})
  createdAt!: Date;

  @BooleanField({
    nullable: true,
  })
  isFinished?: boolean;

  @StringField({
    nullable: true,
  })
  wonAuctionId?: string;

  @OneToMany(() => Contribution, (param: Contribution) => param.fund, {
    nullable: true,
    modelName: 'Crowdloan',
    relModelName: 'Contribution',
    propertyName: 'contributions',
  })
  contributions?: Contribution[];

  @OneToMany(() => Bid, (param: Bid) => param.fund, {
    nullable: true,
    modelName: 'Crowdloan',
    relModelName: 'Bid',
    propertyName: 'bidfund',
  })
  bidfund?: Bid[];

  @OneToMany(() => Parachain, (param: Parachain) => param.activeFund, {
    nullable: true,
    modelName: 'Crowdloan',
    relModelName: 'Parachain',
    propertyName: 'parachainactiveFund',
  })
  parachainactiveFund?: Parachain[];

  constructor(init?: Partial<Crowdloan>) {
    super();
    Object.assign(this, init);
  }
}
