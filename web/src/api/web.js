import axios from "axios";

// @ts-ignore
const vscode = typeof acquireVsCodeApi === "function" ? acquireVsCodeApi() : undefined;

const isVscode = () => !!vscode;

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

export default {
  isVscode,
  getLegadoWebServeUrl,
  setLegadoWebServeUrl,
  checkLegadoWebServeUrl,
  reload
};
