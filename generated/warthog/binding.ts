import 'graphql-import-node'; // Needed so you can import *.graphql files 

import { makeBindingClass, Options } from 'graphql-binding'
import { GraphQLResolveInfo, GraphQLSchema } from 'graphql'
import { IResolvers } from 'graphql-tools/dist/Interfaces'
import * as schema from  './schema.graphql'

export interface Query {
    auctionParachains: <T = Array<AuctionParachain>>(args: { offset?: Int | null, limit?: Int | null, where?: AuctionParachainWhereInput | null, orderBy?: Array<AuctionParachainOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    auctionParachainByUniqueInput: <T = AuctionParachain | null>(args: { where: AuctionParachainWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    auctionParachainsConnection: <T = AuctionParachainConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: AuctionParachainWhereInput | null, orderBy?: Array<AuctionParachainOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    auctions: <T = Array<Auction>>(args: { offset?: Int | null, limit?: Int | null, where?: AuctionWhereInput | null, orderBy?: Array<AuctionOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    auctionByUniqueInput: <T = Auction | null>(args: { where: AuctionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    auctionsConnection: <T = AuctionConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: AuctionWhereInput | null, orderBy?: Array<AuctionOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    bids: <T = Array<Bid>>(args: { offset?: Int | null, limit?: Int | null, where?: BidWhereInput | null, orderBy?: Array<BidOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    bidByUniqueInput: <T = Bid | null>(args: { where: BidWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    bidsConnection: <T = BidConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: BidWhereInput | null, orderBy?: Array<BidOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    chronicles: <T = Array<Chronicle>>(args: { offset?: Int | null, limit?: Int | null, where?: ChronicleWhereInput | null, orderBy?: Array<ChronicleOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    chronicleByUniqueInput: <T = Chronicle | null>(args: { where: ChronicleWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    chroniclesConnection: <T = ChronicleConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: ChronicleWhereInput | null, orderBy?: Array<ChronicleOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    contributions: <T = Array<Contribution>>(args: { offset?: Int | null, limit?: Int | null, where?: ContributionWhereInput | null, orderBy?: Array<ContributionOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    contributionByUniqueInput: <T = Contribution | null>(args: { where: ContributionWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    contributionsConnection: <T = ContributionConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: ContributionWhereInput | null, orderBy?: Array<ContributionOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    crowdloanSequences: <T = Array<CrowdloanSequence>>(args: { offset?: Int | null, limit?: Int | null, where?: CrowdloanSequenceWhereInput | null, orderBy?: Array<CrowdloanSequenceOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    crowdloanSequenceByUniqueInput: <T = CrowdloanSequence | null>(args: { where: CrowdloanSequenceWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    crowdloanSequencesConnection: <T = CrowdloanSequenceConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: CrowdloanSequenceWhereInput | null, orderBy?: Array<CrowdloanSequenceOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    crowdloans: <T = Array<Crowdloan>>(args: { offset?: Int | null, limit?: Int | null, where?: CrowdloanWhereInput | null, orderBy?: Array<CrowdloanOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    crowdloanByUniqueInput: <T = Crowdloan | null>(args: { where: CrowdloanWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    crowdloansConnection: <T = CrowdloanConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: CrowdloanWhereInput | null, orderBy?: Array<CrowdloanOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    parachainLeases: <T = Array<ParachainLeases>>(args: { offset?: Int | null, limit?: Int | null, where?: ParachainLeasesWhereInput | null, orderBy?: Array<ParachainLeasesOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    parachainLeasesByUniqueInput: <T = ParachainLeases | null>(args: { where: ParachainLeasesWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    parachainLeasesConnection: <T = ParachainLeasesConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: ParachainLeasesWhereInput | null, orderBy?: Array<ParachainLeasesOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    parachains: <T = Array<Parachain>>(args: { offset?: Int | null, limit?: Int | null, where?: ParachainWhereInput | null, orderBy?: Array<ParachainOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> ,
    parachainByUniqueInput: <T = Parachain | null>(args: { where: ParachainWhereUniqueInput }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T | null> ,
    parachainsConnection: <T = ParachainConnection>(args: { first?: Int | null, after?: String | null, last?: Int | null, before?: String | null, where?: ParachainWhereInput | null, orderBy?: Array<ParachainOrderByInput> | null }, info?: GraphQLResolveInfo | string, options?: Options) => Promise<T> 
  }

export interface Mutation {}

export interface Subscription {
    stateSubscription: <T = ProcessorState>(args?: {}, info?: GraphQLResolveInfo | string, options?: Options) => Promise<AsyncIterator<T>> 
  }

export interface Binding {
  query: Query
  mutation: Mutation
  subscription: Subscription
  request: <T = any>(query: string, variables?: {[key: string]: any}) => Promise<T>
  delegate(operation: 'query' | 'mutation', fieldName: string, args: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<any>;
  delegateSubscription(fieldName: string, args?: {
      [key: string]: any;
  }, infoOrQuery?: GraphQLResolveInfo | string, options?: Options): Promise<AsyncIterator<any>>;
  getAbstractResolvers(filterSchema?: GraphQLSchema | string): IResolvers;
}

export interface BindingConstructor<T> {
  new(...args: any[]): T
}

export const Binding = makeBindingClass<BindingConstructor<Binding>>({ schema: schema as any })

/**
 * Types
*/

export type AuctionOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'blockNum_ASC' |
  'blockNum_DESC' |
  'status_ASC' |
  'status_DESC' |
  'leaseStart_ASC' |
  'leaseStart_DESC' |
  'slotsStart_ASC' |
  'slotsStart_DESC' |
  'leaseEnd_ASC' |
  'leaseEnd_DESC' |
  'slotsEnd_ASC' |
  'slotsEnd_DESC' |
  'closingStart_ASC' |
  'closingStart_DESC' |
  'closingEnd_ASC' |
  'closingEnd_DESC' |
  'resultBlock_ASC' |
  'resultBlock_DESC' |
  'ongoing_ASC' |
  'ongoing_DESC'

export type AuctionParachainOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'auction_ASC' |
  'auction_DESC' |
  'parachain_ASC' |
  'parachain_DESC' |
  'blockNum_ASC' |
  'blockNum_DESC' |
  'firstSlot_ASC' |
  'firstSlot_DESC' |
  'lastSlot_ASC' |
  'lastSlot_DESC'

export type BidOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'auction_ASC' |
  'auction_DESC' |
  'winningAuction_ASC' |
  'winningAuction_DESC' |
  'blockNum_ASC' |
  'blockNum_DESC' |
  'parachain_ASC' |
  'parachain_DESC' |
  'isCrowdloan_ASC' |
  'isCrowdloan_DESC' |
  'amount_ASC' |
  'amount_DESC' |
  'fund_ASC' |
  'fund_DESC' |
  'firstSlot_ASC' |
  'firstSlot_DESC' |
  'lastSlot_ASC' |
  'lastSlot_DESC' |
  'bidder_ASC' |
  'bidder_DESC'

export type ChronicleOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'curAuction_ASC' |
  'curAuction_DESC' |
  'curBlockNum_ASC' |
  'curBlockNum_DESC' |
  'curLease_ASC' |
  'curLease_DESC' |
  'curLeaseStart_ASC' |
  'curLeaseStart_DESC' |
  'curLeaseEnd_ASC' |
  'curLeaseEnd_DESC'

export type ContributionOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'account_ASC' |
  'account_DESC' |
  'parachain_ASC' |
  'parachain_DESC' |
  'fund_ASC' |
  'fund_DESC' |
  'amount_ASC' |
  'amount_DESC' |
  'blockNum_ASC' |
  'blockNum_DESC'

export type CrowdloanOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'parachain_ASC' |
  'parachain_DESC' |
  'depositor_ASC' |
  'depositor_DESC' |
  'verifier_ASC' |
  'verifier_DESC' |
  'cap_ASC' |
  'cap_DESC' |
  'raised_ASC' |
  'raised_DESC' |
  'lockExpiredBlock_ASC' |
  'lockExpiredBlock_DESC' |
  'blockNum_ASC' |
  'blockNum_DESC' |
  'firstSlot_ASC' |
  'firstSlot_DESC' |
  'lastSlot_ASC' |
  'lastSlot_DESC' |
  'status_ASC' |
  'status_DESC' |
  'leaseExpiredBlock_ASC' |
  'leaseExpiredBlock_DESC' |
  'dissolvedBlock_ASC' |
  'dissolvedBlock_DESC' |
  'isFinished_ASC' |
  'isFinished_DESC' |
  'wonAuctionId_ASC' |
  'wonAuctionId_DESC'

export type CrowdloanSequenceOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'curIndex_ASC' |
  'curIndex_DESC' |
  'blockNum_ASC' |
  'blockNum_DESC'

export type ParachainLeasesOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'paraId_ASC' |
  'paraId_DESC' |
  'parachain_ASC' |
  'parachain_DESC' |
  'leaseRange_ASC' |
  'leaseRange_DESC' |
  'firstLease_ASC' |
  'firstLease_DESC' |
  'lastLease_ASC' |
  'lastLease_DESC' |
  'latestBidAmount_ASC' |
  'latestBidAmount_DESC' |
  'auction_ASC' |
  'auction_DESC' |
  'activeForAuction_ASC' |
  'activeForAuction_DESC' |
  'winningAmount_ASC' |
  'winningAmount_DESC' |
  'extraAmount_ASC' |
  'extraAmount_DESC' |
  'wonBidFrom_ASC' |
  'wonBidFrom_DESC' |
  'numBlockWon_ASC' |
  'numBlockWon_DESC' |
  'winningResultBlock_ASC' |
  'winningResultBlock_DESC' |
  'hasWon_ASC' |
  'hasWon_DESC'

export type ParachainOrderByInput =   'createdAt_ASC' |
  'createdAt_DESC' |
  'updatedAt_ASC' |
  'updatedAt_DESC' |
  'deletedAt_ASC' |
  'deletedAt_DESC' |
  'paraId_ASC' |
  'paraId_DESC' |
  'creationBlock_ASC' |
  'creationBlock_DESC' |
  'deregistered_ASC' |
  'deregistered_DESC' |
  'deposit_ASC' |
  'deposit_DESC' |
  'manager_ASC' |
  'manager_DESC' |
  'chronicle_ASC' |
  'chronicle_DESC'

export interface AuctionCreateInput {
  blockNum: Float
  status: String
  leaseStart?: Float | null
  slotsStart: Float
  leaseEnd?: Float | null
  slotsEnd: Float
  closingStart: Float
  closingEnd: Float
  resultBlock?: Float | null
  ongoing: Boolean
}

export interface AuctionParachainCreateInput {
  auction: ID_Output
  parachain: ID_Output
  blockNum: Float
  firstSlot: Float
  lastSlot: Float
}

export interface AuctionParachainUpdateInput {
  auction?: ID_Input | null
  parachain?: ID_Input | null
  blockNum?: Float | null
  firstSlot?: Float | null
  lastSlot?: Float | null
}

export interface AuctionParachainWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  blockNum_eq?: Int | null
  blockNum_gt?: Int | null
  blockNum_gte?: Int | null
  blockNum_lt?: Int | null
  blockNum_lte?: Int | null
  blockNum_in?: Int[] | Int | null
  firstSlot_eq?: Int | null
  firstSlot_gt?: Int | null
  firstSlot_gte?: Int | null
  firstSlot_lt?: Int | null
  firstSlot_lte?: Int | null
  firstSlot_in?: Int[] | Int | null
  lastSlot_eq?: Int | null
  lastSlot_gt?: Int | null
  lastSlot_gte?: Int | null
  lastSlot_lt?: Int | null
  lastSlot_lte?: Int | null
  lastSlot_in?: Int[] | Int | null
  auction?: AuctionWhereInput | null
  parachain?: ParachainWhereInput | null
  AND?: AuctionParachainWhereInput[] | AuctionParachainWhereInput | null
  OR?: AuctionParachainWhereInput[] | AuctionParachainWhereInput | null
}

export interface AuctionParachainWhereUniqueInput {
  id: ID_Output
}

export interface AuctionUpdateInput {
  blockNum?: Float | null
  status?: String | null
  leaseStart?: Float | null
  slotsStart?: Float | null
  leaseEnd?: Float | null
  slotsEnd?: Float | null
  closingStart?: Float | null
  closingEnd?: Float | null
  resultBlock?: Float | null
  ongoing?: Boolean | null
}

export interface AuctionWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  blockNum_eq?: Int | null
  blockNum_gt?: Int | null
  blockNum_gte?: Int | null
  blockNum_lt?: Int | null
  blockNum_lte?: Int | null
  blockNum_in?: Int[] | Int | null
  status_eq?: String | null
  status_contains?: String | null
  status_startsWith?: String | null
  status_endsWith?: String | null
  status_in?: String[] | String | null
  leaseStart_eq?: Int | null
  leaseStart_gt?: Int | null
  leaseStart_gte?: Int | null
  leaseStart_lt?: Int | null
  leaseStart_lte?: Int | null
  leaseStart_in?: Int[] | Int | null
  slotsStart_eq?: Int | null
  slotsStart_gt?: Int | null
  slotsStart_gte?: Int | null
  slotsStart_lt?: Int | null
  slotsStart_lte?: Int | null
  slotsStart_in?: Int[] | Int | null
  leaseEnd_eq?: Int | null
  leaseEnd_gt?: Int | null
  leaseEnd_gte?: Int | null
  leaseEnd_lt?: Int | null
  leaseEnd_lte?: Int | null
  leaseEnd_in?: Int[] | Int | null
  slotsEnd_eq?: Int | null
  slotsEnd_gt?: Int | null
  slotsEnd_gte?: Int | null
  slotsEnd_lt?: Int | null
  slotsEnd_lte?: Int | null
  slotsEnd_in?: Int[] | Int | null
  closingStart_eq?: Int | null
  closingStart_gt?: Int | null
  closingStart_gte?: Int | null
  closingStart_lt?: Int | null
  closingStart_lte?: Int | null
  closingStart_in?: Int[] | Int | null
  closingEnd_eq?: Int | null
  closingEnd_gt?: Int | null
  closingEnd_gte?: Int | null
  closingEnd_lt?: Int | null
  closingEnd_lte?: Int | null
  closingEnd_in?: Int[] | Int | null
  resultBlock_eq?: Int | null
  resultBlock_gt?: Int | null
  resultBlock_gte?: Int | null
  resultBlock_lt?: Int | null
  resultBlock_lte?: Int | null
  resultBlock_in?: Int[] | Int | null
  ongoing_eq?: Boolean | null
  ongoing_in?: Boolean[] | Boolean | null
  bids_none?: BidWhereInput | null
  bids_some?: BidWhereInput | null
  bids_every?: BidWhereInput | null
  parachainLeases_none?: ParachainLeasesWhereInput | null
  parachainLeases_some?: ParachainLeasesWhereInput | null
  parachainLeases_every?: ParachainLeasesWhereInput | null
  auctionparachainauction_none?: AuctionParachainWhereInput | null
  auctionparachainauction_some?: AuctionParachainWhereInput | null
  auctionparachainauction_every?: AuctionParachainWhereInput | null
  chroniclecurAuction_none?: ChronicleWhereInput | null
  chroniclecurAuction_some?: ChronicleWhereInput | null
  chroniclecurAuction_every?: ChronicleWhereInput | null
  AND?: AuctionWhereInput[] | AuctionWhereInput | null
  OR?: AuctionWhereInput[] | AuctionWhereInput | null
}

export interface AuctionWhereUniqueInput {
  id: ID_Output
}

export interface BaseWhereInput {
  id_eq?: String | null
  id_in?: String[] | String | null
  createdAt_eq?: String | null
  createdAt_lt?: String | null
  createdAt_lte?: String | null
  createdAt_gt?: String | null
  createdAt_gte?: String | null
  createdById_eq?: String | null
  updatedAt_eq?: String | null
  updatedAt_lt?: String | null
  updatedAt_lte?: String | null
  updatedAt_gt?: String | null
  updatedAt_gte?: String | null
  updatedById_eq?: String | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: String | null
  deletedAt_lt?: String | null
  deletedAt_lte?: String | null
  deletedAt_gt?: String | null
  deletedAt_gte?: String | null
  deletedById_eq?: String | null
}

export interface BidCreateInput {
  auction: ID_Output
  winningAuction?: Float | null
  blockNum: Float
  parachain: ID_Output
  isCrowdloan: Boolean
  amount: String
  fund?: ID_Input | null
  firstSlot: Float
  lastSlot: Float
  bidder?: String | null
}

export interface BidUpdateInput {
  auction?: ID_Input | null
  winningAuction?: Float | null
  blockNum?: Float | null
  parachain?: ID_Input | null
  isCrowdloan?: Boolean | null
  amount?: String | null
  fund?: ID_Input | null
  firstSlot?: Float | null
  lastSlot?: Float | null
  bidder?: String | null
}

export interface BidWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  winningAuction_eq?: Int | null
  winningAuction_gt?: Int | null
  winningAuction_gte?: Int | null
  winningAuction_lt?: Int | null
  winningAuction_lte?: Int | null
  winningAuction_in?: Int[] | Int | null
  blockNum_eq?: Int | null
  blockNum_gt?: Int | null
  blockNum_gte?: Int | null
  blockNum_lt?: Int | null
  blockNum_lte?: Int | null
  blockNum_in?: Int[] | Int | null
  isCrowdloan_eq?: Boolean | null
  isCrowdloan_in?: Boolean[] | Boolean | null
  amount_eq?: BigInt | null
  amount_gt?: BigInt | null
  amount_gte?: BigInt | null
  amount_lt?: BigInt | null
  amount_lte?: BigInt | null
  amount_in?: BigInt[] | BigInt | null
  firstSlot_eq?: Int | null
  firstSlot_gt?: Int | null
  firstSlot_gte?: Int | null
  firstSlot_lt?: Int | null
  firstSlot_lte?: Int | null
  firstSlot_in?: Int[] | Int | null
  lastSlot_eq?: Int | null
  lastSlot_gt?: Int | null
  lastSlot_gte?: Int | null
  lastSlot_lt?: Int | null
  lastSlot_lte?: Int | null
  lastSlot_in?: Int[] | Int | null
  bidder_eq?: String | null
  bidder_contains?: String | null
  bidder_startsWith?: String | null
  bidder_endsWith?: String | null
  bidder_in?: String[] | String | null
  auction?: AuctionWhereInput | null
  parachain?: ParachainWhereInput | null
  fund?: CrowdloanWhereInput | null
  AND?: BidWhereInput[] | BidWhereInput | null
  OR?: BidWhereInput[] | BidWhereInput | null
}

export interface BidWhereUniqueInput {
  id: ID_Output
}

export interface ChronicleCreateInput {
  curAuction?: ID_Input | null
  curBlockNum?: Float | null
  curLease?: Float | null
  curLeaseStart?: Float | null
  curLeaseEnd?: Float | null
}

export interface ChronicleUpdateInput {
  curAuction?: ID_Input | null
  curBlockNum?: Float | null
  curLease?: Float | null
  curLeaseStart?: Float | null
  curLeaseEnd?: Float | null
}

export interface ChronicleWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  curBlockNum_eq?: Int | null
  curBlockNum_gt?: Int | null
  curBlockNum_gte?: Int | null
  curBlockNum_lt?: Int | null
  curBlockNum_lte?: Int | null
  curBlockNum_in?: Int[] | Int | null
  curLease_eq?: Int | null
  curLease_gt?: Int | null
  curLease_gte?: Int | null
  curLease_lt?: Int | null
  curLease_lte?: Int | null
  curLease_in?: Int[] | Int | null
  curLeaseStart_eq?: Int | null
  curLeaseStart_gt?: Int | null
  curLeaseStart_gte?: Int | null
  curLeaseStart_lt?: Int | null
  curLeaseStart_lte?: Int | null
  curLeaseStart_in?: Int[] | Int | null
  curLeaseEnd_eq?: Int | null
  curLeaseEnd_gt?: Int | null
  curLeaseEnd_gte?: Int | null
  curLeaseEnd_lt?: Int | null
  curLeaseEnd_lte?: Int | null
  curLeaseEnd_in?: Int[] | Int | null
  curAuction?: AuctionWhereInput | null
  parachains_none?: ParachainWhereInput | null
  parachains_some?: ParachainWhereInput | null
  parachains_every?: ParachainWhereInput | null
  AND?: ChronicleWhereInput[] | ChronicleWhereInput | null
  OR?: ChronicleWhereInput[] | ChronicleWhereInput | null
}

export interface ChronicleWhereUniqueInput {
  id: ID_Output
}

export interface ContributionCreateInput {
  account: String
  parachain: ID_Output
  fund: ID_Output
  amount: String
  blockNum: Float
}

export interface ContributionUpdateInput {
  account?: String | null
  parachain?: ID_Input | null
  fund?: ID_Input | null
  amount?: String | null
  blockNum?: Float | null
}

export interface ContributionWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  account_eq?: String | null
  account_contains?: String | null
  account_startsWith?: String | null
  account_endsWith?: String | null
  account_in?: String[] | String | null
  amount_eq?: BigInt | null
  amount_gt?: BigInt | null
  amount_gte?: BigInt | null
  amount_lt?: BigInt | null
  amount_lte?: BigInt | null
  amount_in?: BigInt[] | BigInt | null
  blockNum_eq?: Int | null
  blockNum_gt?: Int | null
  blockNum_gte?: Int | null
  blockNum_lt?: Int | null
  blockNum_lte?: Int | null
  blockNum_in?: Int[] | Int | null
  parachain?: ParachainWhereInput | null
  fund?: CrowdloanWhereInput | null
  AND?: ContributionWhereInput[] | ContributionWhereInput | null
  OR?: ContributionWhereInput[] | ContributionWhereInput | null
}

export interface ContributionWhereUniqueInput {
  id: ID_Output
}

export interface CrowdloanCreateInput {
  updatedAt?: DateTime | null
  parachain: ID_Output
  depositor: String
  verifier?: String | null
  cap: String
  raised: String
  lockExpiredBlock: Float
  blockNum?: Float | null
  firstSlot: Float
  lastSlot: Float
  status: String
  leaseExpiredBlock?: Float | null
  dissolvedBlock?: Float | null
  isFinished?: Boolean | null
  wonAuctionId?: String | null
}

export interface CrowdloanSequenceCreateInput {
  curIndex: Float
  blockNum: Float
}

export interface CrowdloanSequenceUpdateInput {
  curIndex?: Float | null
  blockNum?: Float | null
}

export interface CrowdloanSequenceWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  curIndex_eq?: Int | null
  curIndex_gt?: Int | null
  curIndex_gte?: Int | null
  curIndex_lt?: Int | null
  curIndex_lte?: Int | null
  curIndex_in?: Int[] | Int | null
  blockNum_eq?: Int | null
  blockNum_gt?: Int | null
  blockNum_gte?: Int | null
  blockNum_lt?: Int | null
  blockNum_lte?: Int | null
  blockNum_in?: Int[] | Int | null
  AND?: CrowdloanSequenceWhereInput[] | CrowdloanSequenceWhereInput | null
  OR?: CrowdloanSequenceWhereInput[] | CrowdloanSequenceWhereInput | null
}

export interface CrowdloanSequenceWhereUniqueInput {
  id: ID_Output
}

export interface CrowdloanUpdateInput {
  updatedAt?: DateTime | null
  parachain?: ID_Input | null
  depositor?: String | null
  verifier?: String | null
  cap?: String | null
  raised?: String | null
  lockExpiredBlock?: Float | null
  blockNum?: Float | null
  firstSlot?: Float | null
  lastSlot?: Float | null
  status?: String | null
  leaseExpiredBlock?: Float | null
  dissolvedBlock?: Float | null
  isFinished?: Boolean | null
  wonAuctionId?: String | null
}

export interface CrowdloanWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  depositor_eq?: String | null
  depositor_contains?: String | null
  depositor_startsWith?: String | null
  depositor_endsWith?: String | null
  depositor_in?: String[] | String | null
  verifier_eq?: String | null
  verifier_contains?: String | null
  verifier_startsWith?: String | null
  verifier_endsWith?: String | null
  verifier_in?: String[] | String | null
  cap_eq?: BigInt | null
  cap_gt?: BigInt | null
  cap_gte?: BigInt | null
  cap_lt?: BigInt | null
  cap_lte?: BigInt | null
  cap_in?: BigInt[] | BigInt | null
  raised_eq?: BigInt | null
  raised_gt?: BigInt | null
  raised_gte?: BigInt | null
  raised_lt?: BigInt | null
  raised_lte?: BigInt | null
  raised_in?: BigInt[] | BigInt | null
  lockExpiredBlock_eq?: Int | null
  lockExpiredBlock_gt?: Int | null
  lockExpiredBlock_gte?: Int | null
  lockExpiredBlock_lt?: Int | null
  lockExpiredBlock_lte?: Int | null
  lockExpiredBlock_in?: Int[] | Int | null
  blockNum_eq?: Int | null
  blockNum_gt?: Int | null
  blockNum_gte?: Int | null
  blockNum_lt?: Int | null
  blockNum_lte?: Int | null
  blockNum_in?: Int[] | Int | null
  firstSlot_eq?: Int | null
  firstSlot_gt?: Int | null
  firstSlot_gte?: Int | null
  firstSlot_lt?: Int | null
  firstSlot_lte?: Int | null
  firstSlot_in?: Int[] | Int | null
  lastSlot_eq?: Int | null
  lastSlot_gt?: Int | null
  lastSlot_gte?: Int | null
  lastSlot_lt?: Int | null
  lastSlot_lte?: Int | null
  lastSlot_in?: Int[] | Int | null
  status_eq?: String | null
  status_contains?: String | null
  status_startsWith?: String | null
  status_endsWith?: String | null
  status_in?: String[] | String | null
  leaseExpiredBlock_eq?: Int | null
  leaseExpiredBlock_gt?: Int | null
  leaseExpiredBlock_gte?: Int | null
  leaseExpiredBlock_lt?: Int | null
  leaseExpiredBlock_lte?: Int | null
  leaseExpiredBlock_in?: Int[] | Int | null
  dissolvedBlock_eq?: Int | null
  dissolvedBlock_gt?: Int | null
  dissolvedBlock_gte?: Int | null
  dissolvedBlock_lt?: Int | null
  dissolvedBlock_lte?: Int | null
  dissolvedBlock_in?: Int[] | Int | null
  isFinished_eq?: Boolean | null
  isFinished_in?: Boolean[] | Boolean | null
  wonAuctionId_eq?: String | null
  wonAuctionId_contains?: String | null
  wonAuctionId_startsWith?: String | null
  wonAuctionId_endsWith?: String | null
  wonAuctionId_in?: String[] | String | null
  parachain?: ParachainWhereInput | null
  contributions_none?: ContributionWhereInput | null
  contributions_some?: ContributionWhereInput | null
  contributions_every?: ContributionWhereInput | null
  bidfund_none?: BidWhereInput | null
  bidfund_some?: BidWhereInput | null
  bidfund_every?: BidWhereInput | null
  AND?: CrowdloanWhereInput[] | CrowdloanWhereInput | null
  OR?: CrowdloanWhereInput[] | CrowdloanWhereInput | null
}

export interface CrowdloanWhereUniqueInput {
  id: ID_Output
}

export interface ParachainCreateInput {
  paraId: Float
  creationBlock?: Float | null
  deregistered: Boolean
  deposit: String
  manager: String
  chronicle?: ID_Input | null
}

export interface ParachainLeasesCreateInput {
  paraId: Float
  parachain: ID_Output
  leaseRange: String
  firstLease: Float
  lastLease: Float
  latestBidAmount: String
  auction?: ID_Input | null
  activeForAuction?: String | null
  winningAmount?: String | null
  extraAmount?: String | null
  wonBidFrom?: String | null
  numBlockWon?: Float | null
  winningResultBlock?: Float | null
  hasWon: Boolean
}

export interface ParachainLeasesUpdateInput {
  paraId?: Float | null
  parachain?: ID_Input | null
  leaseRange?: String | null
  firstLease?: Float | null
  lastLease?: Float | null
  latestBidAmount?: String | null
  auction?: ID_Input | null
  activeForAuction?: String | null
  winningAmount?: String | null
  extraAmount?: String | null
  wonBidFrom?: String | null
  numBlockWon?: Float | null
  winningResultBlock?: Float | null
  hasWon?: Boolean | null
}

export interface ParachainLeasesWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  paraId_eq?: Int | null
  paraId_gt?: Int | null
  paraId_gte?: Int | null
  paraId_lt?: Int | null
  paraId_lte?: Int | null
  paraId_in?: Int[] | Int | null
  leaseRange_eq?: String | null
  leaseRange_contains?: String | null
  leaseRange_startsWith?: String | null
  leaseRange_endsWith?: String | null
  leaseRange_in?: String[] | String | null
  firstLease_eq?: Int | null
  firstLease_gt?: Int | null
  firstLease_gte?: Int | null
  firstLease_lt?: Int | null
  firstLease_lte?: Int | null
  firstLease_in?: Int[] | Int | null
  lastLease_eq?: Int | null
  lastLease_gt?: Int | null
  lastLease_gte?: Int | null
  lastLease_lt?: Int | null
  lastLease_lte?: Int | null
  lastLease_in?: Int[] | Int | null
  latestBidAmount_eq?: BigInt | null
  latestBidAmount_gt?: BigInt | null
  latestBidAmount_gte?: BigInt | null
  latestBidAmount_lt?: BigInt | null
  latestBidAmount_lte?: BigInt | null
  latestBidAmount_in?: BigInt[] | BigInt | null
  activeForAuction_eq?: String | null
  activeForAuction_contains?: String | null
  activeForAuction_startsWith?: String | null
  activeForAuction_endsWith?: String | null
  activeForAuction_in?: String[] | String | null
  winningAmount_eq?: BigInt | null
  winningAmount_gt?: BigInt | null
  winningAmount_gte?: BigInt | null
  winningAmount_lt?: BigInt | null
  winningAmount_lte?: BigInt | null
  winningAmount_in?: BigInt[] | BigInt | null
  extraAmount_eq?: BigInt | null
  extraAmount_gt?: BigInt | null
  extraAmount_gte?: BigInt | null
  extraAmount_lt?: BigInt | null
  extraAmount_lte?: BigInt | null
  extraAmount_in?: BigInt[] | BigInt | null
  wonBidFrom_eq?: String | null
  wonBidFrom_contains?: String | null
  wonBidFrom_startsWith?: String | null
  wonBidFrom_endsWith?: String | null
  wonBidFrom_in?: String[] | String | null
  numBlockWon_eq?: Int | null
  numBlockWon_gt?: Int | null
  numBlockWon_gte?: Int | null
  numBlockWon_lt?: Int | null
  numBlockWon_lte?: Int | null
  numBlockWon_in?: Int[] | Int | null
  winningResultBlock_eq?: Int | null
  winningResultBlock_gt?: Int | null
  winningResultBlock_gte?: Int | null
  winningResultBlock_lt?: Int | null
  winningResultBlock_lte?: Int | null
  winningResultBlock_in?: Int[] | Int | null
  hasWon_eq?: Boolean | null
  hasWon_in?: Boolean[] | Boolean | null
  parachain?: ParachainWhereInput | null
  auction?: AuctionWhereInput | null
  AND?: ParachainLeasesWhereInput[] | ParachainLeasesWhereInput | null
  OR?: ParachainLeasesWhereInput[] | ParachainLeasesWhereInput | null
}

export interface ParachainLeasesWhereUniqueInput {
  id: ID_Output
}

export interface ParachainUpdateInput {
  paraId?: Float | null
  creationBlock?: Float | null
  deregistered?: Boolean | null
  deposit?: String | null
  manager?: String | null
  chronicle?: ID_Input | null
}

export interface ParachainWhereInput {
  id_eq?: ID_Input | null
  id_in?: ID_Output[] | ID_Output | null
  createdAt_eq?: DateTime | null
  createdAt_lt?: DateTime | null
  createdAt_lte?: DateTime | null
  createdAt_gt?: DateTime | null
  createdAt_gte?: DateTime | null
  createdById_eq?: ID_Input | null
  createdById_in?: ID_Output[] | ID_Output | null
  updatedAt_eq?: DateTime | null
  updatedAt_lt?: DateTime | null
  updatedAt_lte?: DateTime | null
  updatedAt_gt?: DateTime | null
  updatedAt_gte?: DateTime | null
  updatedById_eq?: ID_Input | null
  updatedById_in?: ID_Output[] | ID_Output | null
  deletedAt_all?: Boolean | null
  deletedAt_eq?: DateTime | null
  deletedAt_lt?: DateTime | null
  deletedAt_lte?: DateTime | null
  deletedAt_gt?: DateTime | null
  deletedAt_gte?: DateTime | null
  deletedById_eq?: ID_Input | null
  deletedById_in?: ID_Output[] | ID_Output | null
  paraId_eq?: Int | null
  paraId_gt?: Int | null
  paraId_gte?: Int | null
  paraId_lt?: Int | null
  paraId_lte?: Int | null
  paraId_in?: Int[] | Int | null
  creationBlock_eq?: Int | null
  creationBlock_gt?: Int | null
  creationBlock_gte?: Int | null
  creationBlock_lt?: Int | null
  creationBlock_lte?: Int | null
  creationBlock_in?: Int[] | Int | null
  deregistered_eq?: Boolean | null
  deregistered_in?: Boolean[] | Boolean | null
  deposit_eq?: BigInt | null
  deposit_gt?: BigInt | null
  deposit_gte?: BigInt | null
  deposit_lt?: BigInt | null
  deposit_lte?: BigInt | null
  deposit_in?: BigInt[] | BigInt | null
  manager_eq?: String | null
  manager_contains?: String | null
  manager_startsWith?: String | null
  manager_endsWith?: String | null
  manager_in?: String[] | String | null
  leases_none?: ParachainLeasesWhereInput | null
  leases_some?: ParachainLeasesWhereInput | null
  leases_every?: ParachainLeasesWhereInput | null
  bids_none?: BidWhereInput | null
  bids_some?: BidWhereInput | null
  bids_every?: BidWhereInput | null
  funds_none?: CrowdloanWhereInput | null
  funds_some?: CrowdloanWhereInput | null
  funds_every?: CrowdloanWhereInput | null
  chronicle?: ChronicleWhereInput | null
  auctionparachainparachain_none?: AuctionParachainWhereInput | null
  auctionparachainparachain_some?: AuctionParachainWhereInput | null
  auctionparachainparachain_every?: AuctionParachainWhereInput | null
  contributionparachain_none?: ContributionWhereInput | null
  contributionparachain_some?: ContributionWhereInput | null
  contributionparachain_every?: ContributionWhereInput | null
  AND?: ParachainWhereInput[] | ParachainWhereInput | null
  OR?: ParachainWhereInput[] | ParachainWhereInput | null
}

export interface ParachainWhereUniqueInput {
  id: ID_Output
}

export interface BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface DeleteResponse {
  id: ID_Output
}

export interface Auction extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  blockNum: Int
  status: String
  bids: Array<Bid>
  leaseStart?: Int | null
  slotsStart: Int
  leaseEnd?: Int | null
  slotsEnd: Int
  closingStart: Int
  closingEnd: Int
  resultBlock?: Int | null
  ongoing: Boolean
  parachainLeases?: Array<ParachainLeases> | null
  auctionparachainauction?: Array<AuctionParachain> | null
  chroniclecurAuction?: Array<Chronicle> | null
}

export interface AuctionConnection {
  totalCount: Int
  edges: Array<AuctionEdge>
  pageInfo: PageInfo
}

export interface AuctionEdge {
  node: Auction
  cursor: String
}

export interface AuctionParachain extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  auction: Auction
  auctionId: String
  parachain: Parachain
  parachainId: String
  blockNum: Int
  firstSlot: Int
  lastSlot: Int
}

export interface AuctionParachainConnection {
  totalCount: Int
  edges: Array<AuctionParachainEdge>
  pageInfo: PageInfo
}

export interface AuctionParachainEdge {
  node: AuctionParachain
  cursor: String
}

export interface BaseModel extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface BaseModelUUID extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
}

export interface Bid extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  auction: Auction
  auctionId: String
  winningAuction?: Int | null
  blockNum: Int
  parachain: Parachain
  parachainId: String
  isCrowdloan: Boolean
  amount: BigInt
  fund?: Crowdloan | null
  fundId?: String | null
  firstSlot: Int
  lastSlot: Int
  bidder?: String | null
}

export interface BidConnection {
  totalCount: Int
  edges: Array<BidEdge>
  pageInfo: PageInfo
}

export interface BidEdge {
  node: Bid
  cursor: String
}

export interface Chronicle extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  curAuction?: Auction | null
  curAuctionId?: String | null
  curBlockNum?: Int | null
  curLease?: Int | null
  curLeaseStart?: Int | null
  curLeaseEnd?: Int | null
  parachains?: Array<Parachain> | null
}

export interface ChronicleConnection {
  totalCount: Int
  edges: Array<ChronicleEdge>
  pageInfo: PageInfo
}

export interface ChronicleEdge {
  node: Chronicle
  cursor: String
}

export interface Contribution extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  account: String
  parachain: Parachain
  parachainId: String
  fund: Crowdloan
  fundId: String
  amount: BigInt
  blockNum: Int
}

export interface ContributionConnection {
  totalCount: Int
  edges: Array<ContributionEdge>
  pageInfo: PageInfo
}

export interface ContributionEdge {
  node: Contribution
  cursor: String
}

export interface Crowdloan extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  parachain: Parachain
  parachainId: String
  depositor: String
  verifier?: String | null
  cap: BigInt
  raised: BigInt
  lockExpiredBlock: Int
  blockNum?: Int | null
  firstSlot: Int
  lastSlot: Int
  status: String
  leaseExpiredBlock?: Int | null
  dissolvedBlock?: Int | null
  isFinished?: Boolean | null
  wonAuctionId?: String | null
  contributions?: Array<Contribution> | null
  bidfund?: Array<Bid> | null
}

export interface CrowdloanConnection {
  totalCount: Int
  edges: Array<CrowdloanEdge>
  pageInfo: PageInfo
}

export interface CrowdloanEdge {
  node: Crowdloan
  cursor: String
}

export interface CrowdloanSequence extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  curIndex: Int
  blockNum: Int
}

export interface CrowdloanSequenceConnection {
  totalCount: Int
  edges: Array<CrowdloanSequenceEdge>
  pageInfo: PageInfo
}

export interface CrowdloanSequenceEdge {
  node: CrowdloanSequence
  cursor: String
}

export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor?: String | null
  endCursor?: String | null
}

export interface Parachain extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  paraId: Int
  creationBlock?: Int | null
  deregistered: Boolean
  deposit: BigInt
  manager: String
  leases?: Array<ParachainLeases> | null
  bids?: Array<Bid> | null
  funds?: Array<Crowdloan> | null
  chronicle?: Chronicle | null
  chronicleId?: String | null
  auctionparachainparachain?: Array<AuctionParachain> | null
  contributionparachain?: Array<Contribution> | null
}

export interface ParachainConnection {
  totalCount: Int
  edges: Array<ParachainEdge>
  pageInfo: PageInfo
}

export interface ParachainEdge {
  node: Parachain
  cursor: String
}

export interface ParachainLeases extends BaseGraphQLObject {
  id: ID_Output
  createdAt: DateTime
  createdById: String
  updatedAt?: DateTime | null
  updatedById?: String | null
  deletedAt?: DateTime | null
  deletedById?: String | null
  version: Int
  paraId: Int
  parachain: Parachain
  parachainId: String
  leaseRange: String
  firstLease: Int
  lastLease: Int
  latestBidAmount: BigInt
  auction?: Auction | null
  auctionId?: String | null
  activeForAuction?: String | null
  winningAmount?: BigInt | null
  extraAmount?: BigInt | null
  wonBidFrom?: String | null
  numBlockWon?: Int | null
  winningResultBlock?: Int | null
  hasWon: Boolean
}

export interface ParachainLeasesConnection {
  totalCount: Int
  edges: Array<ParachainLeasesEdge>
  pageInfo: PageInfo
}

export interface ParachainLeasesEdge {
  node: ParachainLeases
  cursor: String
}

export interface ProcessorState {
  lastCompleteBlock: Float
  lastProcessedEvent: String
  indexerHead: Float
  chainHead: Float
}

export interface StandardDeleteResponse {
  id: ID_Output
}

/*
GraphQL representation of BigInt
*/
export type BigInt = string

/*
The `Boolean` scalar type represents `true` or `false`.
*/
export type Boolean = boolean

/*
The javascript `Date` as string. Type represents date and time as the ISO Date string.
*/
export type DateTime = Date | string

/*
The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).
*/
export type Float = number

/*
The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.
*/
export type ID_Input = string | number
export type ID_Output = string

/*
The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
*/
export type Int = number

/*
The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
*/
export type String = string