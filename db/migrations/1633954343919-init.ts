import {MigrationInterface, QueryRunner} from "typeorm";

export class init1633954343919 implements MigrationInterface {
    name = 'init1633954343919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "is_funded" boolean NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parachain_leases" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "para_id" integer NOT NULL, "parachain_id" character varying NOT NULL, "lease_range" character varying NOT NULL, "first_lease" integer NOT NULL, "last_lease" integer NOT NULL, "latest_bid_amount" numeric NOT NULL, "auction_id" character varying, "active_for_auction" character varying, "winning_amount" numeric, "extra_amount" numeric, "won_bid_from" character varying, "num_block_won" integer, "winning_result_block" integer, "has_won" boolean NOT NULL, CONSTRAINT "PK_fda8294c956880bda2771666a91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contribution" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "account" character varying NOT NULL, "parachain_id" character varying NOT NULL, "fund_id" character varying NOT NULL, "amount" numeric NOT NULL, "block_num" integer NOT NULL, CONSTRAINT "PK_878330fa5bb34475732a5883d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crowdloan" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "parachain_id" character varying NOT NULL, "depositor" character varying NOT NULL, "verifier" character varying, "cap" numeric NOT NULL, "raised" numeric NOT NULL, "lock_expired_block" integer NOT NULL, "block_num" integer, "first_slot" integer NOT NULL, "last_slot" integer NOT NULL, "status" character varying NOT NULL, "lease_expired_block" integer, "dissolved_block" integer, "is_finished" boolean, "won_auction_id" character varying, CONSTRAINT "PK_19a05e349701577c8c1679ae84d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chronicle" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "cur_auction_id" character varying, "cur_block_num" integer, "cur_lease" integer, "cur_lease_start" integer, "cur_lease_end" integer, CONSTRAINT "PK_1cfaa3cc7527bef31f9c85700f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "parachain" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "para_id" integer NOT NULL, "creation_block" integer, "deregistered" boolean NOT NULL, "deposit" numeric NOT NULL, "manager" character varying NOT NULL, "active_fund_id" character varying, "latest_bid_id" character varying, "chronicle_id" character varying, CONSTRAINT "PK_0f6ac85862a6ca7c8873f699b61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bid" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "auction_id" character varying NOT NULL, "winning_auction" integer, "block_num" integer NOT NULL, "parachain_id" character varying NOT NULL, "is_crowdloan" boolean NOT NULL, "amount" numeric NOT NULL, "fund_id" character varying, "first_slot" integer NOT NULL, "last_slot" integer NOT NULL, "bidder" character varying, CONSTRAINT "PK_ed405dda320051aca2dcb1a50bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auction" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "block_num" integer NOT NULL, "status" character varying NOT NULL, "lease_start" integer, "slots_start" integer NOT NULL, "lease_end" integer, "slots_end" integer NOT NULL, "closing_start" integer NOT NULL, "closing_end" integer NOT NULL, "result_block" integer, "ongoing" boolean NOT NULL, CONSTRAINT "PK_9dc876c629273e71646cf6dfa67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auction_parachain" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "auction_id" character varying NOT NULL, "parachain_id" character varying NOT NULL, "block_num" integer NOT NULL, "first_slot" integer NOT NULL, "last_slot" integer NOT NULL, CONSTRAINT "PK_f405bf3c601f7e5f97d9b1abd94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "crowdloan_sequence" ("id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by_id" character varying NOT NULL, "updated_at" TIMESTAMP DEFAULT now(), "updated_by_id" character varying, "deleted_at" TIMESTAMP, "deleted_by_id" character varying, "version" integer NOT NULL, "cur_index" integer NOT NULL, "block_num" integer NOT NULL, CONSTRAINT "PK_52c7e654f01224a6592dee9e0b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "parachain_leases" ADD CONSTRAINT "FK_d1ccf431430ad6ce759c972ddb1" FOREIGN KEY ("parachain_id") REFERENCES "parachain"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parachain_leases" ADD CONSTRAINT "FK_7237948a5f4178c1272c69f2429" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_676bed3b91141b1f2f4dde1cf28" FOREIGN KEY ("parachain_id") REFERENCES "parachain"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contribution" ADD CONSTRAINT "FK_df5e763df749a70ec9d97628383" FOREIGN KEY ("fund_id") REFERENCES "crowdloan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "crowdloan" ADD CONSTRAINT "FK_005883fcd4519fa5ae88706b3a5" FOREIGN KEY ("parachain_id") REFERENCES "parachain"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chronicle" ADD CONSTRAINT "FK_f00a0560b45ec136d79e34d80b0" FOREIGN KEY ("cur_auction_id") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parachain" ADD CONSTRAINT "FK_09ac4bf23537e5ed0338e001622" FOREIGN KEY ("active_fund_id") REFERENCES "crowdloan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parachain" ADD CONSTRAINT "FK_0cdb65f05cd1f552b7d8440189d" FOREIGN KEY ("latest_bid_id") REFERENCES "bid"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "parachain" ADD CONSTRAINT "FK_84af721a534ead61258d44fe10c" FOREIGN KEY ("chronicle_id") REFERENCES "chronicle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_9e594e5a61c0f3cb25679f6ba8d" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_930058fc447bce976650cf08f67" FOREIGN KEY ("parachain_id") REFERENCES "parachain"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bid" ADD CONSTRAINT "FK_1d89857ddf5ad51e46e929c86b5" FOREIGN KEY ("fund_id") REFERENCES "crowdloan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auction_parachain" ADD CONSTRAINT "FK_bcdc4b1c157f29429b97a35809c" FOREIGN KEY ("auction_id") REFERENCES "auction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auction_parachain" ADD CONSTRAINT "FK_09813e8f090426a27be8f789498" FOREIGN KEY ("parachain_id") REFERENCES "parachain"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_parachain" DROP CONSTRAINT "FK_09813e8f090426a27be8f789498"`);
        await queryRunner.query(`ALTER TABLE "auction_parachain" DROP CONSTRAINT "FK_bcdc4b1c157f29429b97a35809c"`);
        await queryRunner.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_1d89857ddf5ad51e46e929c86b5"`);
        await queryRunner.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_930058fc447bce976650cf08f67"`);
        await queryRunner.query(`ALTER TABLE "bid" DROP CONSTRAINT "FK_9e594e5a61c0f3cb25679f6ba8d"`);
        await queryRunner.query(`ALTER TABLE "parachain" DROP CONSTRAINT "FK_84af721a534ead61258d44fe10c"`);
        await queryRunner.query(`ALTER TABLE "parachain" DROP CONSTRAINT "FK_0cdb65f05cd1f552b7d8440189d"`);
        await queryRunner.query(`ALTER TABLE "parachain" DROP CONSTRAINT "FK_09ac4bf23537e5ed0338e001622"`);
        await queryRunner.query(`ALTER TABLE "chronicle" DROP CONSTRAINT "FK_f00a0560b45ec136d79e34d80b0"`);
        await queryRunner.query(`ALTER TABLE "crowdloan" DROP CONSTRAINT "FK_005883fcd4519fa5ae88706b3a5"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_df5e763df749a70ec9d97628383"`);
        await queryRunner.query(`ALTER TABLE "contribution" DROP CONSTRAINT "FK_676bed3b91141b1f2f4dde1cf28"`);
        await queryRunner.query(`ALTER TABLE "parachain_leases" DROP CONSTRAINT "FK_7237948a5f4178c1272c69f2429"`);
        await queryRunner.query(`ALTER TABLE "parachain_leases" DROP CONSTRAINT "FK_d1ccf431430ad6ce759c972ddb1"`);
        await queryRunner.query(`DROP TABLE "crowdloan_sequence"`);
        await queryRunner.query(`DROP TABLE "auction_parachain"`);
        await queryRunner.query(`DROP TABLE "auction"`);
        await queryRunner.query(`DROP TABLE "bid"`);
        await queryRunner.query(`DROP TABLE "parachain"`);
        await queryRunner.query(`DROP TABLE "chronicle"`);
        await queryRunner.query(`DROP TABLE "crowdloan"`);
        await queryRunner.query(`DROP TABLE "contribution"`);
        await queryRunner.query(`DROP TABLE "parachain_leases"`);
        await queryRunner.query(`DROP TABLE "account"`);
    }

}
