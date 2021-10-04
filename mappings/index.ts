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

/**
 * @todo handlers for the events mapped in manifest.yml
 */

 export async function handleAuctionStarted({
    store,
    event,
    block,
    extrinsic,
  }: EventContext & StoreContext): Promise<void> {
    const endingPeriod = api.consts.auctions.endingPeriod.toJSON() as number;
    const leasePeriod = api.consts.slots.leasePeriod.toJSON() as number;
    const periods = api.consts.auctions.leasePeriodsPerSlot.toJSON() as number;
    const { event, block } = substrateEvent;
    const { timestamp: createdAt, block: rawBlock } = block;
    const [auctionId, slotStart, auctionEnds] = event.data.toJSON() as [number, number, number];
    await store.save('Auction', {
      id: auctionId.toString(),
      blockNum: rawBlock.header.number.toNumber(),
      status: 'Started',
      slotsStart: slotStart,
      slotsEnd: slotStart + periods - 1,
      leaseStart: slotStart * leasePeriod,
      leaseEnd: (slotStart + periods - 1) * leasePeriod,
      createdAt,
      closingStart: auctionEnds,
      ongoing: true,
      closingEnd: auctionEnds + endingPeriod
    });
  
    const chronicle = await Chronicle.get(ChronicleKey);
    chronicle.curAuctionId = auctionId.toString();
    await chronicle.save();
  
    logger.info(`Auction ${auctionId} saved`);
  };
}
  
  export const handleAuctionClosed = async (substrateEvent: SubstrateEvent) => {
    const { event } = substrateEvent;
    const [auctionId] = event.data.toJSON() as [number];
    const auction = await Auction.get(auctionId.toString());
    auction.status = 'Closed';
    auction.ongoing = false;
    await auction.save();
    const chronicle = await Chronicle.get(ChronicleKey);
    chronicle.curAuctionId = null;
    chronicle.save();
  };
  
  export const handleAuctionWinningOffset = async (substrateEvent: SubstrateEvent) => {
    const { event } = substrateEvent;
    const [auctionId, offsetBlock] = event.data.toJSON() as [number, number];
    const auction = await Auction.get(auctionId.toString());
    auction.resultBlock = auction.closingStart + offsetBlock;
    logger.info(`Update auction ${auctionId} winning offset: ${auction.resultBlock}`);
    await auction.save();
  };
  
  const markLosingBids = async (auctionId: number, slotStart: number, slotEnd: number, winningBidId: string) => {
    const winningBids = (await Bid.getByWinningAuction(auctionId)) || [];
    const losingBids = winningBids.filter(
      ({ firstSlot, lastSlot, id }) => id !== winningBidId && slotStart == firstSlot && slotEnd == lastSlot
    );
    for (const bid of losingBids) {
      bid.winningAuction = null;
      await bid.save();
      logger.info(`Mark Bid as losing bid ${bid.id}`);
    }
  };
  
  const markParachainLeases = async (
    auctionId: number,
    paraId: number,
    leaseStart: number,
    leaseEnd: number,
    bidAmount: number
  ) => {
    const leaseRange = `${auctionId}-${leaseStart}-${leaseEnd}`;
    const { id: parachainId } = await Storage.ensureParachain(paraId);
    const winningLeases = (await ParachainLeases.getByLeaseRange(leaseRange)) || [];
    const losingLeases = winningLeases.filter((lease) => lease.paraId !== paraId);
    for (const lease of losingLeases) {
      lease.activeForAuction = null;
      await lease.save();
      logger.info(`Mark losing parachain leases ${lease.paraId} for ${lease.leaseRange}`);
    }
    await Storage.upsert('ParachainLeases', `${paraId}-${leaseRange}`, {
      paraId,
      leaseRange,
      parachainId,
      firstLease: leaseStart,
      lastLease: leaseEnd,
      auctionId,
      latestBidAmount: bidAmount,
      activeForAuction: auctionId,
      hasWon: false
    });
  };
  
  /**
   *
   * @param substrateEvent SubstrateEvent
   * Create Bid record and create auction parachain record if not exists already
   * Skip winning bid before we have query abilities
   */
  export const handleBidAccepted = async (substrateEvent: SubstrateEvent) => {
    const { event, block } = substrateEvent;
    const { timestamp: createdAt, block: rawBlock } = block;
    const blockNum = rawBlock.header.number.toNumber();
    const [from, paraId, amount, firstSlot, lastSlot] = event.data.toJSON() as [
      string,
      number,
      number | string,
      number,
      number
    ];
    const auctionId = (await api.query.auctions.auctionCounter()).toJSON() as number;
    const isFund = isFundAddress(from);
    const parachain = await Storage.ensureParachain(paraId);
    const { id: parachainId } = parachain;
  
    const fundId = await Storage.getLatestCrowdloanId(parachainId);
    const bidAmount = parseNumber(amount);
    const bid = {
      id: `${blockNum}-${from}-${paraId}-${firstSlot}-${lastSlot}`,
      auctionId: `${auctionId}`,
      blockNum,
      winningAuction: auctionId,
      parachainId,
      isCrowdloan: isFund,
      amount: parseNumber(amount),
      firstSlot,
      lastSlot,
      createdAt,
      fundId: isFund ? fundId : null,
      bidder: isFund ? null : from
    };
  
    logger.info(`Bid detail: ${JSON.stringify(bid, null, 2)}`);
    const { id: bidId } = await Storage.save('Bid', bid);
    logger.info(`Bid saved: ${bidId}`);
  
    await markParachainLeases(auctionId, paraId, firstSlot, lastSlot, bidAmount);
  
    await markLosingBids(auctionId, firstSlot, lastSlot, bidId);
  
    const auctionParaId = `${paraId}-${firstSlot}-${lastSlot}-${auctionId}`;
    const auctionPara = await AuctionParachain.get(auctionParaId);
    if (!auctionPara) {
      const { id } = await Storage.save('AuctionParachain', {
        id: `${paraId}-${firstSlot}-${lastSlot}-${auctionId}`,
        parachainId,
        auctionId,
        firstSlot,
        lastSlot,
        createdAt,
        blockNum
      });
      logger.info(`Create AuctionParachain: ${id}`);
    }
  };
  
  export const updateBlockNum = async (block: SubstrateBlock) => {
    await Storage.upsert<Chronicle>('Chronicle', ChronicleKey, {
      curBlockNum: block.block.header.number.toNumber()
    });
  };
  
  export const updateWinningBlocks = async (block: SubstrateBlock) => {
    const { curAuctionId, curBlockNum } = (await Chronicle.get(ChronicleKey)) || {};
    const { closingStart, closingEnd } = (await Auction.get(curAuctionId || '')) || {};
  
    if (curAuctionId && curBlockNum >= closingStart && curBlockNum < closingEnd) {
      const winningLeases = await ParachainLeases.getByActiveForAuction(curAuctionId);
      for (const lease of winningLeases) {
        lease.numBlockWon = (lease.numBlockWon || 0) + 1;
        await lease.save();
      }
    }
  };
 export async function handleEvent(event: SubstrateEvent): Promise<void> {
    const {
      event: { method, section },
      block: {
        block: { header }
      },
      idx,
      extrinsic
    } = event;
  
    const eventType = `${section}/${method}`;
    const { method: extMethod, section: extSection } = extrinsic?.extrinsic.method || {};
    const handler = eventsMapping[eventType];
    if (handler) {
      logger.info(
        `
        Event ${eventType} at ${idx} received, block: ${header.number.toNumber()}, extrinsic: ${extSection}/${extMethod}:
        -------------
          ${JSON.stringify(event.toJSON(), null, 2)} ${JSON.stringify(event.toHuman(), null, 2)}
        =============
        `
      );
      await handler(event);
    }
  }

//  export async function balancesTransfer({
//     store,
//     event,
//     block,
//     extrinsic,
//   }: EventContext & StoreContext): Promise<void> {
  
//     const [from, to, value] = new Types.Balances.TransferEvent(event).params
//     const tip = extrinsic ? new BN(extrinsic.tip.toString(10)) : new BN(0)
  
//     const fromAcc = await getOrCreate(store, Models.Account, from.toHex())
//     fromAcc.wallet = from.toHuman()
//     fromAcc.balance = fromAcc.balance || new BN(0)
//     fromAcc.balance = fromAcc.balance.sub(value)
//     fromAcc.balance = fromAcc.balance.sub(tip)
//     await store.save(fromAcc)
  
//     const toAcc = await getOrCreate(store, Account, to.toHex())
//     toAcc.wallet = to.toHuman()
//     toAcc.balance = toAcc.balance || new BN(0)
//     toAcc.balance = toAcc.balance.add(value)
//     await store.save(toAcc)
  
//     const hbFrom = new HistoricalBalance()
//     hbFrom.account = fromAcc;
//     hbFrom.balance = fromAcc.balance;
//     hbFrom.timestamp = new BN(block.timestamp)
//     await store.save(hbFrom)
  
//     const hbTo = new HistoricalBalance()
//     hbTo.account = toAcc;
//     hbTo.balance = toAcc.balance;
//     hbTo.timestamp = new BN(block.timestamp)
//     await store.save(hbTo)
//   }
  
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


/**
 * 
 * 
 * import { SignedBlock } from '@polkadot/types/interfaces';
import { SubstrateExtrinsic, SubstrateEvent } from '@subql/types';
import { SubstrateBlock } from '@subql/types';

import {
  handleCrowdloanContributed,
  handleCrowdloanCreated,
  handleCrowdloanDissolved,
  handleParachainRegistered,
  updateCrowdloanStatus
} from '../handlers/parachain-handler';
import {
  handleAuctionClosed,
  handleAuctionStarted,
  handleAuctionWinningOffset,
  handleBidAccepted,
  updateBlockNum,
  updateWinningBlocks
} from '../handlers/auction-handler';
import { Chronicle } from '../types/models/Chronicle';
import { ChronicleKey } from '../constants';
import { handleNewLeasePeriod, handleSlotsLeased } from '../handlers/lease-handler';

const noop = async () => {};

const eventsMapping = {
  'registrar/Registered': handleParachainRegistered,
  'crowdloan/Created': handleCrowdloanCreated,
  'auctions/AuctionStarted': handleAuctionStarted,
  'auctions/AuctionClosed': handleAuctionClosed,
  'auctions/WinningOffset': handleAuctionWinningOffset,
  'auctions/BidAccepted': handleBidAccepted,
  'auctions/Reserved': noop,
  'auctions/Unreserved': noop,
  'crowdloan/HandleBidResult': noop,
  'slots/Leased': handleSlotsLeased,
  'slots/NewLeasePeriod': handleNewLeasePeriod,
  'crowdloan/Contributed': handleCrowdloanContributed,
  'crowdloan/Dissolved': handleCrowdloanDissolved
};

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  await updateBlockNum(block);
  await updateWinningBlocks(block);
  await updateCrowdloanStatus(block);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  const {
    event: { method, section },
    block: {
      block: { header }
    },
    idx,
    extrinsic
  } = event;

  const eventType = `${section}/${method}`;
  const { method: extMethod, section: extSection } = extrinsic?.extrinsic.method || {};
  const handler = eventsMapping[eventType];
  if (handler) {
    logger.info(
      `
      Event ${eventType} at ${idx} received, block: ${header.number.toNumber()}, extrinsic: ${extSection}/${extMethod}:
      -------------
        ${JSON.stringify(event.toJSON(), null, 2)} ${JSON.stringify(event.toHuman(), null, 2)}
      =============
      `
    );
    await handler(event);
  }
}

const init = async () => {
  const chronicle = await Chronicle.get(ChronicleKey);
  if (!chronicle) {
    logger.info('Setup Chronicle');
    await Chronicle.create({ id: ChronicleKey })
      .save()
      .catch((err) => logger.error(err));
  }
};

init();

 * 
 * 
 */