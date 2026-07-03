import { ElMessage } from "element-plus";
import "element-plus/theme-chalk/el-message.css";

const MAX_VISIBLE_MESSAGES = 3;
const visibleMessages = [];
let messageId = 0;

const normalizeOptions = (options) => {
  if (typeof options === "string") {
    return { message: options };
  }
  return options || {};
};

const showMessage = (options) => {
  if (visibleMessages.length >= MAX_VISIBLE_MESSAGES) {
    visibleMessages.shift()?.close();
  }

  const messageOptions = normalizeOptions(options);
  const onClose = messageOptions.onClose;
  const id = messageId++;

  const messageHandler = ElMessage({
    ...messageOptions,
    onClose: (...args) => {
      const index = visibleMessages.findIndex((item) => item.id === id);
      if (index >= 0) {
        visibleMessages.splice(index, 1);
      }
      onClose?.(...args);
    }
  });
  visibleMessages.push({ id, close: messageHandler.close });
  return messageHandler;
};

showMessage.success = (options) => showMessage({ ...normalizeOptions(options), type: "success" });
showMessage.warning = (options) => showMessage({ ...normalizeOptions(options), type: "warning" });
showMessage.info = (options) => showMessage({ ...normalizeOptions(options), type: "info" });
showMessage.error = (options) => showMessage({ ...normalizeOptions(options), type: "error" });

export { showMessage };
