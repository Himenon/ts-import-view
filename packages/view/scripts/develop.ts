

// Do this as the first thing so that any code reading it knows the right env.
// Ensure environment variables are read.
import "../config//env";

import * as fs from "fs";
import * as webpack from "webpack";
import * as WebpackDevServer from "webpack-dev-server";
import { paths } from "../config/paths";
import { rewriteTsconfig } from "../config/setup";
import { configFactory } from "./webpack/webpack.config";
import { createDevServerConfig } from "./webpack/webpackDevServer.config";

process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
  throw err;
});
const chalk = require("react-dev-utils/chalk");
const clearConsole = require("react-dev-utils/clearConsole");
const checkRequiredFiles = require("react-dev-utils/checkRequiredFiles");
const { choosePort, createCompiler, prepareProxy, prepareUrls } = require("react-dev-utils/WebpackDevServerUtils");
const openBrowser = require("react-dev-utils/openBrowser");

rewriteTsconfig(true);

const useYarn = fs.existsSync(paths.yarnLockFile);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = process.env.HOST || "0.0.0.0";

if (process.env.HOST) {
  console.log(chalk.cyan(`Attempting to bind to HOST environment variable: ${chalk.yellow(chalk.bold(process.env.HOST))}`));
  console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`);
  console.log(`Learn more here: ${chalk.yellow("http://bit.ly/CRA-advanced-config")}`);
  console.log();
}

// We require that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require("react-dev-utils/browsersHelper");
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then((port: number | null) => {
    if (port === null) {
      // We have not found a port.
      return;
    }
    const config = configFactory("development");
    const protocol = process.env.HTTPS === "true" ? "https" : "http";
    const appName = require(paths.appPackageJson).name;
    const useTypeScript = fs.existsSync(paths.appTsConfig);
    const urls = prepareUrls(protocol, HOST, port);
    const devSocket = {
      warnings: warnings => (devServer as any).sockWrite((devServer as any).sockets, "warnings", warnings),
      errors: errors => (devServer as any).sockWrite((devServer as any).sockets, "errors", errors),
    };
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler({
      appName,
      config,
      devSocket,
      urls,
      useYarn,
      useTypeScript,
      webpack,
    });
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
    // Serve webpack assets generated by the compiler over a web server.
    const serverConfig = createDevServerConfig(proxyConfig, urls.lanUrlForConfig);
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, (err: any) => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan("Starting the development server...\n"));
      openBrowser(urls.localUrlForBrowser);
    });

    (["SIGINT", "SIGTERM"] as NodeJS.Signals[]).forEach(sig => {
      process.on(sig, () => {
        rewriteTsconfig(false);
        devServer.close();
        process.exit();
      });
    });
  })
  .catch((err: any) => {
    if (err && err.message) {
      console.log(err.message);
    }
    rewriteTsconfig(false);
    process.exit(1);
  });
