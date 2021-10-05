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
  ParachainCreateInput,
  ParachainCreateManyArgs,
  ParachainUpdateArgs,
  ParachainWhereArgs,
  ParachainWhereInput,
  ParachainWhereUniqueInput,
  ParachainOrderByEnum,
} from '../../warthog';

import { Parachain } from './parachain.model';
import { ParachainService } from './parachain.service';

import { ParachainLeases } from '../parachain-leases/parachain-leases.model';
import { ParachainLeasesService } from '../parachain-leases/parachain-leases.service';
import { Bid } from '../bid/bid.model';
import { BidService } from '../bid/bid.service';
import { Crowdloan } from '../crowdloan/crowdloan.model';
import { CrowdloanService } from '../crowdloan/crowdloan.service';
import { Chronicle } from '../chronicle/chronicle.model';
import { ChronicleService } from '../chronicle/chronicle.service';
import { AuctionParachain } from '../auction-parachain/auction-parachain.model';
import { AuctionParachainService } from '../auction-parachain/auction-parachain.service';
import { Contribution } from '../contribution/contribution.model';
import { ContributionService } from '../contribution/contribution.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@ObjectType()
export class ParachainEdge {
  @Field(() => Parachain, { nullable: false })
  node!: Parachain;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class ParachainConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [ParachainEdge], { nullable: false })
  edges!: ParachainEdge[];

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
export class ParachainConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => ParachainWhereInput, { nullable: true })
  where?: ParachainWhereInput;

  @Field(() => ParachainOrderByEnum, { nullable: true })
  orderBy?: [ParachainOrderByEnum];
}

@Resolver(Parachain)
export class ParachainResolver {
  constructor(@Inject('ParachainService') public readonly service: ParachainService) {}

  @Query(() => [Parachain])
  async parachains(
    @Args() { where, orderBy, limit, offset }: ParachainWhereArgs,
    @Fields() fields: string[]
  ): Promise<Parachain[]> {
    return this.service.find<ParachainWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => Parachain, { nullable: true })
  async parachainByUniqueInput(
    @Arg('where') where: ParachainWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<Parachain | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => ParachainConnection)
  async parachainsConnection(
    @Args() { where, orderBy, ...pageOptions }: ParachainConnectionWhereArgs,
    @Info() info: any
  ): Promise<ParachainConnection> {
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
      result = await this.service.findConnection<ParachainWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<ParachainConnection>;
  }

  @FieldResolver(() => ParachainLeases)
  async leases(@Root() r: Parachain, @Ctx() ctx: BaseContext): Promise<ParachainLeases[] | null> {
    return ctx.dataLoader.loaders.Parachain.leases.load(r);
  }

  @FieldResolver(() => Bid)
  async bids(@Root() r: Parachain, @Ctx() ctx: BaseContext): Promise<Bid[] | null> {
    return ctx.dataLoader.loaders.Parachain.bids.load(r);
  }

  @FieldResolver(() => Crowdloan)
  async funds(@Root() r: Parachain, @Ctx() ctx: BaseContext): Promise<Crowdloan[] | null> {
    return ctx.dataLoader.loaders.Parachain.funds.load(r);
  }

  @FieldResolver(() => Crowdloan)
  async activeFund(@Root() r: Parachain, @Ctx() ctx: BaseContext): Promise<Crowdloan | null> {
    return ctx.dataLoader.loaders.Parachain.activeFund.load(r);
  }

  @FieldResolver(() => Bid)
  async latestBid(@Root() r: Parachain, @Ctx() ctx: BaseContext): Promise<Bid | null> {
    return ctx.dataLoader.loaders.Parachain.latestBid.load(r);
  }

  @FieldResolver(() => Chronicle)
  async chronicle(@Root() r: Parachain, @Ctx() ctx: BaseContext): Promise<Chronicle | null> {
    return ctx.dataLoader.loaders.Parachain.chronicle.load(r);
  }

  @FieldResolver(() => AuctionParachain)
  async auctionparachainparachain(@Root() r: Parachain, @Ctx() ctx: BaseContext): Promise<AuctionParachain[] | null> {
    return ctx.dataLoader.loaders.Parachain.auctionparachainparachain.load(r);
  }

  @FieldResolver(() => Contribution)
  async contributionparachain(@Root() r: Parachain, @Ctx() ctx: BaseContext): Promise<Contribution[] | null> {
    return ctx.dataLoader.loaders.Parachain.contributionparachain.load(r);
  }
}
