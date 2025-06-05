import { JwtProvider } from "src/adapters/providers/JwtProvider";
import { ListEnergyBillFilter } from "src/core/domain/filters/ListEnergyBillFilter";
import { EnergyBillDynamoDbRepository } from "src/database/dynamodb/repositories/EnergyBillDynamoRepository";
import yargs from "yargs";

export class DevSandboxCommand {
  static Command(): yargs.CommandModule {
    return {
      command: "dev-sandbox",
      describe: "dev-sandbox",
      builder: (yargs) => {
        return yargs;
      },

      handler: async (args: yargs.ArgumentsCamelCase<any>) => {
        try {
          const repo = new EnergyBillDynamoDbRepository(
            "sintese",
            new JwtProvider(process.env.JWT_KEY as string),
          );
          const filter = new ListEnergyBillFilter({
            userId: "01972d36-00b7-7617-b9e5-f228a0545ec2",
            limit: 1,
          });

          const result = await repo.list(filter);
          if (!result.isSuccess()) {
            console.log(result.getError().getErrorDescription());
            process.exit(1);
          }

          for (const r of result.getPayload().getItems()) {
            console.log(r.serialize());
          }

          console.log("done! token: - ", result.getPayload().getPageToken());
        } catch (e) {
          console.log((<Error>e).message);
        }
      },
    };
  }
}
