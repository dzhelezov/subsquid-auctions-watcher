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
  CrowdloanSequenceCreateInput,
  CrowdloanSequenceCreateManyArgs,
  CrowdloanSequenceUpdateArgs,
  CrowdloanSequenceWhereArgs,
  CrowdloanSequenceWhereInput,
  CrowdloanSequenceWhereUniqueInput,
  CrowdloanSequenceOrderByEnum,
} from '../../warthog';

import { CrowdloanSequence } from './crowdloan-sequence.model';
import { CrowdloanSequenceService } from './crowdloan-sequence.service';

@ObjectType()
export class CrowdloanSequenceEdge {
  @Field(() => CrowdloanSequence, { nullable: false })
  node!: CrowdloanSequence;

  @Field(() => String, { nullable: false })
  cursor!: string;
}

@ObjectType()
export class CrowdloanSequenceConnection {
  @Field(() => Int, { nullable: false })
  totalCount!: number;

  @Field(() => [CrowdloanSequenceEdge], { nullable: false })
  edges!: CrowdloanSequenceEdge[];

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
export class CrowdloanSequenceConnectionWhereArgs extends ConnectionPageInputOptions {
  @Field(() => CrowdloanSequenceWhereInput, { nullable: true })
  where?: CrowdloanSequenceWhereInput;

  @Field(() => CrowdloanSequenceOrderByEnum, { nullable: true })
  orderBy?: [CrowdloanSequenceOrderByEnum];
}

@Resolver(CrowdloanSequence)
export class CrowdloanSequenceResolver {
  constructor(@Inject('CrowdloanSequenceService') public readonly service: CrowdloanSequenceService) {}

  @Query(() => [CrowdloanSequence])
  async crowdloanSequences(
    @Args() { where, orderBy, limit, offset }: CrowdloanSequenceWhereArgs,
    @Fields() fields: string[]
  ): Promise<CrowdloanSequence[]> {
    return this.service.find<CrowdloanSequenceWhereInput>(where, orderBy, limit, offset, fields);
  }

  @Query(() => CrowdloanSequence, { nullable: true })
  async crowdloanSequenceByUniqueInput(
    @Arg('where') where: CrowdloanSequenceWhereUniqueInput,
    @Fields() fields: string[]
  ): Promise<CrowdloanSequence | null> {
    const result = await this.service.find(where, undefined, 1, 0, fields);
    return result && result.length >= 1 ? result[0] : null;
  }

  @Query(() => CrowdloanSequenceConnection)
  async crowdloanSequencesConnection(
    @Args() { where, orderBy, ...pageOptions }: CrowdloanSequenceConnectionWhereArgs,
    @Info() info: any
  ): Promise<CrowdloanSequenceConnection> {
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
      result = await this.service.findConnection<CrowdloanSequenceWhereInput>(where, orderBy, pageOptions, rawFields);
    } catch (err: any) {
      console.log(err);
      // TODO: should continue to return this on `Error: Items is empty` or throw the error
      if (!(err.message as string).includes('Items is empty')) throw err;
    }

    return result as Promise<CrowdloanSequenceConnection>;
  }
}
