import { Service, Inject } from 'typedi';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput, HydraBaseService } from '@subsquid/warthog';

import { Contribution } from './contribution.model';

import { ContributionWhereArgs, ContributionWhereInput } from '../../warthog';

import { Parachain } from '../parachain/parachain.model';
import { ParachainService } from '../parachain/parachain.service';
import { Crowdloan } from '../crowdloan/crowdloan.model';
import { CrowdloanService } from '../crowdloan/crowdloan.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('ContributionService')
export class ContributionService extends HydraBaseService<Contribution> {
  @Inject('ParachainService')
  public readonly parachainService!: ParachainService;
  @Inject('CrowdloanService')
  public readonly fundService!: CrowdloanService;

  constructor(@InjectRepository(Contribution) protected readonly repository: Repository<Contribution>) {
    super(Contribution, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Contribution[]> {
    return this.findWithRelations<W>(where, orderBy, limit, offset, fields);
  }

  findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Contribution[]> {
    return this.buildFindWithRelationsQuery(_where, orderBy, limit, offset, fields).getMany();
  }

  buildFindWithRelationsQuery<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): SelectQueryBuilder<Contribution> {
    const where = <ContributionWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders
    const { parachain } = where;
    delete where.parachain;

    // remove relation filters to enable warthog query builders
    const { fund } = where;
    delete where.fund;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    if (parachain) {
      // OTO or MTO
      const parachainQuery = this.parachainService
        .buildFindQueryWithParams(<any>parachain, undefined, undefined, ['id'], 'parachain')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"contribution"."parachain_id" IN (${parachainQuery.getQuery()})`);

      parameters = { ...parameters, ...parachainQuery.getParameters() };
    }

    if (fund) {
      // OTO or MTO
      const fundQuery = this.fundService
        .buildFindQueryWithParams(<any>fund, undefined, undefined, ['id'], 'fund')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"contribution"."fund_id" IN (${fundQuery.getQuery()})`);

      parameters = { ...parameters, ...fundQuery.getParameters() };
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery.take(limit || 50).skip(offset || 0);
  }
}
