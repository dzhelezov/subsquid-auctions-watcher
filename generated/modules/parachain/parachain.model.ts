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

import { ParachainLeases } from '../parachain-leases/parachain-leases.model';
import { Bid } from '../bid/bid.model';
import { Crowdloan } from '../crowdloan/crowdloan.model';
import { Chronicle } from '../chronicle/chronicle.model';
import { AuctionParachain } from '../auction-parachain/auction-parachain.model';
import { Contribution } from '../contribution/contribution.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Parachain extends BaseModel {
  @IntField({})
  paraId!: number;

  @DateTimeField({})
  createdAt!: Date;

  @IntField({
    nullable: true,
  })
  creationBlock?: number;

  @BooleanField({})
  deregistered!: boolean;

  @NumericField({
    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined,
    },
  })
  deposit!: BN;

  @StringField({})
  manager!: string;

  @OneToMany(() => ParachainLeases, (param: ParachainLeases) => param.parachain, {
    nullable: true,
    modelName: 'Parachain',
    relModelName: 'ParachainLeases',
    propertyName: 'leases',
  })
  leases?: ParachainLeases[];

  @OneToMany(() => Bid, (param: Bid) => param.parachain, {
    nullable: true,
    modelName: 'Parachain',
    relModelName: 'Bid',
    propertyName: 'bids',
  })
  bids?: Bid[];

  @OneToMany(() => Crowdloan, (param: Crowdloan) => param.parachain, {
    nullable: true,
    modelName: 'Parachain',
    relModelName: 'Crowdloan',
    propertyName: 'funds',
  })
  funds?: Crowdloan[];

  @ManyToOne(() => Crowdloan, (param: Crowdloan) => param.parachainactiveFund, {
    skipGraphQLField: true,
    nullable: true,
    modelName: 'Parachain',
    relModelName: 'Crowdloan',
    propertyName: 'activeFund',
  })
  activeFund?: Crowdloan;

  @ManyToOne(() => Bid, (param: Bid) => param.parachainlatestBid, {
    skipGraphQLField: true,
    nullable: true,
    modelName: 'Parachain',
    relModelName: 'Bid',
    propertyName: 'latestBid',
  })
  latestBid?: Bid;

  @ManyToOne(() => Chronicle, (param: Chronicle) => param.parachains, {
    skipGraphQLField: true,
    nullable: true,
    modelName: 'Parachain',
    relModelName: 'Chronicle',
    propertyName: 'chronicle',
  })
  chronicle?: Chronicle;

  @OneToMany(() => AuctionParachain, (param: AuctionParachain) => param.parachain, {
    nullable: true,
    modelName: 'Parachain',
    relModelName: 'AuctionParachain',
    propertyName: 'auctionparachainparachain',
  })
  auctionparachainparachain?: AuctionParachain[];

  @OneToMany(() => Contribution, (param: Contribution) => param.parachain, {
    nullable: true,
    modelName: 'Parachain',
    relModelName: 'Contribution',
    propertyName: 'contributionparachain',
  })
  contributionparachain?: Contribution[];

  constructor(init?: Partial<Parachain>) {
    super();
    Object.assign(this, init);
  }
}
