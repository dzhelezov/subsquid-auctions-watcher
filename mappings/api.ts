const{ ApiPromise, WsProvider } = require('@polkadot/api')

export async function service(): Promise<any> {
    const provider = new WsProvider('wss://kusama-rpc.polkadot.io/')
    const api = await ApiPromise.create({ provider })
    return api
}
