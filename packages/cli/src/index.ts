import { logger } from "./logger";
import { createServer } from "./server";
import { gather } from "./utils";
import * as path from "path";
import * as Cli from "./cli";

import { SourcePathInvalidError } from "./exceptions";

import * as Service from "./service";
import * as Config from "./config";

const main = async () => {
  const args = Cli.executeCommandLine();
  const pathList = await gather(args.source.rootAbsolutePath);

  const filePathList = pathList.map(pathname => ({
    source: path.relative(args.source.rootDir, pathname),
  }));
  const config = Config.create(args.port, args.source.rootAbsolutePath, filePathList);
  const tsconfigFilePath = args.tsconfig && args.tsconfig.rootAbsolutePath;

  const service = await Service.create({ tsconfigFilePath });
  const server = createServer(service, config);

  logger.info(`Start: http://localhost:${args.port}`);
  server.listen(args.port);
};

main().catch(error => {
  if (error instanceof SourcePathInvalidError) {
    process.exit(0);
  } else {
    console.error(error);
    process.exit(1);
  }
});
