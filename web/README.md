# 阅读web端
使用 vue3 web 书架和阅读页
## 路由
* http://localhost:8080/ 书架
* http://localhost:8080/#/chapter 阅读页

## 兼容性

| ![IE](https://cdn.jsdelivr.net/npm/@browser-logos/edge/edge_32x32.png) | ![Firefox](https://cdn.jsdelivr.net/npm/@browser-logos/firefox/firefox_32x32.png) | ![Chrome](https://cdn.jsdelivr.net/npm/@browser-logos/chrome/chrome_32x32.png) | ![Safari](https://cdn.jsdelivr.net/npm/@browser-logos/safari/safari_32x32.png) |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| Edge ≥ 79                                                              | Firefox ≥ 78                                                                      | Chrome ≥ 64                                                                    | Safari ≥ 12                                                                    |

## 开发
> 需要阅读app提供后端服务，开发前修改环境变量`VITE_API`为阅读web服务地址

```bash
echo "VITE_API=http://<ip>:<port>" > .env.development
pnpm dev
```
