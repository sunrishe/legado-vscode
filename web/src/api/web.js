import axios from "axios";

const vscode =
  typeof window.acquireVsCodeApi === "function" ? window.acquireVsCodeApi() : undefined;

const isVscode = () => !!vscode;

const getPanelTitle = () => {
  return localStorage.getItem("legadoPanelTitle") || document.title || "阅读";
};

const setPanelTitle = (title) => {
  localStorage.setItem("legadoPanelTitle", title);
  document.title = title;
  if (vscode) {
    vscode.postMessage({
      command: "setConfiguration",
      key: "legado-vscode.panelTitle",
      value: title
    });
  }
};

const getLegadoWebServeUrl = () => {
  let legadoWebServeUrl = localStorage.getItem("legadoWebServeUrl");
  return legadoWebServeUrl || import.meta.env.VITE_API || location.origin;
};

const setLegadoWebServeUrl = (url) => {
  localStorage.setItem("legadoWebServeUrl", url);
  if (vscode) {
    vscode.postMessage({
      command: "setConfiguration",
      key: "legado-vscode.webServeUrl",
      value: url
    });
  }
};

const checkLegadoWebServeUrl = (url) => {
  return axios
    .create({
      baseURL: url,
      timeout: 3000
    })
    .get("/getBookshelf");
};

const reload = () => {
  if (vscode) {
    vscode.postMessage({
      command: "reload"
    });
  } else {
    location.reload();
  }
};

const closePanel = () => {
  if (vscode) {
    vscode.postMessage({
      command: "close"
    });
  } else {
    window.close();
  }
};

export default {
  isVscode,
  getPanelTitle,
  setPanelTitle,
  getLegadoWebServeUrl,
  setLegadoWebServeUrl,
  checkLegadoWebServeUrl,
  reload,
  closePanel
};
