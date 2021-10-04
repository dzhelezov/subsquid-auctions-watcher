import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@subsquid/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import {
  AccountId,
  Balance,
  DispatchResult,
  ParaId,
} from "@polkadot/types/interfaces";

export namespace Crowdloan {
  /**
   *  Create a new crowdloaning campaign. `[fund_index]`
   *
   *  Event parameters: [ParaId, ]
   */
  export class CreatedEvent {
    public readonly expectedParamTypes = ["ParaId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [ParaId] {
      return [
        createTypeUnsafe<ParaId & Codec>(typeRegistry, "ParaId", [
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
   *  Contributed to a crowd sale. `[who, fund_index, amount]`
   *
   *  Event parameters: [AccountId, ParaId, Balance, ]
   */
  export class ContributedEvent {
    public readonly expectedParamTypes = ["AccountId", "ParaId", "Balance"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, ParaId, Balance] {
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
   *  Withdrew full balance of a contributor. `[who, fund_index, amount]`
   *
   *  Event parameters: [AccountId, ParaId, Balance, ]
   */
  export class WithdrewEvent {
    public readonly expectedParamTypes = ["AccountId", "ParaId", "Balance"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [AccountId, ParaId, Balance] {
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
   *  Fund is dissolved. `[fund_index]`
   *
   *  Event parameters: [ParaId, ]
   */
  export class DissolvedEvent {
    public readonly expectedParamTypes = ["ParaId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [ParaId] {
      return [
        createTypeUnsafe<ParaId & Codec>(typeRegistry, "ParaId", [
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
   *  The result of trying to submit a new bid to the Slots pallet.
   *
   *  Event parameters: [ParaId, DispatchResult, ]
   */
  export class HandleBidResultEvent {
    public readonly expectedParamTypes = ["ParaId", "DispatchResult"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [ParaId, DispatchResult] {
      return [
        createTypeUnsafe<ParaId & Codec>(typeRegistry, "ParaId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<DispatchResult & Codec>(
          typeRegistry,
          "DispatchResult",
          [this.ctx.params[1].value]
        ),
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
   *  A parachain has been moved to `NewRaise`
   *
   *  Event parameters: [ParaId, ]
   */
  export class AddedToNewRaiseEvent {
    public readonly expectedParamTypes = ["ParaId"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [ParaId] {
      return [
        createTypeUnsafe<ParaId & Codec>(typeRegistry, "ParaId", [
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
}
