import { BaseModel, IntField, Model, ManyToOne, OneToMany, StringField, JSONField } from '@subsquid/warthog';

import { Auction } from '../auction/auction.model';
import { Parachain } from '../parachain/parachain.model';

import * as jsonTypes from '../jsonfields/jsonfields.model';

@Model({ api: {} })
export class Chronicle extends BaseModel {
  @ManyToOne(() => Auction, (param: Auction) => param.chroniclecurAuction, {
    skipGraphQLField: true,
    nullable: true,
    modelName: 'Chronicle',
    relModelName: 'Auction',
    propertyName: 'curAuction',
  })
  curAuction?: Auction;

  @IntField({
    nullable: true,
  })
  curBlockNum?: number;

  @IntField({
    nullable: true,
  })
  curLease?: number;

  @IntField({
    nullable: true,
  })
  curLeaseStart?: number;

  @IntField({
    nullable: true,
  })
  curLeaseEnd?: number;

  @OneToMany(() => Parachain, (param: Parachain) => param.chronicle, {
    nullable: true,
    modelName: 'Chronicle',
    relModelName: 'Parachain',
    propertyName: 'parachains',
  })
  parachains?: Parachain[];

  constructor(init?: Partial<Chronicle>) {
    super();
    Object.assign(this, init);
  }
}
