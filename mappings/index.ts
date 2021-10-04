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

 export async function handleEndowedBalances({
    store,
    event,
    block,
    extrinsic,
  }: EventContext & StoreContext): Promise<void> {

    const [fromAccount, accountBalance] = new Types.Balances.EndowedEvent(event).params

    const fromAcc = await getOrCreate(store, Models.Account, fromAccount.toHex())
    fromAcc.isFund = true
    await store.save(fromAcc);
  
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