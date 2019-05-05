import * as Domain from "@app/domain";
import * as Types from "@app/types";
import * as path from "path";
import { Directory, File } from "./Constants";

export interface Store {
  rootDirectory: Directory;
}

type Items = Array<File | Directory>;

interface FlatFileMap {
  [dirname: string]: File[];
}

const deleteItem = (arr: any[], value: any): void => {
  const idx = arr.findIndex(t => t === value);
  delete arr[idx];
};

const generateDirectory = (directoryPath: string, basename: string, items: Items): Directory => {
  return {
    type: "directory",
    path: directoryPath,
    basename,
    items,
    children: basename,
    level: directoryPath.split(path.sep).length - 1,
  };
};

const generateFile = (dependency: Types.Dependency): File => {
  return {
    type: "file",
    path: dependency.source,
    basename: path.basename(dependency.source),
    children: path.basename(dependency.source),
    level: dependency.source.split(path.sep).length,
  };
};

const generateItems = (parentDirname: string, directories: string[], flatFileMap: { [dirname: string]: File[] }): Items => {
  const childDirectories = directories.filter(dirname => path.dirname(dirname) === parentDirname);
  // TODO マシな実装を考える
  childDirectories.forEach(value => deleteItem(directories, value));
  const items: Items = childDirectories.map(directoryPath => {
    const basename = path.basename(directoryPath);
    return generateDirectory(directoryPath, basename, generateItems(directoryPath, directories, flatFileMap));
  });
  return items.concat(flatFileMap[parentDirname] || []).filter(a => !!a);
};

const generateFolderTree = (dependencies: Types.FlatDependencies): Directory => {
  const flatFileMap: FlatFileMap = {};
  dependencies.forEach(dep => {
    const dirname = path.dirname(dep.source);
    const item: File = generateFile(dep);
    (flatFileMap[dirname] ? flatFileMap[dirname] : (flatFileMap[dirname] = [])).push(item);
  });
  const directories = Object.keys(flatFileMap);
  const directoryPath = ".";
  const basename = path.basename(directoryPath);
  return generateDirectory(directoryPath, basename, generateItems(directoryPath, directories, flatFileMap));
};

export const generateStore = (domainStores: Domain.Stores): Store => {
  const rootDirectory = generateFolderTree(domainStores.app.state.flatDependencies);
  return {
    rootDirectory,
  };
};
