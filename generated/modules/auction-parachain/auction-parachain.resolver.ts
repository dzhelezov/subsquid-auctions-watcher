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
  AuctionParachainCreateInput,
  AuctionParachainCreateManyArgs,
  AuctionParachainUpdateArgs,
  AuctionParachainWhereArgs,
  AuctionParachainWhereInput,
  AuctionParachainWhereUniqueInput,
  AuctionParachainOrderByEnum,
} from '../../warthog';

import { AuctionParachain } from './auction-parachain.model';
import { AuctionParachainService } from './auction-parachain.service';

import { Auction } from '../auction/auction.model';
import { AuctionService } from '../auction/auction.service';
import { Parachain } from '../parachain/parachain.model';
import { ParachainService } from '../parachain/parachain.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@ObjectType()
export class AuctionParachainEdge {
  @Field(() => AuctionParachain, { nullable: false })
  node!: AuctionParachain;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class AuctionParachainConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [AuctionParachainEdge], { nullable: false })
  edges!: AuctionParachainEdge[];

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
export class AuctionParachainConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => AuctionParachainWhereInput, { nullable: true })
  where?: AuctionParachainWhereInput;

  @Field(() => AuctionParachainOrderByEnum, { nullable: true })
  orderBy?: [AuctionParachainOrderByEnum];
}

@Resolver(AuctionParachain)
export class AuctionParachainResolver {
  constructor(@Inject('AuctionParachainService') public readonly service: AuctionParachainService) {}

  @Query(() => [AuctionParachain])
  async auctionParachains(
    @Args() { where, orderBy, limit, offset }: AuctionParachainWhereArgs,
    @Fields() fields: string[]
  ): Promise<AuctionParachain[]> {
    return this.service.find<AuctionParachainWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => AuctionParachain, { nullable: true })
  async auctionParachainByUniqueInput(
    @Arg('where') where: AuctionParachainWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<AuctionParachain | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => AuctionParachainConnection)
  async auctionParachainsConnection(
    @Args() { where, orderBy, ...pageOptions }: AuctionParachainConnectionWhereArgs,
    @Info() info: any
  ): Promise<AuctionParachainConnection> {
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
      result = await this.service.findConnection<AuctionParachainWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<AuctionParachainConnection>;
  }

  @FieldResolver(() => Auction)
  async auction(@Root() r: AuctionParachain, @Ctx() ctx: BaseContext): Promise<Auction | null> {
    return ctx.dataLoader.loaders.AuctionParachain.auction.load(r);
  }

  @FieldResolver(() => Parachain)
  async parachain(@Root() r: AuctionParachain, @Ctx() ctx: BaseContext): Promise<Parachain | null> {
    return ctx.dataLoader.loaders.AuctionParachain.parachain.load(r);
  }
}
