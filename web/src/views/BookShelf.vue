<template>
  <div :class="{ 'index-wrapper': true, night: isNight, day: !isNight }">
    <div class="navigation-wrapper">
      <div class="navigation-title-wrapper">
        <div class="navigation-title-row">
          <div class="navigation-title">阅读</div>
          <button
            class="theme-toggle"
            type="button"
            :title="isNight ? '切换浅色主题' : '切换深色主题'"
            @click.stop="toggleColorMode"
          >
            {{ isNight ? "" : "" }}
          </button>
        </div>
        <div class="navigation-sub-title">清风不识字，何故乱翻书</div>
      </div>
      <div class="search-wrapper">
        <el-input
          placeholder="搜索书籍，在线书籍自动加入书架"
          v-model="search"
          class="search-input"
          :prefix-icon="Search"
        >
        </el-input>
      </div>
      <div class="bottom-wrapper">
        <div class="recent-wrapper">
          <div class="recent-title">最近阅读</div>
          <div class="reading-recent">
            <el-tag
              :type="readingRecent.name == '尚无阅读记录' ? 'warning' : ''"
              class="recent-book"
              size="large"
              @click="
                toDetail(
                  readingRecent.url,
                  readingRecent.name,
                  readingRecent.author,
                  readingRecent.chapterIndex,
                  readingRecent.chapterPos
                )
              "
              :class="{ 'no-point': readingRecent.url == '' }"
            >
              {{ readingRecent.name }}
            </el-tag>
          </div>
        </div>
        <div class="setting-wrapper">
          <div class="setting-title">基本设定</div>
          <div class="setting-item">
            <el-tag
              :type="connectType"
              size="large"
              class="setting-connect"
              :class="{ 'no-point': newConnect }"
              @click="setIP"
            >
              {{ connectStatus }}
            </el-tag>
            <el-tag
              size="large"
              class="setting-connect setting-refresh"
              @click="reloadPage"
            >
              刷新页面
            </el-tag>
            <el-tag
              size="large"
              class="setting-connect setting-shortcuts"
              @click="showShortcuts"
            >
              快捷键
            </el-tag>
          </div>
        </div>
      </div>
      <div class="bottom-icons">
        <a
          href="https://github.com/sunrishe/legado-vscode"
          target="_blank"
        >
          <div class="bottom-icon">
            <img
              :src="githubUrl"
              alt=""
            />
          </div>
        </a>
      </div>
    </div>
    <div
      class="shelf-wrapper"
      ref="shelfWrapper"
    >
      <book-items
        :books="books"
        @bookClick="handleBookClick"
      ></book-items>
    </div>
  </div>
</template>

<script setup>
import "@/assets/fonts/shelffont.css";
import "@/assets/fonts/iconfont.css";
import { useBookStore } from "@/store";
import githubUrl from "@/assets/imgs/github.png";
import { useLoading } from "@/hooks/loading";
import { showMessage } from "@/hooks/message";
import { toggleColorMode } from "@/hooks/theme";
import { isDarkTheme } from "@/config/themeConfig";
import { defineComponent, h, reactive } from "vue";
import { ElInput } from "element-plus";
import { Search } from "@element-plus/icons-vue";
import API from "@api";
import WEB from "@/api/web";

const store = useBookStore();
const { connectStatus, connectType, newConnect, shelf } = storeToRefs(store);

const theme = computed(() => {
  return store.config.theme;
});
const isNight = computed(() => isDarkTheme(theme.value));

const readingRecent = ref({
  name: "尚无阅读记录",
  author: "",
  url: "",
  chapterIndex: 0,
  chapterPos: 0
});
const pageTitle = ref(WEB.getPanelTitle());
const shelfWrapper = ref(null);
const { loadingWrapper } = useLoading(shelfWrapper, "正在获取书籍信息");

const books = ref([]);

const search = ref("");
watchEffect(() => {
  books.value = [];
  if (search.value == "") {
    books.value = shelf.value;
    return;
  }
  books.value = shelf.value.filter((book) => {
    return book.name.includes(search.value) || book.author.includes(search.value);
  });
});

const isValidWebServeUrl = (input) => {
  let url;
  try {
    url = new URL(input);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(url.protocol)) return false;
  if (!url.hostname) return false;
  if (url.pathname !== "/" || url.search || url.hash) return false;

  if (url.port) {
    let port = Number(url.port);
    if (!Number.isInteger(port) || port < 1 || port > 65535) return false;
  }

  if (/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) {
    let ips = url.hostname.split(".");
    for (let i = 0; i < ips.length; i++) {
      let ip = Number(ips[i]);
      if (!Number.isInteger(ip) || ip > 255) {
        return false;
      }
    }
  } else {
    let domainReg =
      /^(localhost|(?=.{1,253}$)([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63})$/;
    if (!domainReg.test(url.hostname)) {
      return false;
    }
  }

  return true;
};

const openSettings = () => {
  const oldWebServeUrl = WEB.getLegadoWebServeUrl();
  const form = reactive({
    panelTitle: WEB.getPanelTitle(),
    webServeUrl: oldWebServeUrl
  });
  const errors = reactive({
    panelTitle: "",
    webServeUrl: ""
  });
  const validatePanelTitle = () => {
    errors.panelTitle = form.panelTitle.trim() ? "" : "标题不能为空";
    return !errors.panelTitle;
  };
  const validateWebServeUrl = () => {
    errors.webServeUrl = isValidWebServeUrl(form.webServeUrl.trim()) ? "" : "无效的地址";
    return !errors.webServeUrl;
  };
  const errorStyle = {
    color: "var(--el-color-danger)",
    fontSize: "12px",
    lineHeight: "16px",
    marginTop: "6px"
  };
  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "var(--el-text-color-regular)",
    fontSize: "14px"
  };
  const inputStyle = {
    width: "100%"
  };
  const SettingsForm = defineComponent({
    setup() {
      return () =>
        h(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              width: "100%"
            }
          },
          [
            h("div", null, [
              h("label", { style: labelStyle }, "页面标题"),
              h(ElInput, {
                modelValue: form.panelTitle,
                "onUpdate:modelValue": (value) => {
                  form.panelTitle = value;
                  validatePanelTitle();
                },
                clearable: true,
                validateEvent: false,
                placeholder: "请输入页面标题",
                style: inputStyle
              }),
              errors.panelTitle ? h("div", { style: errorStyle }, errors.panelTitle) : null
            ]),
            h("div", null, [
              h("label", { style: labelStyle }, "阅读WEB服务地址"),
              h(ElInput, {
                modelValue: form.webServeUrl,
                "onUpdate:modelValue": (value) => {
                  form.webServeUrl = value;
                  validateWebServeUrl();
                },
                clearable: true,
                validateEvent: false,
                placeholder: "请输入阅读WEB服务地址",
                style: inputStyle
              }),
              errors.webServeUrl ? h("div", { style: errorStyle }, errors.webServeUrl) : null
            ])
          ]
        );
    }
  });

  return ElMessageBox({
    title: "设置",
    message: h(SettingsForm),
    customClass: "settings-message-box",
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    showCancelButton: true,
    closeOnClickModal: false,
    beforeClose: (action, instance, done) => {
      if (action !== "confirm") {
        done();
        return;
      }

      const url = form.webServeUrl.trim();
      const isTitleValid = validatePanelTitle();
      const isUrlValid = validateWebServeUrl();
      if (!isTitleValid) {
        showMessage.error("标题不能为空");
        return;
      }
      if (!isUrlValid) {
        showMessage.error("无效的地址");
        return;
      }
      if (url === oldWebServeUrl) {
        done();
        return;
      }

      instance.confirmButtonLoading = true;
      instance.confirmButtonText = "正在连接";
      WEB.checkLegadoWebServeUrl(url)
        .then(() => {
          done();
        })
        .catch(() => {
          instance.confirmButtonLoading = false;
          instance.confirmButtonText = "确定";
          showMessage.error(`${url} 连接失败`);
        });
    }
  }).then(() => ({
    title: form.panelTitle.trim(),
    webServeUrl: form.webServeUrl.trim()
  }));
};

const setIP = () => {
  openSettings()
    .then(({ title, webServeUrl }) => {
      const oldWebServeUrl = WEB.getLegadoWebServeUrl();
      const shouldReload = webServeUrl !== oldWebServeUrl;
      pageTitle.value = title;
      WEB.setPanelTitle(title);
      WEB.setLegadoWebServeUrl(webServeUrl);
      if (!shouldReload) {
        showMessage.success("设置已保存");
        return;
      }
      showMessage.success({
        message: `${webServeUrl} 连接成功，即将重新加载`,
        duration: 1000,
        onClose: () => {
          WEB.reload();
        }
      });
    })
    .catch(() => {});
};

const router = useRouter();
const handleBookClick = async (book) => {
  const { bookUrl, name, author, durChapterIndex = 0, durChapterPos = 0 } = book;
  await API.saveBook(book);
  toDetail(bookUrl, name, author, durChapterIndex, durChapterPos);
};
const toDetail = (bookUrl, bookName, bookAuthor, chapterIndex, chapterPos) => {
  if (bookName === "尚无阅读记录") return;
  sessionStorage.setItem("bookUrl", bookUrl);
  sessionStorage.setItem("bookName", bookName);
  sessionStorage.setItem("bookAuthor", bookAuthor);
  sessionStorage.setItem("chapterIndex", chapterIndex);
  sessionStorage.setItem("chapterPos", chapterPos);
  readingRecent.value = {
    name: bookName,
    author: bookAuthor,
    url: bookUrl,
    chapterIndex: chapterIndex,
    chapterPos: chapterPos
  };
  localStorage.setItem("readingRecent", JSON.stringify(readingRecent.value));
  router.push({
    path: "/chapter"
  });
};

const reloadPage = () => {
  WEB.reload();
};

const closePage = () => {
  WEB.closePanel();
};

const isEditableElement = (target) => {
  const tagName = target?.tagName?.toLowerCase();
  return tagName === "input" || tagName === "textarea" || target?.isContentEditable;
};

const handleKeyPress = (event) => {
  if (isEditableElement(event.target)) return;

  switch (event.key) {
    case "R":
    case "r":
      event.stopPropagation();
      event.preventDefault();
      reloadPage();
      break;
    case "X":
    case "x":
      event.stopPropagation();
      event.preventDefault();
      closePage();
      break;
  }
};

const showShortcuts = () => {
  const shortcutGroups = [
    {
      title: "书架页面",
      items: [
        { keys: ["R"], action: "刷新页面" },
        { keys: ["X"], action: "关闭页面" }
      ]
    },
    {
      title: "阅读页面",
      items: [
        { keys: ["Q"], action: "返回书架" },
        { keys: ["E"], action: "打开或关闭目录" },
        { keys: ["R"], action: "刷新页面" },
        { keys: ["X"], action: "关闭页面" },
        { keys: ["A", "←"], action: "上一章" },
        { keys: ["D", "→"], action: "下一章" },
        { keys: ["W", "↑", "PgUp"], action: "向上翻页" },
        { keys: ["S", "↓", "PgDn", "空格"], action: "向下翻页" }
      ]
    }
  ];

  ElMessageBox({
    title: "快捷键",
    message: h(
      "div",
      { class: "shortcut-help" },
      shortcutGroups.map((group) =>
        h("section", { class: "shortcut-section" }, [
          h("div", { class: "shortcut-title" }, group.title),
          h(
            "div",
            { class: "shortcut-list" },
            group.items.map((item) =>
              h("div", { class: "shortcut-row" }, [
                h(
                  "div",
                  { class: "shortcut-keys" },
                  item.keys.map((key) => h("kbd", key))
                ),
                h("div", { class: "shortcut-action" }, item.action)
              ])
            )
          )
        ])
      )
    ),
    customClass: "shortcuts-message-box",
    confirmButtonText: "知道了"
  }).catch(() => {});
};

onMounted(() => {
  window.addEventListener("keyup", handleKeyPress);
  //获取最近阅读书籍
  let readingRecentStr = localStorage.getItem("readingRecent");
  if (readingRecentStr != null) {
    readingRecent.value = JSON.parse(readingRecentStr);
    if (typeof readingRecent.value.chapterIndex == "undefined") {
      readingRecent.value.chapterIndex = 0;
    }
  }
  loadingWrapper(
    store
      .saveBookProgress()
      //确保各种网络情况下同步请求先完成
      .finally(fetchBookShelfData)
  );
});

onUnmounted(() => {
  window.removeEventListener("keyup", handleKeyPress);
});
const fetchBookShelfData = () => {
  return API.getBookShelf()
    .then((response) => {
      store.setConnectType("success");
      if (response.data.isSuccess) {
        //store.increaseBookNum(response.data.data.length);
        const sortedBooks = response.data.data.sort(function (a, b) {
          var x = a["durChapterTime"] || 0;
          var y = b["durChapterTime"] || 0;
          return y - x;
        });
        store.addBooks(sortedBooks);

        // 更新最近阅读 - 从服务器数据中获取最新的阅读记录
        if (sortedBooks.length > 0) {
          // 找到最近阅读的书（按阅读时间排序）
          const latestBook = sortedBooks.find((book) => book.durChapterTime) || sortedBooks[0];

          // 如果有正在阅读的记录或者最近阅读的书存在，则更新
          if (latestBook && (latestBook.durChapterTime || readingRecent.value.url)) {
            // 检查是否是同一本书，如果是则更新进度；如果不是则以服务器数据为准
            const isSameBook = latestBook.bookUrl === readingRecent.value.url;

            readingRecent.value = {
              name: latestBook.name || "尚无阅读记录",
              author: latestBook.author || "",
              url: latestBook.bookUrl || "",
              chapterIndex: latestBook.durChapterIndex || 0,
              chapterPos: latestBook.durChapterPos || 0
            };

            // 如果是同一本书且服务器进度更新，则使用服务器数据
            // 如果不是同一本书，则直接使用服务器数据（最近阅读的书）
            if (isSameBook) {
              // 保持服务器的最新进度
              console.log(`同步阅读进度：${latestBook.name} - 第${latestBook.durChapterIndex}章`);
            } else if (latestBook.bookUrl) {
              console.log(`切换最近阅读：${latestBook.name} - 第${latestBook.durChapterIndex}章`);
            }

            // 更新 localStorage 以保持一致性
            localStorage.setItem("readingRecent", JSON.stringify(readingRecent.value));
          }
        }
      } else {
        showMessage.error(response.data.errorMsg);
      }
      store.setConnectStatus("已连接 ");
      store.setNewConnect(false);
    })
    .catch(function (error) {
      store.setConnectType("danger");
      store.setConnectStatus("连接失败");
      showMessage.error("后端连接失败");
      store.setNewConnect(false);
      throw error;
    });
};
</script>

<style lang="scss" scoped>
.index-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  --app-scrollbar-thumb: #b8a88f;
  --app-scrollbar-thumb-hover: #9f8b6f;

  .navigation-wrapper {
    width: 260px;
    min-width: 260px;
    padding: 48px 36px;
    background-color: #f7f7f7;

    .navigation-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .navigation-title {
      font-size: 24px;
      font-weight: 500;
      font-family: FZZCYSK;
    }

    .theme-toggle {
      width: 28px;
      height: 28px;
      padding: 0;
      border: 1px solid transparent;
      border-radius: 50%;
      background: transparent;
      color: #b8a88f;
      cursor: pointer;
      font-family: iconfont;
      font-size: 18px;
      line-height: 26px;
    }

    .theme-toggle:hover {
      border-color: #ed4259;
      color: #ed4259;
    }

    .navigation-sub-title {
      font-size: 16px;
      font-weight: 300;
      font-family: FZZCYSK;
      margin-top: 16px;
      color: #b1b1b1;
    }

    .search-wrapper {
      .search-input {
        border-radius: 50%;
        margin-top: 24px;

        :deep(.el-input__wrapper) {
          border-radius: 50px;
          border-color: #e3e3e3;
        }
      }
    }

    .bottom-wrapper {
      display: flex;
      flex-direction: column;
    }

    .recent-wrapper {
      margin-top: 36px;

      .recent-title {
        font-size: 14px;
        color: #b1b1b1;
        font-family: FZZCYSK;
      }

      .reading-recent {
        margin: 18px 0;

        .recent-book {
          font-size: 10px;
          // font-weight: 400;
          // margin: 12px 0;
          // font-weight: 500;
          // color: #6B7C87;
          cursor: pointer;
          // padding: 6px 18px;
        }
      }
    }

    .setting-wrapper {
      margin-top: 36px;

      .setting-title {
        font-size: 14px;
        color: #b1b1b1;
        font-family: FZZCYSK;
      }

      .setting-connect {
        font-size: 8px;
        margin-top: 16px;
        // color: #6B7C87;
        cursor: pointer;
      }

      .setting-refresh,
      .setting-shortcuts {
        margin-left: 8px;
      }

      .setting-shortcuts {
        border-color: #fdf6ec;
        background-color: #fdf6ec;
        color: #e6a23c;
      }

      .setting-shortcuts:hover {
        border-color: #faecd8;
        background-color: #faecd8;
        color: #b88230;
      }
    }

    .bottom-icons {
      position: fixed;
      bottom: 0;
      height: 120px;
      width: 260px;
      align-items: center;
      display: flex;
      flex-direction: row;
    }
  }

  .shelf-wrapper {
    padding: 48px 48px;
    width: 100%;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    scrollbar-color: var(--app-scrollbar-thumb) transparent;
    scrollbar-width: auto;

    &::-webkit-scrollbar {
      width: 14px;
      height: 14px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--app-scrollbar-thumb);
      border: 3px solid transparent;
      border-radius: 999px;
      background-clip: content-box;
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: var(--app-scrollbar-thumb-hover);
    }
  }
}

:global(.settings-message-box .el-message-box__message),
:global(.settings-message-box .el-message-box__message > div),
:global(.settings-message-box .el-message-box__message .el-input) {
  width: 100%;
}

:global(.settings-message-box .el-message-box__container) {
  display: block;
}

:global(.shortcuts-message-box .el-message-box__message),
:global(.shortcuts-message-box .el-message-box__message > div) {
  width: 100%;
}

:global(.shortcuts-message-box) {
  width: auto;
  min-width: 340px;
  max-width: calc(100vw - 32px);
}

:global(.shortcuts-message-box .el-message-box__container) {
  display: block;
}

:global(.shortcut-help) {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: max-content;
  max-width: 100%;
}

:global(.shortcut-title) {
  margin-bottom: 8px;
  color: var(--el-text-color-primary);
  font-size: 14px;
  font-weight: 600;
}

:global(.shortcut-list) {
  display: grid;
  gap: 8px;
}

:global(.shortcut-row) {
  display: grid;
  grid-template-columns: max-content max-content;
  align-items: center;
  gap: 12px;
  color: var(--el-text-color-regular);
  font-size: 13px;
}

:global(.shortcut-keys) {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  min-width: 0;
}

:global(.shortcut-keys kbd) {
  flex: 0 0 auto;
  min-width: 24px;
  padding: 2px 6px;
  border: 1px solid var(--el-border-color);
  border-bottom-color: var(--el-border-color-darker);
  border-radius: 4px;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-family: Consolas, "Courier New", monospace;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
}

:global(.shortcut-action) {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media screen and (max-width: 750px) {
  :global(.shortcut-row) {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  :global(.shortcut-action) {
    white-space: normal;
  }

  .index-wrapper {
    overflow-x: hidden;
    flex-direction: column;
    .navigation-wrapper {
      padding: 20px 24px;
      box-sizing: border-box;
      width: 100%;
      .navigation-title-wrapper {
        white-space: nowrap;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }
      .bottom-wrapper {
        flex-direction: row;
        > * {
          flex-grow: 1;
          margin-top: 18px;
          .reading-recent,
          .setting-item {
            margin-bottom: 0px;
          }
        }
      }
      .bottom-icons {
        display: none;
      }
    }
    .shelf-wrapper {
      padding: 0;
      flex-grow: 1;
      :deep(.el-loading-spinner) {
        display: none;
      }
    }
  }
}

.night {
  --app-scrollbar-thumb: #555b61;
  --app-scrollbar-thumb-hover: #6f767d;

  :deep(.navigation-wrapper) {
    background-color: #454545;
    .navigation-title {
      color: #aeaeae;
    }

    .theme-toggle {
      color: #b5b5b5;
    }
    .search-wrapper {
      .search-input {
        .el-input__wrapper {
          background-color: #454545;
        }
        .el-input__inner {
          color: #b1b1b1;
        }
      }
    }

    .setting-wrapper {
      .setting-shortcuts {
        border-color: rgba(230, 162, 60, 0.16);
        background-color: rgba(230, 162, 60, 0.16);
        color: #d9a14f;
      }

      .setting-shortcuts:hover {
        border-color: rgba(230, 162, 60, 0.24);
        background-color: rgba(230, 162, 60, 0.24);
        color: #e7b76b;
      }
    }
  }
  .shelf-wrapper {
    background-color: #161819;
  }

  :deep(.shelf-wrapper .books-wrapper .wrapper .book .info .name) {
    color: #b5b5b5;
  }
}
</style>
