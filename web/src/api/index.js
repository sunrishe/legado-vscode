import ajax from "./axios";
import WEB from "@/api/web";

/** https://github.com/LegadoTeam/legado/tree/master/app/src/main/java/io/legado/app/api */
/** https://github.com/LegadoTeam/legado/tree/master/app/src/main/java/io/legado/app/web */

const { hostname, port } = new URL(WEB.getLegadoWebServeUrl());

const APIExceptionHandler = (error) => {
  throw error;
};
ajax.interceptors.response.use((response) => response, APIExceptionHandler);

// Http
const getReadConfig = () => ajax.get("/getReadConfig");
const saveReadConfig = (config) => ajax.post("/saveReadConfig", config);

const saveBookProgress = (bookProgress) => ajax.post("/saveBookProgress", bookProgress);

const saveBookProgressWithBeacon = (bookProgress) => {
  if (!bookProgress) return;
  // 常规请求可能会被取消 使用Fetch keep-alive 或者 navigator.sendBeacon
  navigator.sendBeacon(
    `${WEB.getLegadoWebServeUrl()}/saveBookProgress`,
    JSON.stringify(bookProgress)
  );
};

const getBookShelf = () => ajax.get("/getBookshelf");

const getChapterList = (/** @type {string} */ bookUrl) =>
  ajax.get("/getChapterList?url=" + encodeURIComponent(bookUrl));

const getBookContent = (/** @type {string} */ bookUrl, /** @type {number} */ chapterIndex) =>
  ajax.get("/getBookContent?url=" + encodeURIComponent(bookUrl) + "&index=" + chapterIndex);

const search = (
  /** @type {string} */ searchKey,
  /** @type {(data: string) => void} */ onReceive,
  /** @type {() => void} */ onFinish
) => {
  // webSocket
  const url = `ws://${hostname}:${Number(port) + 1}/searchBook`;
  const socket = new WebSocket(url);

  socket.onopen = () => {
    socket.send(`{"key":"${searchKey}"}`);
  };
  socket.onmessage = ({ data }) => onReceive(data);

  socket.onclose = () => {
    onFinish();
  };
};

const saveBook = (book) => ajax.post("/saveBook", book);
const deleteBook = (book) => ajax.post("/deleteBook", book);

export default {
  getReadConfig,
  saveReadConfig,
  saveBookProgress,
  saveBookProgressWithBeacon,
  getBookShelf,
  getChapterList,
  getBookContent,
  search,
  saveBook,
  deleteBook
};
