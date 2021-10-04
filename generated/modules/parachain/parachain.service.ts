import { Service, Inject } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput, HydraBaseService } from '@subsquid/warthog';

import { Parachain } from './parachain.model';

import { ParachainWhereArgs, ParachainWhereInput } from '../../warthog';

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

@Service('ParachainService')
export class ParachainService extends HydraBaseService<Parachain> {
  @Inject('ParachainLeasesService')
  public readonly leasesService!: ParachainLeasesService;
  @Inject('BidService')
  public readonly bidsService!: BidService;
  @Inject('CrowdloanService')
  public readonly fundsService!: CrowdloanService;
  @Inject('ChronicleService')
  public readonly chronicleService!: ChronicleService;
  @Inject('AuctionParachainService')
  public readonly auctionparachainparachainService!: AuctionParachainService;
  @Inject('ContributionService')
  public readonly contributionparachainService!: ContributionService;

  constructor(@InjectRepository(Parachain) protected readonly repository: Repository<Parachain>) {
    super(Parachain, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Parachain[]> {
    return this.findWithRelations<W>(where, orderBy, limit, offset, fields);
  }

  findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Parachain[]> {
    return this.buildFindWithRelationsQuery(_where, orderBy, limit, offset, fields).getMany();
  }

  buildFindWithRelationsQuery<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): SelectQueryBuilder<Parachain> {
    const where = <ParachainWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders

    const { leases_some, leases_none, leases_every } = where;

    if (+!!leases_some + +!!leases_none + +!!leases_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.leases_some;
    delete where.leases_none;
    delete where.leases_every;
    // remove relation filters to enable warthog query builders

    const { bids_some, bids_none, bids_every } = where;

    if (+!!bids_some + +!!bids_none + +!!bids_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.bids_some;
    delete where.bids_none;
    delete where.bids_every;
    // remove relation filters to enable warthog query builders

    const { funds_some, funds_none, funds_every } = where;

    if (+!!funds_some + +!!funds_none + +!!funds_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.funds_some;
    delete where.funds_none;
    delete where.funds_every;
    // remove relation filters to enable warthog query builders
    const { chronicle } = where;
    delete where.chronicle;

    // remove relation filters to enable warthog query builders

    const { auctionparachainparachain_some, auctionparachainparachain_none, auctionparachainparachain_every } = where;

    if (
      +!!auctionparachainparachain_some + +!!auctionparachainparachain_none + +!!auctionparachainparachain_every >
      1
    ) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.auctionparachainparachain_some;
    delete where.auctionparachainparachain_none;
    delete where.auctionparachainparachain_every;
    // remove relation filters to enable warthog query builders

    const { contributionparachain_some, contributionparachain_none, contributionparachain_every } = where;

    if (+!!contributionparachain_some + +!!contributionparachain_none + +!!contributionparachain_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.contributionparachain_some;
    delete where.contributionparachain_none;
    delete where.contributionparachain_every;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    const leasesFilter = leases_some || leases_none || leases_every;

    if (leasesFilter) {
      const leasesQuery = this.leasesService
        .buildFindQueryWithParams(<any>leasesFilter, undefined, undefined, ['id'], 'leases')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...leasesQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin('parachain.leases', 'leases_filtered', `leases_filtered.id IN (${leasesQuery.getQuery()})`)
        .groupBy('parachain_id')
        .addSelect('count(leases_filtered.id)', 'cnt_filtered')
        .addSelect('parachain.id', 'parachain_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('parachain.leases', 'leases_total')
        .groupBy('parachain_id')
        .addSelect('count(leases_total.id)', 'cnt_total')
        .addSelect('parachain.id', 'parachain_id');

      const subQuery = `
                SELECT
                    f.parachain_id parachain_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.parachain_id = f.parachain_id`;

      if (leases_none) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    leases_subq.parachain_id
                FROM
                    (${subQuery}) leases_subq
                WHERE
                    leases_subq.cnt_filtered = 0
                )`);
      }

      if (leases_some) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    leases_subq.parachain_id
                FROM
                    (${subQuery}) leases_subq
                WHERE
                    leases_subq.cnt_filtered > 0
                )`);
      }

      if (leases_every) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    leases_subq.parachain_id
                FROM
                    (${subQuery}) leases_subq
                WHERE
                    leases_subq.cnt_filtered > 0
                    AND leases_subq.cnt_filtered = leases_subq.cnt_total
                )`);
      }
    }

    const bidsFilter = bids_some || bids_none || bids_every;

    if (bidsFilter) {
      const bidsQuery = this.bidsService
        .buildFindQueryWithParams(<any>bidsFilter, undefined, undefined, ['id'], 'bids')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...bidsQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin('parachain.bids', 'bids_filtered', `bids_filtered.id IN (${bidsQuery.getQuery()})`)
        .groupBy('parachain_id')
        .addSelect('count(bids_filtered.id)', 'cnt_filtered')
        .addSelect('parachain.id', 'parachain_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('parachain.bids', 'bids_total')
        .groupBy('parachain_id')
        .addSelect('count(bids_total.id)', 'cnt_total')
        .addSelect('parachain.id', 'parachain_id');

      const subQuery = `
                SELECT
                    f.parachain_id parachain_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.parachain_id = f.parachain_id`;

      if (bids_none) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    bids_subq.parachain_id
                FROM
                    (${subQuery}) bids_subq
                WHERE
                    bids_subq.cnt_filtered = 0
                )`);
      }

      if (bids_some) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    bids_subq.parachain_id
                FROM
                    (${subQuery}) bids_subq
                WHERE
                    bids_subq.cnt_filtered > 0
                )`);
      }

      if (bids_every) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    bids_subq.parachain_id
                FROM
                    (${subQuery}) bids_subq
                WHERE
                    bids_subq.cnt_filtered > 0
                    AND bids_subq.cnt_filtered = bids_subq.cnt_total
                )`);
      }
    }

    const fundsFilter = funds_some || funds_none || funds_every;

    if (fundsFilter) {
      const fundsQuery = this.fundsService
        .buildFindQueryWithParams(<any>fundsFilter, undefined, undefined, ['id'], 'funds')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...fundsQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin('parachain.funds', 'funds_filtered', `funds_filtered.id IN (${fundsQuery.getQuery()})`)
        .groupBy('parachain_id')
        .addSelect('count(funds_filtered.id)', 'cnt_filtered')
        .addSelect('parachain.id', 'parachain_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('parachain.funds', 'funds_total')
        .groupBy('parachain_id')
        .addSelect('count(funds_total.id)', 'cnt_total')
        .addSelect('parachain.id', 'parachain_id');

      const subQuery = `
                SELECT
                    f.parachain_id parachain_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.parachain_id = f.parachain_id`;

      if (funds_none) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    funds_subq.parachain_id
                FROM
                    (${subQuery}) funds_subq
                WHERE
                    funds_subq.cnt_filtered = 0
                )`);
      }

      if (funds_some) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    funds_subq.parachain_id
                FROM
                    (${subQuery}) funds_subq
                WHERE
                    funds_subq.cnt_filtered > 0
                )`);
      }

      if (funds_every) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    funds_subq.parachain_id
                FROM
                    (${subQuery}) funds_subq
                WHERE
                    funds_subq.cnt_filtered > 0
                    AND funds_subq.cnt_filtered = funds_subq.cnt_total
                )`);
      }
    }

    if (chronicle) {
      // OTO or MTO
      const chronicleQuery = this.chronicleService
        .buildFindQueryWithParams(<any>chronicle, undefined, undefined, ['id'], 'chronicle')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"parachain"."chronicle_id" IN (${chronicleQuery.getQuery()})`);

      parameters = { ...parameters, ...chronicleQuery.getParameters() };
    }

    const auctionparachainparachainFilter =
      auctionparachainparachain_some || auctionparachainparachain_none || auctionparachainparachain_every;

    if (auctionparachainparachainFilter) {
      const auctionparachainparachainQuery = this.auctionparachainparachainService
        .buildFindQueryWithParams(
          <any>auctionparachainparachainFilter,
          undefined,
          undefined,
          ['id'],
          'auctionparachainparachain'
        )
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...auctionparachainparachainQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'parachain.auctionparachainparachain',
          'auctionparachainparachain_filtered',
          `auctionparachainparachain_filtered.id IN (${auctionparachainparachainQuery.getQuery()})`
        )
        .groupBy('parachain_id')
        .addSelect('count(auctionparachainparachain_filtered.id)', 'cnt_filtered')
        .addSelect('parachain.id', 'parachain_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('parachain.auctionparachainparachain', 'auctionparachainparachain_total')
        .groupBy('parachain_id')
        .addSelect('count(auctionparachainparachain_total.id)', 'cnt_total')
        .addSelect('parachain.id', 'parachain_id');

      const subQuery = `
                SELECT
                    f.parachain_id parachain_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.parachain_id = f.parachain_id`;

      if (auctionparachainparachain_none) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    auctionparachainparachain_subq.parachain_id
                FROM
                    (${subQuery}) auctionparachainparachain_subq
                WHERE
                    auctionparachainparachain_subq.cnt_filtered = 0
                )`);
      }

      if (auctionparachainparachain_some) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    auctionparachainparachain_subq.parachain_id
                FROM
                    (${subQuery}) auctionparachainparachain_subq
                WHERE
                    auctionparachainparachain_subq.cnt_filtered > 0
                )`);
      }

      if (auctionparachainparachain_every) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    auctionparachainparachain_subq.parachain_id
                FROM
                    (${subQuery}) auctionparachainparachain_subq
                WHERE
                    auctionparachainparachain_subq.cnt_filtered > 0
                    AND auctionparachainparachain_subq.cnt_filtered = auctionparachainparachain_subq.cnt_total
                )`);
      }
    }

    const contributionparachainFilter =
      contributionparachain_some || contributionparachain_none || contributionparachain_every;

    if (contributionparachainFilter) {
      const contributionparachainQuery = this.contributionparachainService
        .buildFindQueryWithParams(
          <any>contributionparachainFilter,
          undefined,
          undefined,
          ['id'],
          'contributionparachain'
        )
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...contributionparachainQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'parachain.contributionparachain',
          'contributionparachain_filtered',
          `contributionparachain_filtered.id IN (${contributionparachainQuery.getQuery()})`
        )
        .groupBy('parachain_id')
        .addSelect('count(contributionparachain_filtered.id)', 'cnt_filtered')
        .addSelect('parachain.id', 'parachain_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('parachain.contributionparachain', 'contributionparachain_total')
        .groupBy('parachain_id')
        .addSelect('count(contributionparachain_total.id)', 'cnt_total')
        .addSelect('parachain.id', 'parachain_id');

      const subQuery = `
                SELECT
                    f.parachain_id parachain_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.parachain_id = f.parachain_id`;

      if (contributionparachain_none) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    contributionparachain_subq.parachain_id
                FROM
                    (${subQuery}) contributionparachain_subq
                WHERE
                    contributionparachain_subq.cnt_filtered = 0
                )`);
      }

      if (contributionparachain_some) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    contributionparachain_subq.parachain_id
                FROM
                    (${subQuery}) contributionparachain_subq
                WHERE
                    contributionparachain_subq.cnt_filtered > 0
                )`);
      }

      if (contributionparachain_every) {
        mainQuery = mainQuery.andWhere(`parachain.id IN
                (SELECT
                    contributionparachain_subq.parachain_id
                FROM
                    (${subQuery}) contributionparachain_subq
                WHERE
                    contributionparachain_subq.cnt_filtered > 0
                    AND contributionparachain_subq.cnt_filtered = contributionparachain_subq.cnt_total
                )`);
      }
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery.take(limit || 50).skip(offset || 0);
  }
}
