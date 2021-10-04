import { createTypeUnsafe } from "@polkadot/types/create";
import { SubstrateEvent, SubstrateExtrinsic } from "@subsquid/hydra-common";
import { Codec } from "@polkadot/types/types";
import { typeRegistry } from ".";

import {
  AccountId,
  Balance,
  LeasePeriod,
  ParaId,
} from "@polkadot/types/interfaces";

export namespace Slots {
  /**
   *  A para has won the right to a continuous set of lease periods as a parachain.
   *  First balance is any extra amount reserved on top of the para's existing deposit.
   *  Second balance is the total amount reserved.
   *  `[parachain_id, leaser, period_begin, period_count, extra_reserved, total_amount]`
   *
   *  Event parameters: [ParaId, AccountId, LeasePeriod, LeasePeriod, Balance, Balance, ]
   */
  export class LeasedEvent {
    public readonly expectedParamTypes = [
      "ParaId",
      "AccountId",
      "LeasePeriod",
      "LeasePeriod",
      "Balance",
      "Balance",
    ];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [
      ParaId,
      AccountId,
      LeasePeriod,
      LeasePeriod,
      Balance,
      Balance
    ] {
      return [
        createTypeUnsafe<ParaId & Codec>(typeRegistry, "ParaId", [
          this.ctx.params[0].value,
        ]),
        createTypeUnsafe<AccountId & Codec>(typeRegistry, "AccountId", [
          this.ctx.params[1].value,
        ]),
        createTypeUnsafe<LeasePeriod & Codec>(typeRegistry, "LeasePeriod", [
          this.ctx.params[2].value,
        ]),
        createTypeUnsafe<LeasePeriod & Codec>(typeRegistry, "LeasePeriod", [
          this.ctx.params[3].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[4].value,
        ]),
        createTypeUnsafe<Balance & Codec>(typeRegistry, "Balance", [
          this.ctx.params[5].value,
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
   *  A new `[lease_period]` is beginning.
   *
   *  Event parameters: [LeasePeriod, ]
   */
  export class NewLeasePeriodEvent {
    public readonly expectedParamTypes = ["LeasePeriod"];

    constructor(public readonly ctx: SubstrateEvent) {}

    get params(): [LeasePeriod] {
      return [
        createTypeUnsafe<LeasePeriod & Codec>(typeRegistry, "LeasePeriod", [
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
