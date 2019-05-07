import * as Domain from "@app/domain";
import * as React from "react";
import * as Dendrogram from "../Dendrogram";
import * as Menu from "../Menu";
import * as ProjectMenu from "../ProjectMenu";
import { createViewStore, ViewStore } from "./Store";
import * as Template from "./Template";

const generateProps = (stores: Domain.Stores, viewStore: ViewStore): Template.Props => {
  return {
    Dendrogram: <Dendrogram.Container store={viewStore.dendrogram} />,
    Menu: <Menu.Container store={viewStore.menu} />,
    ProjectMenu: <ProjectMenu.Container store={viewStore.projectMenu} />,
    rootSource: stores.app.state.rootSource,
  };
};

export const Container = ({ reducers }: { reducers: Domain.Reducers }) => {
  const createReducer = <T, S>([state, dispatch]: [T, S]): { state: T; dispatch: S } => ({ state, dispatch });
  const domainStores: Domain.Stores = {
    app: createReducer(React.useReducer(...reducers.app)),
    dendrogram: createReducer(React.useReducer(...reducers.dendrogram)),
    project: createReducer(React.useReducer(...reducers.project)),
  };
  const viewStore = createViewStore(domainStores);
  return <Template.Component {...generateProps(domainStores, viewStore)} />;
};
