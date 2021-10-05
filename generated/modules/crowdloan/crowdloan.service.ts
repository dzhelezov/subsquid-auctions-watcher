import { Service, Inject } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput, HydraBaseService } from '@subsquid/warthog';

import { Crowdloan } from './crowdloan.model';

import { CrowdloanWhereArgs, CrowdloanWhereInput } from '../../warthog';

import { Parachain } from '../parachain/parachain.model';
import { ParachainService } from '../parachain/parachain.service';
import { Contribution } from '../contribution/contribution.model';
import { ContributionService } from '../contribution/contribution.service';
import { Bid } from '../bid/bid.model';
import { BidService } from '../bid/bid.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('CrowdloanService')
export class CrowdloanService extends HydraBaseService<Crowdloan> {
  @Inject('ParachainService')
  public readonly parachainService!: ParachainService;
  @Inject('ContributionService')
  public readonly contributionsService!: ContributionService;
  @Inject('BidService')
  public readonly bidfundService!: BidService;
  @Inject('ParachainService')
  public readonly parachainactiveFundService!: ParachainService;

  constructor(@InjectRepository(Crowdloan) protected readonly repository: Repository<Crowdloan>) {
    super(Crowdloan, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Crowdloan[]> {
    return this.findWithRelations<W>(where, orderBy, limit, offset, fields);
  }

  findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Crowdloan[]> {
    return this.buildFindWithRelationsQuery(_where, orderBy, limit, offset, fields).getMany();
  }

  buildFindWithRelationsQuery<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): SelectQueryBuilder<Crowdloan> {
    const where = <CrowdloanWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders
    const { parachain } = where;
    delete where.parachain;

    // remove relation filters to enable warthog query builders

    const { contributions_some, contributions_none, contributions_every } = where;

    if (+!!contributions_some + +!!contributions_none + +!!contributions_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.contributions_some;
    delete where.contributions_none;
    delete where.contributions_every;
    // remove relation filters to enable warthog query builders

    const { bidfund_some, bidfund_none, bidfund_every } = where;

    if (+!!bidfund_some + +!!bidfund_none + +!!bidfund_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.bidfund_some;
    delete where.bidfund_none;
    delete where.bidfund_every;
    // remove relation filters to enable warthog query builders

    const { parachainactiveFund_some, parachainactiveFund_none, parachainactiveFund_every } = where;

    if (+!!parachainactiveFund_some + +!!parachainactiveFund_none + +!!parachainactiveFund_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.parachainactiveFund_some;
    delete where.parachainactiveFund_none;
    delete where.parachainactiveFund_every;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    if (parachain) {
      // OTO or MTO
      const parachainQuery = this.parachainService
        .buildFindQueryWithParams(<any>parachain, undefined, undefined, ['id'], 'parachain')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"crowdloan"."parachain_id" IN (${parachainQuery.getQuery()})`);

      parameters = { ...parameters, ...parachainQuery.getParameters() };
    }

    const contributionsFilter = contributions_some || contributions_none || contributions_every;

    if (contributionsFilter) {
      const contributionsQuery = this.contributionsService
        .buildFindQueryWithParams(<any>contributionsFilter, undefined, undefined, ['id'], 'contributions')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...contributionsQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'crowdloan.contributions',
          'contributions_filtered',
          `contributions_filtered.id IN (${contributionsQuery.getQuery()})`
        )
        .groupBy('crowdloan_id')
        .addSelect('count(contributions_filtered.id)', 'cnt_filtered')
        .addSelect('crowdloan.id', 'crowdloan_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('crowdloan.contributions', 'contributions_total')
        .groupBy('crowdloan_id')
        .addSelect('count(contributions_total.id)', 'cnt_total')
        .addSelect('crowdloan.id', 'crowdloan_id');

      const subQuery = `
                SELECT
                    f.crowdloan_id crowdloan_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.crowdloan_id = f.crowdloan_id`;

      if (contributions_none) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    contributions_subq.crowdloan_id
                FROM
                    (${subQuery}) contributions_subq
                WHERE
                    contributions_subq.cnt_filtered = 0
                )`);
      }

      if (contributions_some) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    contributions_subq.crowdloan_id
                FROM
                    (${subQuery}) contributions_subq
                WHERE
                    contributions_subq.cnt_filtered > 0
                )`);
      }

      if (contributions_every) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    contributions_subq.crowdloan_id
                FROM
                    (${subQuery}) contributions_subq
                WHERE
                    contributions_subq.cnt_filtered > 0
                    AND contributions_subq.cnt_filtered = contributions_subq.cnt_total
                )`);
      }
    }

    const bidfundFilter = bidfund_some || bidfund_none || bidfund_every;

    if (bidfundFilter) {
      const bidfundQuery = this.bidfundService
        .buildFindQueryWithParams(<any>bidfundFilter, undefined, undefined, ['id'], 'bidfund')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...bidfundQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin('crowdloan.bidfund', 'bidfund_filtered', `bidfund_filtered.id IN (${bidfundQuery.getQuery()})`)
        .groupBy('crowdloan_id')
        .addSelect('count(bidfund_filtered.id)', 'cnt_filtered')
        .addSelect('crowdloan.id', 'crowdloan_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('crowdloan.bidfund', 'bidfund_total')
        .groupBy('crowdloan_id')
        .addSelect('count(bidfund_total.id)', 'cnt_total')
        .addSelect('crowdloan.id', 'crowdloan_id');

      const subQuery = `
                SELECT
                    f.crowdloan_id crowdloan_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.crowdloan_id = f.crowdloan_id`;

      if (bidfund_none) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    bidfund_subq.crowdloan_id
                FROM
                    (${subQuery}) bidfund_subq
                WHERE
                    bidfund_subq.cnt_filtered = 0
                )`);
      }

      if (bidfund_some) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    bidfund_subq.crowdloan_id
                FROM
                    (${subQuery}) bidfund_subq
                WHERE
                    bidfund_subq.cnt_filtered > 0
                )`);
      }

      if (bidfund_every) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    bidfund_subq.crowdloan_id
                FROM
                    (${subQuery}) bidfund_subq
                WHERE
                    bidfund_subq.cnt_filtered > 0
                    AND bidfund_subq.cnt_filtered = bidfund_subq.cnt_total
                )`);
      }
    }

    const parachainactiveFundFilter = parachainactiveFund_some || parachainactiveFund_none || parachainactiveFund_every;

    if (parachainactiveFundFilter) {
      const parachainactiveFundQuery = this.parachainactiveFundService
        .buildFindQueryWithParams(<any>parachainactiveFundFilter, undefined, undefined, ['id'], 'parachainactiveFund')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...parachainactiveFundQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'crowdloan.parachainactiveFund',
          'parachainactiveFund_filtered',
          `parachainactiveFund_filtered.id IN (${parachainactiveFundQuery.getQuery()})`
        )
        .groupBy('crowdloan_id')
        .addSelect('count(parachainactiveFund_filtered.id)', 'cnt_filtered')
        .addSelect('crowdloan.id', 'crowdloan_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('crowdloan.parachainactiveFund', 'parachainactiveFund_total')
        .groupBy('crowdloan_id')
        .addSelect('count(parachainactiveFund_total.id)', 'cnt_total')
        .addSelect('crowdloan.id', 'crowdloan_id');

      const subQuery = `
                SELECT
                    f.crowdloan_id crowdloan_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.crowdloan_id = f.crowdloan_id`;

      if (parachainactiveFund_none) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    parachainactiveFund_subq.crowdloan_id
                FROM
                    (${subQuery}) parachainactiveFund_subq
                WHERE
                    parachainactiveFund_subq.cnt_filtered = 0
                )`);
      }

      if (parachainactiveFund_some) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    parachainactiveFund_subq.crowdloan_id
                FROM
                    (${subQuery}) parachainactiveFund_subq
                WHERE
                    parachainactiveFund_subq.cnt_filtered > 0
                )`);
      }

      if (parachainactiveFund_every) {
        mainQuery = mainQuery.andWhere(`crowdloan.id IN
                (SELECT
                    parachainactiveFund_subq.crowdloan_id
                FROM
                    (${subQuery}) parachainactiveFund_subq
                WHERE
                    parachainactiveFund_subq.cnt_filtered > 0
                    AND parachainactiveFund_subq.cnt_filtered = parachainactiveFund_subq.cnt_total
                )`);
      }
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery.take(limit || 50).skip(offset || 0);
  }
}
