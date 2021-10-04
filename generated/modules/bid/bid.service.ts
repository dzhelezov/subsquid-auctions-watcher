import { Service, Inject } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput, HydraBaseService } from '@subsquid/warthog';

import { Bid } from './bid.model';

import { BidWhereArgs, BidWhereInput } from '../../warthog';

import { Auction } from '../auction/auction.model';
import { AuctionService } from '../auction/auction.service';
import { Parachain } from '../parachain/parachain.model';
import { ParachainService } from '../parachain/parachain.service';
import { Crowdloan } from '../crowdloan/crowdloan.model';
import { CrowdloanService } from '../crowdloan/crowdloan.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('BidService')
export class BidService extends HydraBaseService<Bid> {
  @Inject('AuctionService')
  public readonly auctionService!: AuctionService;
  @Inject('ParachainService')
  public readonly parachainService!: ParachainService;
  @Inject('CrowdloanService')
  public readonly fundService!: CrowdloanService;

  constructor(@InjectRepository(Bid) protected readonly repository: Repository<Bid>) {
    super(Bid, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Bid[]> {
    return this.findWithRelations<W>(where, orderBy, limit, offset, fields);
  }

  findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Bid[]> {
    return this.buildFindWithRelationsQuery(_where, orderBy, limit, offset, fields).getMany();
  }

  buildFindWithRelationsQuery<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): SelectQueryBuilder<Bid> {
    const where = <BidWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders
    const { auction } = where;
    delete where.auction;

    // remove relation filters to enable warthog query builders
    const { parachain } = where;
    delete where.parachain;

    // remove relation filters to enable warthog query builders
    const { fund } = where;
    delete where.fund;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    if (auction) {
      // OTO or MTO
      const auctionQuery = this.auctionService
        .buildFindQueryWithParams(<any>auction, undefined, undefined, ['id'], 'auction')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"bid"."auction_id" IN (${auctionQuery.getQuery()})`);

      parameters = { ...parameters, ...auctionQuery.getParameters() };
    }

    if (parachain) {
      // OTO or MTO
      const parachainQuery = this.parachainService
        .buildFindQueryWithParams(<any>parachain, undefined, undefined, ['id'], 'parachain')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"bid"."parachain_id" IN (${parachainQuery.getQuery()})`);

      parameters = { ...parameters, ...parachainQuery.getParameters() };
    }

    if (fund) {
      // OTO or MTO
      const fundQuery = this.fundService
        .buildFindQueryWithParams(<any>fund, undefined, undefined, ['id'], 'fund')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"bid"."fund_id" IN (${fundQuery.getQuery()})`);

      parameters = { ...parameters, ...fundQuery.getParameters() };
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery.take(limit || 50).skip(offset || 0);
  }
}
