import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@subsquid/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import {
  AccountId,
  AuctionIndex,
  Balance,
  BlockNumber,
  LeasePeriod,
  ParaId,
} from "@polkadot/types/interfaces";

export namespace Auctions {
  /**
   *  An auction started. Provides its index and the block number where it will begin to
   *  close and the first lease period of the quadruplet that is auctioned.
   *  `[auction_index, lease_period, ending]`
   *
   *  Event parameters: [AuctionIndex, LeasePeriod, BlockNumber, ]
   */
  export class AuctionStartedEvent {
    public readonly expectedParamTypes = [
      "AuctionIndex",
      "LeasePeriod",
      "BlockNumber",
    ];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AuctionIndex, LeasePeriod, BlockNumber] {
      return [
        createTypeUnsafe<AuctionIndex & Codec>(typeRegistry, "AuctionIndex", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<LeasePeriod & Codec>(typeRegistry, "LeasePeriod", [
          this.ctx.params[1].value,
        ]),
        createTypeUnsafe<BlockNumber & Codec>(typeRegistry, "BlockNumber", [
          this.ctx.params[2].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  /**
   *  An auction ended. All funds become unreserved. `[auction_index]`
   *
   *  Event parameters: [AuctionIndex, ]
   */
  export class AuctionClosedEvent {
    public readonly expectedParamTypes = ["AuctionIndex"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AuctionIndex] {
      return [
        createTypeUnsafe<AuctionIndex & Codec>(typeRegistry, "AuctionIndex", [
          this.ctx.params[0].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  /**
   *  Funds were reserved for a winning bid. First balance is the extra amount reserved.
   *  Second is the total. `[bidder, extra_reserved, total_amount]`
   *
   *  Event parameters: [AccountId, Balance, Balance, ]
   */
  export class ReservedEvent {
    public readonly expectedParamTypes = ["AccountId", "Balance", "Balance"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, Balance, Balance] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[1].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[2].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  /**
   *  Funds were unreserved since bidder is no longer active. `[bidder, amount]`
   *
   *  Event parameters: [AccountId, Balance, ]
   */
  export class UnreservedEvent {
    public readonly expectedParamTypes = ["AccountId", "Balance"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, Balance] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[1].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  /**
   *  Someone attempted to lease the same slot twice for a parachain. The amount is held in reserve
   *  but no parachain slot has been leased.
   *  `[parachain_id, leaser, amount]`
   *
   *  Event parameters: [ParaId, AccountId, Balance, ]
   */
  export class ReserveConfiscatedEvent {
    public readonly expectedParamTypes = ["ParaId", "AccountId", "Balance"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [ParaId, AccountId, Balance] {
      return [
        createTypeUnsafe<ParaId & Codec>(typeRegistry, "ParaId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[1].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[2].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  /**
   *  A new bid has been accepted as the current winner.
   *  `[who, para_id, amount, first_slot, last_slot]`
   *
   *  Event parameters: [AccountId, ParaId, Balance, LeasePeriod, LeasePeriod, ]
   */
  export class BidAcceptedEvent {
    public readonly expectedParamTypes = [
      "AccountId",
      "ParaId",
      "Balance",
      "LeasePeriod",
      "LeasePeriod",
    ];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, ParaId, Balance, LeasePeriod, LeasePeriod] {
      return [
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<ParaId & Codec>(typeRegistry, "ParaId", [
          this.ctx.params[1].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[2].value,
        ]),
        createTypeUnsafe<LeasePeriod & Codec>(typeRegistry, "LeasePeriod", [
          this.ctx.params[3].value,
        ]),
        createTypeUnsafe<LeasePeriod & Codec>(typeRegistry, "LeasePeriod", [
          this.ctx.params[4].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }

  /**
   *  The winning offset was chosen for an auction. This will map into the `Winning` storage map.
   *  `[auction_index, block_number]`
   *
   *  Event parameters: [AuctionIndex, BlockNumber, ]
   */
  export class WinningOffsetEvent {
    public readonly expectedParamTypes = ["AuctionIndex", "BlockNumber"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AuctionIndex, BlockNumber] {
      return [
        createTypeUnsafe<AuctionIndex & Codec>(typeRegistry, "AuctionIndex", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<BlockNumber & Codec>(typeRegistry, "BlockNumber", [
          this.ctx.params[1].value,
        ]),
      ];
    }

    validateParams(): boolean {
      if (this.expectedParamTypes.length !== this.ctx.params.length) {
        return false;
      }
      let valid = true;
      this.expectedParamTypes.forEach((type, i) => {
        if (type !== this.ctx.params[i].type) {
          valid = false;
        }
      });
      return valid;
    }
  }
}
