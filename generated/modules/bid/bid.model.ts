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

import { Auction } from '../auction/auction.model';
import { Parachain } from '../parachain/parachain.model';
import { Crowdloan } from '../crowdloan/crowdloan.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Bid extends BaseModel {
  @ManyToOne(() => Auction, (param: Auction) => param.bids, {
    skipGraphQLField: true,

    modelName: 'Bid',
    relModelName: 'Auction',
    propertyName: 'auction',
  })
  auction!: Auction;

  @IntField({
    nullable: true,
  })
  winningAuction?: number;

  @IntField({})
  blockNum!: number;

  @ManyToOne(() => Parachain, (param: Parachain) => param.bids, {
    skipGraphQLField: true,

    modelName: 'Bid',
    relModelName: 'Parachain',
    propertyName: 'parachain',
  })
  parachain!: Parachain;

  @BooleanField({})
  isCrowdloan!: boolean;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  amount!: BN;

  @ManyToOne(() => Crowdloan, (param: Crowdloan) => param.bidfund, {
    skipGraphQLField: true,
    nullable: true,
    modelName: 'Bid',
    relModelName: 'Crowdloan',
    propertyName: 'fund',
  })
  fund?: Crowdloan;

  @IntField({})
  firstSlot!: number;

  @IntField({})
  lastSlot!: number;

  @StringField({
    nullable: true,
  })
  bidder?: string;

  @DateTimeField({})
  createdAt!: Date;

  @OneToMany(() => Parachain, (param: Parachain) => param.latestBid, {
    nullable: true,
    modelName: 'Bid',
    relModelName: 'Parachain',
    propertyName: 'parachainlatestBid',
  })
  parachainlatestBid?: Parachain[];

  constructor(init?: Partial<Bid>) {
    super();
    Object.assign(this, init);
  }
}
