import { BaseModel, IntField, Model, ManyToOne, StringField, JSONField } from '@subsquid/warthog';

import { Auction } from '../auction/auction.model';
import { Parachain } from '../parachain/parachain.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class AuctionParachain extends BaseModel {
  @ManyToOne(() => Auction, (param: Auction) => param.auctionparachainauction, {
    skipGraphQLField: true,

    modelName: 'AuctionParachain',
    relModelName: 'Auction',
    propertyName: 'auction',
  })
  auction!: Auction;

  @ManyToOne(() => Parachain, (param: Parachain) => param.auctionparachainparachain, {
    skipGraphQLField: true,

    modelName: 'AuctionParachain',
    relModelName: 'Parachain',
    propertyName: 'parachain',
  })
  parachain!: Parachain;

  @IntField({})
  blockNum!: number;

  @IntField({})
  firstSlot!: number;

  @IntField({})
  lastSlot!: number;

  constructor(init?: Partial<AuctionParachain>) {
    super();
    Object.assign(this, init);
  }
}
