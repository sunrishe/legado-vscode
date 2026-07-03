<template>
  <div
    :class="{ 'cata-wrapper': true, visible: popCataVisible }"
    :style="popupTheme"
  >
    <div class="title-row">
      <div class="title">目录</div>
      <button
        class="theme-toggle"
        type="button"
        :title="isNight ? '切换浅色主题' : '切换深色主题'"
        @click.stop="toggleColorMode"
      >
        {{ isNight ? "" : "" }}
      </button>
    </div>
    <virtual-list
      :class="{ 'catalog-list': true, night: isNight, day: !isNight }"
      ref="virtualListRef"
      data-key="index"
      wrap-class="data-wrapper"
      item-class="cata"
      :data-sources="virtualListdata"
      :data-component="CatalogItem"
      :estimate-size="40"
      :extra-props="{ gotoChapter, currentChapterIndex }"
    />
  </div>
</template>

<script setup>
import VirtualList from "vue3-virtual-scroll-list";
import settings, {
  DARK_THEME_INDEX,
  DEFAULT_LIGHT_THEME_INDEX,
  getScrollbarTheme,
  isDarkTheme
} from "../config/themeConfig";
import { toggleColorMode } from "@/hooks/theme";
import "../assets/fonts/popfont.css";
import "../assets/fonts/iconfont.css";
import CatalogItem from "./CatalogItem.vue";

const store = useBookStore();

const isNight = computed(() => isDarkTheme(theme.value));
const { catalog, popCataVisible, miniInterface } = storeToRefs(store);

const theme = computed(() => {
  return store.config.theme;
});
const scrollbarTheme = computed(() => {
  return getScrollbarTheme(theme.value);
});
const popupTheme = computed(() => {
  const popupThemeIndex = isNight.value ? DARK_THEME_INDEX : DEFAULT_LIGHT_THEME_INDEX;
  return {
    background: settings.themes[popupThemeIndex].popup,
    "--app-scrollbar-thumb": scrollbarTheme.value.thumb,
    "--app-scrollbar-thumb-hover": scrollbarTheme.value.hover
  };
});

const currentChapterIndex = computed({
  get: () => store.readingBook.index,
  set: (value) => (store.readingBook.index = value)
});

const virtualListdata = computed(() => {
  let catalogValue = catalog.value;
  if (miniInterface.value) return catalogValue;

  // pc端 virtualListIitem有2个章节
  let length = Math.ceil(catalogValue.length / 2);
  let virtualListDataSource = new Array(length);

  let i = 0;
  while (i < length) {
    virtualListDataSource[i] = {
      index: i,
      catas: catalogValue.slice(2 * i, 2 * i + 2)
    };
    i++;
  }
  return virtualListDataSource;
});

const emit = defineEmits(["getContent"]);
const gotoChapter = (note) => {
  const chapterIndex = catalog.value.indexOf(note);
  currentChapterIndex.value = chapterIndex;
  store.setPopCataVisible(false);
  store.setContentLoading(true);
  emit("getContent", chapterIndex);
};

const virtualListRef = ref();
const virtualListIndex = computed(() => {
  let index = currentChapterIndex.value;
  if (miniInterface.value) return index;
  return Math.floor(index / 2);
});

watch(popCataVisible, (visible) => {
  if (!visible) return;

  nextTick(() => {
    // 只在打开目录时定位当前章节，避免拖动滚动条时反复抢占滚动位置
    virtualListRef.value?.scrollToIndex(virtualListIndex.value);
  });
});
</script>

<style lang="scss" scoped>
.cata-wrapper {
  margin: -16px;
  padding: 18px 0 24px 25px;

  // background: #ede7da url('../assets/imgs/themes/popup_1.png') repeat;
  .title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 20px 0;
  }

  .title {
    font-size: 18px;
    font-weight: 400;
    font-family: FZZCYSK;
    color: #ed4259;
    width: fit-content;
    border-bottom: 1px solid #ed4259;
  }

  .theme-toggle {
    width: 26px;
    height: 26px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 50%;
    background: transparent;
    color: #b8a88f;
    cursor: pointer;
    font-family: iconfont;
    font-size: 17px;
    line-height: 24px;
  }

  .theme-toggle:hover {
    border-color: #ed4259;
    color: #ed4259;
  }

  .catalog-list {
    height: 300px;
    overflow: auto;
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

  :deep(.data-wrapper) {
    .cata {
      //width: 50%;
      height: 40px;
      box-sizing: border-box;
      cursor: pointer;
      font: 16px / 40px PingFangSC-Regular, HelveticaNeue-Light, "Helvetica Neue Light",
        "Microsoft YaHei", sans-serif;
    }
  }

  .night {
    :deep(.cata) {
      border-bottom: 1px solid #666;
    }
  }

  .day {
    :deep(.cata) {
      border-bottom: 1px solid #f2f2f2;
    }
  }
}
</style>
