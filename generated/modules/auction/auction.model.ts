import { BaseModel, BooleanField, IntField, Model, OneToMany, StringField, JSONField } from '@subsquid/warthog';

import { Bid } from '../bid/bid.model';
import { ParachainLeases } from '../parachain-leases/parachain-leases.model';
import { AuctionParachain } from '../auction-parachain/auction-parachain.model';
import { Chronicle } from '../chronicle/chronicle.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Auction extends BaseModel {
  @IntField({})
  blockNum!: number;

  @StringField({})
  status!: string;

  @OneToMany(() => Bid, (param: Bid) => param.auction, {
    modelName: 'Auction',
    relModelName: 'Bid',
    propertyName: 'bids',
  })
  bids?: Bid[];

  @IntField({
    nullable: true,
  })
  leaseStart?: number;

  @IntField({})
  slotsStart!: number;

  @IntField({
    nullable: true,
  })
  leaseEnd?: number;

  @IntField({})
  slotsEnd!: number;

  @IntField({})
  closingStart!: number;

  @IntField({})
  closingEnd!: number;

  @IntField({
    nullable: true,
  })
  resultBlock?: number;

  @BooleanField({})
  ongoing!: boolean;

  @OneToMany(() => ParachainLeases, (param: ParachainLeases) => param.auction, {
    nullable: true,
    modelName: 'Auction',
    relModelName: 'ParachainLeases',
    propertyName: 'parachainLeases',
  })
  parachainLeases?: ParachainLeases[];

  @OneToMany(() => AuctionParachain, (param: AuctionParachain) => param.auction, {
    nullable: true,
    modelName: 'Auction',
    relModelName: 'AuctionParachain',
    propertyName: 'auctionparachainauction',
  })
  auctionparachainauction?: AuctionParachain[];

  @OneToMany(() => Chronicle, (param: Chronicle) => param.curAuction, {
    nullable: true,
    modelName: 'Auction',
    relModelName: 'Chronicle',
    propertyName: 'chroniclecurAuction',
  })
  chroniclecurAuction?: Chronicle[];

  constructor(init?: Partial<Auction>) {
    super();
    Object.assign(this, init);
  }
}
