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

/**
 * @todo handlers for the events mapped in manifest.yml
 */

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

    const chronicle = await getOrCreate(store, Models.Chronicle, 'ChronicleKey')
    chronicle.curAuctionId = auctionId.toString();
    await store.save(chronicle);

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

  const chronicle = await getOrCreate(store, Models.Chronicle, 'ChronicleKey')
  chronicle.curAuctionId = ''
  await store.save(chronicle);

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