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
  ParachainLeasesCreateInput,
  ParachainLeasesCreateManyArgs,
  ParachainLeasesUpdateArgs,
  ParachainLeasesWhereArgs,
  ParachainLeasesWhereInput,
  ParachainLeasesWhereUniqueInput,
  ParachainLeasesOrderByEnum,
} from '../../warthog';

import { ParachainLeases } from './parachain-leases.model';
import { ParachainLeasesService } from './parachain-leases.service';

import { Parachain } from '../parachain/parachain.model';
import { ParachainService } from '../parachain/parachain.service';
import { Auction } from '../auction/auction.model';
import { AuctionService } from '../auction/auction.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@ObjectType()
export class ParachainLeasesEdge {
  @Field(() => ParachainLeases, { nullable: false })
  node!: ParachainLeases;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class ParachainLeasesConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [ParachainLeasesEdge], { nullable: false })
  edges!: ParachainLeasesEdge[];

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
export class ParachainLeasesConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => ParachainLeasesWhereInput, { nullable: true })
  where?: ParachainLeasesWhereInput;

  @Field(() => ParachainLeasesOrderByEnum, { nullable: true })
  orderBy?: [ParachainLeasesOrderByEnum];
}

@Resolver(ParachainLeases)
export class ParachainLeasesResolver {
  constructor(@Inject('ParachainLeasesService') public readonly service: ParachainLeasesService) {}

  @Query(() => [ParachainLeases])
  async parachainLeases(
    @Args() { where, orderBy, limit, offset }: ParachainLeasesWhereArgs,
    @Fields() fields: string[]
  ): Promise<ParachainLeases[]> {
    return this.service.find<ParachainLeasesWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => ParachainLeases, { nullable: true })
  async parachainLeasesByUniqueInput(
    @Arg('where') where: ParachainLeasesWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<ParachainLeases | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => ParachainLeasesConnection)
  async parachainLeasesConnection(
    @Args() { where, orderBy, ...pageOptions }: ParachainLeasesConnectionWhereArgs,
    @Info() info: any
  ): Promise<ParachainLeasesConnection> {
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
      result = await this.service.findConnection<ParachainLeasesWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<ParachainLeasesConnection>;
  }

  @FieldResolver(() => Parachain)
  async parachain(@Root() r: ParachainLeases, @Ctx() ctx: BaseContext): Promise<Parachain | null> {
    return ctx.dataLoader.loaders.ParachainLeases.parachain.load(r);
  }

  @FieldResolver(() => Auction)
  async auction(@Root() r: ParachainLeases, @Ctx() ctx: BaseContext): Promise<Auction | null> {
    return ctx.dataLoader.loaders.ParachainLeases.auction.load(r);
  }
}
