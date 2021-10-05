import { Service, Inject } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput, HydraBaseService } from '@subsquid/warthog';

import { ParachainLeases } from './parachain-leases.model';

import { ParachainLeasesWhereArgs, ParachainLeasesWhereInput } from '../../warthog';

import { Parachain } from '../parachain/parachain.model';
import { ParachainService } from '../parachain/parachain.service';
import { Auction } from '../auction/auction.model';
import { AuctionService } from '../auction/auction.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('ParachainLeasesService')
export class ParachainLeasesService extends HydraBaseService<ParachainLeases> {
  @Inject('ParachainService')
  public readonly parachainService!: ParachainService;
  @Inject('AuctionService')
  public readonly auctionService!: AuctionService;

  constructor(@InjectRepository(ParachainLeases) protected readonly repository: Repository<ParachainLeases>) {
    super(ParachainLeases, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<ParachainLeases[]> {
    return this.findWithRelations<W>(where, orderBy, limit, offset, fields);
  }

  findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<ParachainLeases[]> {
    return this.buildFindWithRelationsQuery(_where, orderBy, limit, offset, fields).getMany();
  }

  buildFindWithRelationsQuery<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): SelectQueryBuilder<ParachainLeases> {
    const where = <ParachainLeasesWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders
    const { parachain } = where;
    delete where.parachain;

    // remove relation filters to enable warthog query builders
    const { auction } = where;
    delete where.auction;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    if (parachain) {
      // OTO or MTO
      const parachainQuery = this.parachainService
        .buildFindQueryWithParams(<any>parachain, undefined, undefined, ['id'], 'parachain')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"parachainleases"."parachain_id" IN (${parachainQuery.getQuery()})`);

      parameters = { ...parameters, ...parachainQuery.getParameters() };
    }

    if (auction) {
      // OTO or MTO
      const auctionQuery = this.auctionService
        .buildFindQueryWithParams(<any>auction, undefined, undefined, ['id'], 'auction')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"parachainleases"."auction_id" IN (${auctionQuery.getQuery()})`);

      parameters = { ...parameters, ...auctionQuery.getParameters() };
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery.take(limit || 50).skip(offset || 0);
  }
}
