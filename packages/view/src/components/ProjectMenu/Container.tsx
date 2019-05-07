import * as React from "react";
import * as ProjectMenu from "./ProjectMenu";

import { Store } from "./Store";

const generateProps = (store: Store): ProjectMenu.Props => {
  return {
    current: store.current,
    projects: store.projects,
  };
};

export const Container = ({ store }: { store: Store }) => {
  if (!store.hasProjects) {
    return null;
  }
  return <ProjectMenu.Component {...generateProps(store)} />;
};
