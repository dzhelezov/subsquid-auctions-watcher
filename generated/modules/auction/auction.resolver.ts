import {
  Arg,
  Args,
  Mutation,
  Query,
  Root,
  Resolver,
  FieldResolver,
  ObjectType,
  Field,
  Int,
  ArgsType,
  Info,
  Ctx,
} from 'type-graphql';
import graphqlFields from 'graphql-fields';
import { Inject } from 'typedi';
import { Min } from 'class-validator';
import {
  Fields,
  StandardDeleteResponse,
  UserId,
  PageInfo,
  RawFields,
  NestedFields,
  BaseContext,
} from '@subsquid/warthog';

import {
  AuctionCreateInput,
  AuctionCreateManyArgs,
  AuctionUpdateArgs,
  AuctionWhereArgs,
  AuctionWhereInput,
  AuctionWhereUniqueInput,
  AuctionOrderByEnum,
} from '../../warthog';

import { Auction } from './auction.model';
import { AuctionService } from './auction.service';

import { Bid } from '../bid/bid.model';
import { BidService } from '../bid/bid.service';
import { ParachainLeases } from '../parachain-leases/parachain-leases.model';
import { ParachainLeasesService } from '../parachain-leases/parachain-leases.service';
import { AuctionParachain } from '../auction-parachain/auction-parachain.model';
import { AuctionParachainService } from '../auction-parachain/auction-parachain.service';
import { Chronicle } from '../chronicle/chronicle.model';
import { ChronicleService } from '../chronicle/chronicle.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@ObjectType()
export class AuctionEdge {
  @Field(() => Auction, { nullable: false })
  node!: Auction;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class AuctionConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [AuctionEdge], { nullable: false })
  edges!: AuctionEdge[];

  @Field(() => PageInfo, { nullable: false })
  pageInfo!: PageInfo;
}

@ArgsType()
export class ConnectionPageInputOptions {
  @Field(() => Int, { nullable: true })
  @Min(0)
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string; // V3: TODO: should we make a RelayCursor scalar?

  @Field(() => Int, { nullable: true })
  @Min(0)
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}

@ArgsType()
export class AuctionConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => AuctionWhereInput, { nullable: true })
  where?: AuctionWhereInput;

  @Field(() => AuctionOrderByEnum, { nullable: true })
  orderBy?: [AuctionOrderByEnum];
}

@Resolver(Auction)
export class AuctionResolver {
  constructor(@Inject('AuctionService') public readonly service: AuctionService) {}

  @Query(() => [Auction])
  async auctions(
    @Args() { where, orderBy, limit, offset }: AuctionWhereArgs,
    @Fields() fields: string[]
  ): Promise<Auction[]> {
    return this.service.find<AuctionWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Auction, { nullable: true })
  async auctionByUniqueInput(
    @Arg('where') where: AuctionWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<Auction | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => AuctionConnection)
  async auctionsConnection(
    @Args() { where, orderBy, ...pageOptions }: AuctionConnectionWhereArgs,
    @Info() info: any
  ): Promise<AuctionConnection> {
    const rawFields = graphqlFields(info, {}, { excludedFields: ['__typename'] });

    let result: any = {
      totalCount: 0,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    // If the related database table does not have any records then an error is thrown to the client
    // by warthog
    try {
      result = await this.service.findConnection<AuctionWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<AuctionConnection>;
  }

  @FieldResolver(() => Bid)
  async bids(@Root() r: Auction, @Ctx() ctx: BaseContext): Promise<Bid[] | null> {
    return ctx.dataLoader.loaders.Auction.bids.load(r);
  }

  @FieldResolver(() => ParachainLeases)
  async parachainLeases(@Root() r: Auction, @Ctx() ctx: BaseContext): Promise<ParachainLeases[] | null> {
    return ctx.dataLoader.loaders.Auction.parachainLeases.load(r);
  }

  @FieldResolver(() => AuctionParachain)
  async auctionparachainauction(@Root() r: Auction, @Ctx() ctx: BaseContext): Promise<AuctionParachain[] | null> {
    return ctx.dataLoader.loaders.Auction.auctionparachainauction.load(r);
  }

  @FieldResolver(() => Chronicle)
  async chroniclecurAuction(@Root() r: Auction, @Ctx() ctx: BaseContext): Promise<Chronicle[] | null> {
    return ctx.dataLoader.loaders.Auction.chroniclecurAuction.load(r);
  }
}
