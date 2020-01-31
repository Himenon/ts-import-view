import * as Domain from "@app/domain";
import * as React from "react";
import { generateStore, Store } from "./Store";
import { Editor } from "@app/component";
import * as GraphvizViewer from "../GraphvizViewer";
import * as FileTree from "../FileTree";
import { ServerSideRenderingProps } from "@app/interface";
import { useLocation } from "react-router-dom";

const generateProps = (store: Store): Editor.Props => {
  return {
    fileTree: FileTree.generateProps(store.fileTree),
    graphvizViewer: GraphvizViewer.generateProps(store.graphvizViewer),
    current: store.current || "no selected",
  };
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const Container = (props: ServerSideRenderingProps) => {
  const query = useQuery();
  const pathname = query.get("pathname");
  console.log({ pathname });
  const createReducer = <T, S>([state, dispatch]: [T, S]): { state: T; dispatch: S } => ({ state, dispatch });
  const reducers = Domain.Graphviz.createReducers({
    isServer: props.isServer,
    isStatic: props.isStatic,
    svgSource: props.state.source.data,
    filePathList: props.state.filePathList,
    currentSelectedPath: undefined,
  });
  const domainStores: Domain.Graphviz.Stores = {
    graphviz: createReducer(React.useReducer(...reducers.graphviz)),
  };
  const viewStore = generateStore(domainStores, props.injection);
  return <Editor.Component {...generateProps(viewStore)} />;
};
