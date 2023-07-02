# 阅读VS Code插件

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/sunrishe.legado-vscode?label=version)](https://marketplace.visualstudio.com/items?itemName=sunrishe.legado-vscode)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/sunrishe.legado-vscode?label=downloads)](https://marketplace.visualstudio.com/items?itemName=sunrishe.legado-vscode)
[![stars](https://img.shields.io/github/stars/sunrishe/legado-vscode)](https://github.com/sunrishe/legado-vscode.git)
[![issues](https://img.shields.io/github/issues/sunrishe/legado-vscode)](https://github.com/sunrishe/legado-vscode.git)
[![GitHub License](https://img.shields.io/github/license/sunrishe/legado-vscode)](https://github.com/sunrishe/legado-vscode.git)

📕 [GitHub仓库](https://github.com/sunrishe/legado-vscode.git)
📗 [VS Code插件市场](https://marketplace.visualstudio.com/items?itemName=sunrishe.legado-vscode)
📘 [更新日志](https://github.com/sunrishe/legado-vscode/blob/master/CHANGELOG.md)

📙 插件不断完善，欢迎提交 [Issues](https://github.com/sunrishe/legado-vscode/issues)、[Pull requests](https://github.com/sunrishe/legado-vscode/pulls)

---

## 功能

> 配合[阅读APP](https://github.com/gedoor/legado.git)用来学习的阅读插件，并在阅读APP的WEB服务基础上，书架页面增加了暗黑模式，章节阅读页面增加 <kbd>W</kbd> <kbd>S</kbd> <kbd>A</kbd> <kbd>D</kbd> 进行翻页控制。
>
> 😎悄悄地告诉你，阅读界面打开`无限加载`食用更佳哦~

### 书架页面

点击基本设定下的状态栏，可以设置阅读APP的WEB服务访问地址。

### 阅读界面

<kbd>Q</kbd> 返回书架

<kbd>E</kbd> 打开/关闭章节列表

<kbd>R</kbd> 重新获取当前章节内容，适用于章节下载失败或乱码

<kbd>W</kbd>或<kbd>↑</kbd> 向上翻页

<kbd>S</kbd>或<kbd>↓</kbd> 向下翻页

<kbd>A</kbd>或<kbd>←</kbd> 上一章

<kbd>D</kbd>或<kbd>→</kbd> 下一章

## 使用帮助

1. 在阅读APP中打开`我的 > Web服务`启用Web服务
2. 电脑和手机处于同一局域网内
3. 在VS Code中搜索插件并安装
4. VS Code搜索命令`阅读APP Legado: 打开阅读APP书架`并执行
5. 点击`基本设定下的状态栏`，在弹框中输入阅读APP的WEB服务访问地址
6. 测试成功后自动配置，同步修改VS Code设置`legado-vscode.webServeUrl`阅读APP的WEB服务访问地址的配置信息
7. 页面自动刷新，配置生效

### 启用暗黑模式

1. 打开阅读书架
2. 选择一本书籍进入阅读
3. 阅读页面单击，选择顶部的`设置`
4. 在`阅读主题`中选择暗黑主题
5. 书架和阅读页面同步切换至暗黑主题

### 快速关闭窗口

使用VS Code的`关闭编辑器`命令即可，对应的快捷键一般为<kbd>Ctrl</kbd> + <kbd>W</kbd>。

### 快速打开阅读书架

喜欢使用快捷键高效学习的童鞋，可以自行配置快捷键，一键直达，纵享丝滑。

## 鸣谢

首次接触VS Code插件开发，非常感谢他们对我的帮助。

[gedoor/legado](https://github.com/gedoor/legado.git)
[微软官方](https://github.com/microsoft/vscode-webview-ui-toolkit-samples.git)
[CODE Magazine](https://www.codemag.com/article/2107071)
[Mhdi-kr/vscode-webvue](https://github.com/Mhdi-kr/vscode-webvue.git)
[jeege/vscode-reader](https://github.com/jeege/vscode-reader.git)
[aooiuu/z-reader](https://github.com/aooiuu/z-reader.git)
