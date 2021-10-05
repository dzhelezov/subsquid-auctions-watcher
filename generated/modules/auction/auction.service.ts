import { Service, Inject } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput, HydraBaseService } from '@subsquid/warthog';

import { Auction } from './auction.model';

import { AuctionWhereArgs, AuctionWhereInput } from '../../warthog';

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

@Service('AuctionService')
export class AuctionService extends HydraBaseService<Auction> {
  @Inject('BidService')
  public readonly bidsService!: BidService;
  @Inject('ParachainLeasesService')
  public readonly parachainLeasesService!: ParachainLeasesService;
  @Inject('AuctionParachainService')
  public readonly auctionparachainauctionService!: AuctionParachainService;
  @Inject('ChronicleService')
  public readonly chroniclecurAuctionService!: ChronicleService;

  constructor(@InjectRepository(Auction) protected readonly repository: Repository<Auction>) {
    super(Auction, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Auction[]> {
    return this.findWithRelations<W>(where, orderBy, limit, offset, fields);
  }

  findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Auction[]> {
    return this.buildFindWithRelationsQuery(_where, orderBy, limit, offset, fields).getMany();
  }

  buildFindWithRelationsQuery<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): SelectQueryBuilder<Auction> {
    const where = <AuctionWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders

    const { bids_some, bids_none, bids_every } = where;

    if (+!!bids_some + +!!bids_none + +!!bids_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.bids_some;
    delete where.bids_none;
    delete where.bids_every;
    // remove relation filters to enable warthog query builders

    const { parachainLeases_some, parachainLeases_none, parachainLeases_every } = where;

    if (+!!parachainLeases_some + +!!parachainLeases_none + +!!parachainLeases_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.parachainLeases_some;
    delete where.parachainLeases_none;
    delete where.parachainLeases_every;
    // remove relation filters to enable warthog query builders

    const { auctionparachainauction_some, auctionparachainauction_none, auctionparachainauction_every } = where;

    if (+!!auctionparachainauction_some + +!!auctionparachainauction_none + +!!auctionparachainauction_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.auctionparachainauction_some;
    delete where.auctionparachainauction_none;
    delete where.auctionparachainauction_every;
    // remove relation filters to enable warthog query builders

    const { chroniclecurAuction_some, chroniclecurAuction_none, chroniclecurAuction_every } = where;

    if (+!!chroniclecurAuction_some + +!!chroniclecurAuction_none + +!!chroniclecurAuction_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.chroniclecurAuction_some;
    delete where.chroniclecurAuction_none;
    delete where.chroniclecurAuction_every;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    const bidsFilter = bids_some || bids_none || bids_every;

    if (bidsFilter) {
      const bidsQuery = this.bidsService
        .buildFindQueryWithParams(<any>bidsFilter, undefined, undefined, ['id'], 'bids')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...bidsQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin('auction.bids', 'bids_filtered', `bids_filtered.id IN (${bidsQuery.getQuery()})`)
        .groupBy('auction_id')
        .addSelect('count(bids_filtered.id)', 'cnt_filtered')
        .addSelect('auction.id', 'auction_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('auction.bids', 'bids_total')
        .groupBy('auction_id')
        .addSelect('count(bids_total.id)', 'cnt_total')
        .addSelect('auction.id', 'auction_id');

      const subQuery = `
                SELECT
                    f.auction_id auction_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.auction_id = f.auction_id`;

      if (bids_none) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    bids_subq.auction_id
                FROM
                    (${subQuery}) bids_subq
                WHERE
                    bids_subq.cnt_filtered = 0
                )`);
      }

      if (bids_some) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    bids_subq.auction_id
                FROM
                    (${subQuery}) bids_subq
                WHERE
                    bids_subq.cnt_filtered > 0
                )`);
      }

      if (bids_every) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    bids_subq.auction_id
                FROM
                    (${subQuery}) bids_subq
                WHERE
                    bids_subq.cnt_filtered > 0
                    AND bids_subq.cnt_filtered = bids_subq.cnt_total
                )`);
      }
    }

    const parachainLeasesFilter = parachainLeases_some || parachainLeases_none || parachainLeases_every;

    if (parachainLeasesFilter) {
      const parachainLeasesQuery = this.parachainLeasesService
        .buildFindQueryWithParams(<any>parachainLeasesFilter, undefined, undefined, ['id'], 'parachainLeases')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...parachainLeasesQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'auction.parachainLeases',
          'parachainLeases_filtered',
          `parachainLeases_filtered.id IN (${parachainLeasesQuery.getQuery()})`
        )
        .groupBy('auction_id')
        .addSelect('count(parachainLeases_filtered.id)', 'cnt_filtered')
        .addSelect('auction.id', 'auction_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('auction.parachainLeases', 'parachainLeases_total')
        .groupBy('auction_id')
        .addSelect('count(parachainLeases_total.id)', 'cnt_total')
        .addSelect('auction.id', 'auction_id');

      const subQuery = `
                SELECT
                    f.auction_id auction_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.auction_id = f.auction_id`;

      if (parachainLeases_none) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    parachainLeases_subq.auction_id
                FROM
                    (${subQuery}) parachainLeases_subq
                WHERE
                    parachainLeases_subq.cnt_filtered = 0
                )`);
      }

      if (parachainLeases_some) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    parachainLeases_subq.auction_id
                FROM
                    (${subQuery}) parachainLeases_subq
                WHERE
                    parachainLeases_subq.cnt_filtered > 0
                )`);
      }

      if (parachainLeases_every) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    parachainLeases_subq.auction_id
                FROM
                    (${subQuery}) parachainLeases_subq
                WHERE
                    parachainLeases_subq.cnt_filtered > 0
                    AND parachainLeases_subq.cnt_filtered = parachainLeases_subq.cnt_total
                )`);
      }
    }

    const auctionparachainauctionFilter =
      auctionparachainauction_some || auctionparachainauction_none || auctionparachainauction_every;

    if (auctionparachainauctionFilter) {
      const auctionparachainauctionQuery = this.auctionparachainauctionService
        .buildFindQueryWithParams(
          <any>auctionparachainauctionFilter,
          undefined,
          undefined,
          ['id'],
          'auctionparachainauction'
        )
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...auctionparachainauctionQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'auction.auctionparachainauction',
          'auctionparachainauction_filtered',
          `auctionparachainauction_filtered.id IN (${auctionparachainauctionQuery.getQuery()})`
        )
        .groupBy('auction_id')
        .addSelect('count(auctionparachainauction_filtered.id)', 'cnt_filtered')
        .addSelect('auction.id', 'auction_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('auction.auctionparachainauction', 'auctionparachainauction_total')
        .groupBy('auction_id')
        .addSelect('count(auctionparachainauction_total.id)', 'cnt_total')
        .addSelect('auction.id', 'auction_id');

      const subQuery = `
                SELECT
                    f.auction_id auction_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.auction_id = f.auction_id`;

      if (auctionparachainauction_none) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    auctionparachainauction_subq.auction_id
                FROM
                    (${subQuery}) auctionparachainauction_subq
                WHERE
                    auctionparachainauction_subq.cnt_filtered = 0
                )`);
      }

      if (auctionparachainauction_some) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    auctionparachainauction_subq.auction_id
                FROM
                    (${subQuery}) auctionparachainauction_subq
                WHERE
                    auctionparachainauction_subq.cnt_filtered > 0
                )`);
      }

      if (auctionparachainauction_every) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    auctionparachainauction_subq.auction_id
                FROM
                    (${subQuery}) auctionparachainauction_subq
                WHERE
                    auctionparachainauction_subq.cnt_filtered > 0
                    AND auctionparachainauction_subq.cnt_filtered = auctionparachainauction_subq.cnt_total
                )`);
      }
    }

    const chroniclecurAuctionFilter = chroniclecurAuction_some || chroniclecurAuction_none || chroniclecurAuction_every;

    if (chroniclecurAuctionFilter) {
      const chroniclecurAuctionQuery = this.chroniclecurAuctionService
        .buildFindQueryWithParams(<any>chroniclecurAuctionFilter, undefined, undefined, ['id'], 'chroniclecurAuction')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...chroniclecurAuctionQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'auction.chroniclecurAuction',
          'chroniclecurAuction_filtered',
          `chroniclecurAuction_filtered.id IN (${chroniclecurAuctionQuery.getQuery()})`
        )
        .groupBy('auction_id')
        .addSelect('count(chroniclecurAuction_filtered.id)', 'cnt_filtered')
        .addSelect('auction.id', 'auction_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('auction.chroniclecurAuction', 'chroniclecurAuction_total')
        .groupBy('auction_id')
        .addSelect('count(chroniclecurAuction_total.id)', 'cnt_total')
        .addSelect('auction.id', 'auction_id');

      const subQuery = `
                SELECT
                    f.auction_id auction_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.auction_id = f.auction_id`;

      if (chroniclecurAuction_none) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    chroniclecurAuction_subq.auction_id
                FROM
                    (${subQuery}) chroniclecurAuction_subq
                WHERE
                    chroniclecurAuction_subq.cnt_filtered = 0
                )`);
      }

      if (chroniclecurAuction_some) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    chroniclecurAuction_subq.auction_id
                FROM
                    (${subQuery}) chroniclecurAuction_subq
                WHERE
                    chroniclecurAuction_subq.cnt_filtered > 0
                )`);
      }

      if (chroniclecurAuction_every) {
        mainQuery = mainQuery.andWhere(`auction.id IN
                (SELECT
                    chroniclecurAuction_subq.auction_id
                FROM
                    (${subQuery}) chroniclecurAuction_subq
                WHERE
                    chroniclecurAuction_subq.cnt_filtered > 0
                    AND chroniclecurAuction_subq.cnt_filtered = chroniclecurAuction_subq.cnt_total
                )`);
      }
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery.take(limit || 50).skip(offset || 0);
  }
}
