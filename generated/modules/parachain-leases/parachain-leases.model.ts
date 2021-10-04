import {
  BaseModel,
  BooleanField,
  IntField,
  NumericField,
  Model,
  ManyToOne,
  StringField,
  JSONField,
} from '@subsquid/warthog';

import BN from 'bn.js';

import { Parachain } from '../parachain/parachain.model';
import { Auction } from '../auction/auction.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class ParachainLeases extends BaseModel {
  @IntField({})
  paraId!: number;

  @ManyToOne(() => Parachain, (param: Parachain) => param.leases, {
    skipGraphQLField: true,

    modelName: 'ParachainLeases',
    relModelName: 'Parachain',
    propertyName: 'parachain',
  })
  parachain!: Parachain;

  @StringField({})
  leaseRange!: string;

  @IntField({})
  firstLease!: number;

  @IntField({})
  lastLease!: number;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  latestBidAmount!: BN;

  @ManyToOne(() => Auction, (param: Auction) => param.parachainLeases, {
    skipGraphQLField: true,
    nullable: true,
    modelName: 'ParachainLeases',
    relModelName: 'Auction',
    propertyName: 'auction',
  })
  auction?: Auction;

  @StringField({
    nullable: true,
  })
  activeForAuction?: string;

  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  winningAmount?: BN;

  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  extraAmount?: BN;

  @StringField({
    nullable: true,
  })
  wonBidFrom?: string;

  @IntField({
    nullable: true,
  })
  numBlockWon?: number;

  @IntField({
    nullable: true,
  })
  winningResultBlock?: number;

  @BooleanField({})
  hasWon!: boolean;

  constructor(init?: Partial<ParachainLeases>) {
    super();
    Object.assign(this, init);
  }
}
