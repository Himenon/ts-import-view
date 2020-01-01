import * as React from "react";
import express from "express";
import compression from "compression";
import resolvePkg from "resolve-pkg";
import ReactDOMServer from "react-dom/server";
import { Editor } from "@code-dependency/view";
import { StaticRouter } from "react-router";
// import {} from "react-router-dom";
import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";

export const find = (searchPath: string) => {
  const result = resolvePkg(searchPath);
  if (result) {
    return result;
  }
  throw new Error(`Not found: ${searchPath}`);
};

const generateHtml = async (url: string, context: {}) => {
  const viz = new Viz({ Module, render });
  const injection = {
    createSvgString: (source: string) => viz.renderString(source),
  };
  console.log(injection);
  ReactDOMServer.renderToString(
    <StaticRouter location={url} context={context}>
      <Editor.Container />
    </StaticRouter>,
  );
};

export const createServer = async () => {
  const app = express();

  app.use(
    compression({
      threshold: 0,
      level: 9,
      memLevel: 9,
    }),
  );

  app.get("/", async (req, res) => {
    try {
      const html = await generateHtml(req.url, {});
      console.log({ html });
      res.send(html);
      res.end();
    } catch (error) {
      console.error(error);
    }
  });

  // app.use("/scripts", express.static(find("@code-dependency/view/dist/scripts"), { maxAge: "5000" }));

  return app;
};
