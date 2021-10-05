import { Service, Inject } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput, HydraBaseService } from '@subsquid/warthog';

import { Chronicle } from './chronicle.model';

import { ChronicleWhereArgs, ChronicleWhereInput } from '../../warthog';

import { Auction } from '../auction/auction.model';
import { AuctionService } from '../auction/auction.service';
import { Parachain } from '../parachain/parachain.model';
import { ParachainService } from '../parachain/parachain.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('ChronicleService')
export class ChronicleService extends HydraBaseService<Chronicle> {
  @Inject('AuctionService')
  public readonly curAuctionService!: AuctionService;
  @Inject('ParachainService')
  public readonly parachainsService!: ParachainService;

  constructor(@InjectRepository(Chronicle) protected readonly repository: Repository<Chronicle>) {
    super(Chronicle, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Chronicle[]> {
    return this.findWithRelations<W>(where, orderBy, limit, offset, fields);
  }

  findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Chronicle[]> {
    return this.buildFindWithRelationsQuery(_where, orderBy, limit, offset, fields).getMany();
  }

  buildFindWithRelationsQuery<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): SelectQueryBuilder<Chronicle> {
    const where = <ChronicleWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders
    const { curAuction } = where;
    delete where.curAuction;

    // remove relation filters to enable warthog query builders

    const { parachains_some, parachains_none, parachains_every } = where;

    if (+!!parachains_some + +!!parachains_none + +!!parachains_every > 1) {
      throw new Error(`A query can have at most one of none, some, every clauses on a relation field`);
    }

    delete where.parachains_some;
    delete where.parachains_none;
    delete where.parachains_every;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    if (curAuction) {
      // OTO or MTO
      const curAuctionQuery = this.curAuctionService
        .buildFindQueryWithParams(<any>curAuction, undefined, undefined, ['id'], 'curAuction')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"chronicle"."cur_auction_id" IN (${curAuctionQuery.getQuery()})`);

      parameters = { ...parameters, ...curAuctionQuery.getParameters() };
    }

    const parachainsFilter = parachains_some || parachains_none || parachains_every;

    if (parachainsFilter) {
      const parachainsQuery = this.parachainsService
        .buildFindQueryWithParams(<any>parachainsFilter, undefined, undefined, ['id'], 'parachains')
        .take(undefined); //remove the default LIMIT

      parameters = { ...parameters, ...parachainsQuery.getParameters() };

      const subQueryFiltered = this.getQueryBuilder()
        .select([])
        .leftJoin(
          'chronicle.parachains',
          'parachains_filtered',
          `parachains_filtered.id IN (${parachainsQuery.getQuery()})`
        )
        .groupBy('chronicle_id')
        .addSelect('count(parachains_filtered.id)', 'cnt_filtered')
        .addSelect('chronicle.id', 'chronicle_id');

      const subQueryTotal = this.getQueryBuilder()
        .select([])
        .leftJoin('chronicle.parachains', 'parachains_total')
        .groupBy('chronicle_id')
        .addSelect('count(parachains_total.id)', 'cnt_total')
        .addSelect('chronicle.id', 'chronicle_id');

      const subQuery = `
                SELECT
                    f.chronicle_id chronicle_id, f.cnt_filtered cnt_filtered, t.cnt_total cnt_total
                FROM
                    (${subQueryTotal.getQuery()}) t, (${subQueryFiltered.getQuery()}) f
                WHERE
                    t.chronicle_id = f.chronicle_id`;

      if (parachains_none) {
        mainQuery = mainQuery.andWhere(`chronicle.id IN
                (SELECT
                    parachains_subq.chronicle_id
                FROM
                    (${subQuery}) parachains_subq
                WHERE
                    parachains_subq.cnt_filtered = 0
                )`);
      }

      if (parachains_some) {
        mainQuery = mainQuery.andWhere(`chronicle.id IN
                (SELECT
                    parachains_subq.chronicle_id
                FROM
                    (${subQuery}) parachains_subq
                WHERE
                    parachains_subq.cnt_filtered > 0
                )`);
      }

      if (parachains_every) {
        mainQuery = mainQuery.andWhere(`chronicle.id IN
                (SELECT
                    parachains_subq.chronicle_id
                FROM
                    (${subQuery}) parachains_subq
                WHERE
                    parachains_subq.cnt_filtered > 0
                    AND parachains_subq.cnt_filtered = parachains_subq.cnt_total
                )`);
      }
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery.take(limit || 50).skip(offset || 0);
  }
}
