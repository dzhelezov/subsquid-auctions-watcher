import BN from 'bn.js'
import {
    DatabaseManager,
    EventContext,
    StoreContext,
    BlockContext,
    ExtrinsicContext,
    } from '@subsquid/hydra-common'
import * as Models from '../generated/model'
import * as Types from '../chain'
import { service } from './api'


export async function handleParachainRegistration({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {

  const [paraId, managerId] = new Types.Registrar.RegisteredEvent(event).params

  const parachain = await getOrCreate(store, Models.Parachain, `${paraId}-${managerId.toHex()}`)

  let api = await service()
  const { deposit } = (await api.query.registrar.paras(paraId)).toJSON() || { deposit: 0 };

  parachain.paraId = paraId.toNumber()
  parachain.createdAt = new Date(block.timestamp)
  parachain.manager = managerId.toHex()
  parachain.deposit = deposit
  parachain.creationBlock = block.height
  parachain.deregistered = false

  await store.save(parachain)
};

export async function handleAuctionStarted({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {

  const [auctionId, slotStart, auctionEnds] = new Types.Auctions.AuctionStartedEvent(event).params

  let api = await service()
  const endingPeriod = api.consts.auctions.endingPeriod.toJSON() as number;
  const leasePeriod = api.consts.slots.leasePeriod.toJSON() as number;
  const periods = api.consts.auctions.leasePeriodsPerSlot.toJSON() as number;

  const auction = await getOrCreate(store, Models.Auction, auctionId.toString())

  auction.blockNum = block.height
  auction.status = 'Started'
  auction.slotsStart = slotStart.toNumber()
  auction.slotsEnd = slotStart.toNumber() + periods - 1
  auction.leaseStart = slotStart.toNumber() * leasePeriod
  auction.leaseEnd = (slotStart.toNumber() + periods - 1) * leasePeriod
  auction.createdAt = new Date(block.timestamp)
  auction.closingStart = auctionEnds.toNumber()
  auction.ongoing = true
  auction.closingEnd = auctionEnds.toNumber() + endingPeriod
  await store.save(auction);

  // const chronicle = await getOrCreate(store, Models.Chronicle, 'ChronicleKey')
  // chronicle.curAuctionId = auctionId.toString();
  // await store.save(chronicle);
};

export async function handleAuctionClosed({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {

  const [auctionId] = new Types.Auctions.AuctionClosedEvent(event).params
  const auction = await getOrCreate(store, Models.Auction, auctionId.toString())

  auction.status = 'Closed'
  auction.ongoing = false
  await store.save(auction);

  // const chronicle = await getOrCreate(store, Models.Chronicle, 'ChronicleKey')
  // chronicle.curAuctionId = auctionId.toString()
  // await store.save(chronicle);
};

export async function handleBidAccepted({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {

  const [bidderId, paraId, bidAmount, startSlot, endSlot] = new Types.Auctions.BidAcceptedEvent(event).params

  let api = await service();
  const auctionId = (await api.query.auctions.auctionCounter()).toJSON() as number;
  const isFund = isFundAddress(bidderId.toHex()) as unknown as boolean;
  const bid = await getOrCreate(store, Models.Bid, `${block.height}-${bidderId}-${paraId}-${startSlot}-${endSlot}`)

  const fundId = await getLatestCrowdloanId(paraId.toString(), store);
  const bidAmt = new BN(bidAmount.toNumber())

  bid.id = `${block.height}-${bidderId}-${paraId}-${startSlot}-${endSlot}`
  bid.auction.id = auctionId.toString()
  bid.blockNum = block.height
  bid.winningAuction = auctionId
  bid.parachain.id = paraId.toString()
  bid.isCrowdloan = isFund
  bid.amount = bidAmt
  bid.firstSlot = startSlot.toNumber()
  bid.lastSlot = endSlot.toNumber()
  bid.createdAt = new Date(block.timestamp)
  // bid.fund.id = isFund ? fundId : ''
  bid.bidder = isFund ? '' : bidderId.toHex()

  await store.save(bid);

  const auctionParaId = `${paraId}-${startSlot}-${endSlot}-${auctionId}`;
  const auctionPara = await store.get(Models.AuctionParachain,{
    where: { auctionParaId }
  });
  if (!auctionPara) {
    await store.save(new Models.AuctionParachain({
      id: auctionParaId,
      firstSlot: startSlot.toNumber(),
      lastSlot: endSlot.toNumber(),
      createdAt: new Date(block.timestamp),
      blockNum: block.height
    }))
  }
};

export async function handleCrowdloanContributed({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {

  const [contributorId, fundIdx, amount] = new Types.Crowdloan.ContributedEvent(event).params
  const amtValue = amount.toNumber()

  const contribution = await store.find(Models.Contribution, 
  {
    where: `${block.height}-${event.id}`,
    take: 1
  })

  let api = await service()
  const parachain = (await api.query.registrar.paras(fundIdx)).toJSON();

  contribution[0].account = contributorId.toHex()
  contribution[0].fund.id = fundIdx.toString()
  contribution[0].parachain.id = parachain.id
  contribution[0].amount = new BN(amtValue)
  contribution[0].createdAt = new Date(block.timestamp)
  contribution[0].blockNum = block.height

  await store.save(contribution);
};

export async function handleCrowdloanDissolved({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  const [fundId] = new Types.Crowdloan.DissolvedEvent(event).params

  const crowdloan = await store.find(Models.Crowdloan, {where: fundId.toString(), take: 1})

  crowdloan[0].status = 'Dissolved'
  crowdloan[0].isFinished = true
  crowdloan[0].updatedAt = new Date(block.timestamp)
  crowdloan[0].dissolvedBlock = block.height

  await store.save(crowdloan);
};

export async function handleNewLeasePeriod({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  const [leaseIdx] = new Types.Slots.NewLeasePeriodEvent(event).params;
  let api = await service();
  const leasePeriod = api.consts.slots.leasePeriod.toJSON() as number;

  let chronicle = await getOrCreate(store, Models.Chronicle, 'ChronicleKey')

  chronicle.curLease = leaseIdx.toNumber();
  chronicle.curLeaseStart = block.timestamp;
  chronicle.curLeaseEnd = block.timestamp + leasePeriod - 1

  await store.save(chronicle)
};

export async function handleLeasedSlot({
  store,
  event,
  block,
}: EventContext & StoreContext): Promise<void> {
  const [paraId, from, firstLease, leaseCount, extra, total] = new Types.Slots.LeasedEvent(event).params

  const lastLease = firstLease.toNumber() + leaseCount.toNumber() - 1;

  const totalUsed = total.toNumber();
  const extraAmount = extra.toNumber();

  const [ongoingAuction] = await store.find(Models.Auction, {where: {ongoing: true}, take: 1});
  const curAuction = ongoingAuction || { id: 'unknown', resultBlock: block.height, leaseEnd: null };

  if (curAuction.id === 'unknown') {
    let auction = await store.save(new Models.Auction({
      id: 'unknown',
      blockNum: block.height,
      status: 'Closed',
      slotsStart: 0,
      slotsEnd: 0,
      closingStart: 0,
      closingEnd: 0,
      ongoing: false
    }))
  }

  if (await isFundAddress(from.toString())) {
    let crowdloan = await store.find(Models.Crowdloan, {where: paraId.toString(), take: 1})
    crowdloan[0].status = 'Won'
    crowdloan[0].wonAuctionId = curAuction.id
    crowdloan[0].leaseExpiredBlock = curAuction.leaseEnd

    await store.save(crowdloan);
  }

  const { id: auctionId, resultBlock } = curAuction;
 
  const parachainLeases = await store.find(Models.ParachainLeases, {where: `${paraId}-${auctionId}-${firstLease}-${lastLease}`});
  
  parachainLeases[0].id = paraId.toString(),
  parachainLeases[0].leaseRange = `${auctionId}-${firstLease}-${lastLease}`,
  parachainLeases[0].firstLease = firstLease.toNumber()
  parachainLeases[0].lastLease = lastLease
  parachainLeases[0].latestBidAmount = new BN(totalUsed)
  parachainLeases[0].parachain.id = paraId.toString()
  parachainLeases[0].extraAmount = new BN(extraAmount)
  parachainLeases[0].winningAmount = new BN(totalUsed)
  parachainLeases[0].wonBidFrom = from.toHex()
  parachainLeases[0].winningResultBlock = resultBlock,
  parachainLeases[0].hasWon = true

  await store.save(parachainLeases);
};

const isFundAddress = async (address: string) => {
  let api = await service();
  const hexStr = api.createType('Address', address).toHex();
  return Buffer.from(hexStr.slice(4, 28), 'hex').toString().startsWith('modlpy/cfund');
};

const getLatestCrowdloanId = async (parachainId: string, store: DatabaseManager) => {

  const sequence = await store.get(Models.CrowdloanSequence,{
    where: { parachainId }
  })
  let api = await service();
  const curBlockNum = await api.query.system.number();
  if (sequence) {
    const crowdloanIdx = sequence.curIndex;
    const isReCreateCrowdloan = await getIsReCreateCrowdloan(`${parachainId}-${crowdloanIdx}`, store);
    let curIdex = crowdloanIdx;
    if (isReCreateCrowdloan) {
      curIdex = crowdloanIdx + 1;
      sequence.curIndex = curIdex;
      sequence.blockNum = curBlockNum.toNumber();
      await store.save(sequence);
    }
    return `${parachainId}-${curIdex}`;
  }
  else {
    let sequence = await getOrCreate(store, Models.CrowdloanSequence, parachainId)
    sequence.id = parachainId
    sequence.curIndex = 0
    sequence.createdAt = new Date()
    sequence.blockNum = curBlockNum
    await store.save(sequence)
  }
  return `${parachainId}-0`;
};

const getIsReCreateCrowdloan = async (fundId: string, store: DatabaseManager): Promise<Boolean> => {
  const fund = await store.find(Models.Crowdloan, {
    where: {
        id: fundId,
    },
    take: 1
  })
  const isReCreateCrowdloan = !!(
    fund[0]?.dissolvedBlock &&
    fund[0]?.status === 'Dissolved' &&
    fund[0]?.isFinished
  );
  return isReCreateCrowdloan;
};

async function getOrCreate<T extends {id: string}>(
  store: DatabaseManager,
  entityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> {

  let e = await store.get(entityConstructor, {
    where: { id },
  })

  if (e == null) {
    e = new entityConstructor()
    e.id = id
  }

  return e
}


type EntityConstructor<T> = {
  new (...args: any[]): T
}