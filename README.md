# 医药包装设备展示小程序

基于 uni-app（Vue 3）的微信小程序，用于展示多款医药包装设备图片、功能介绍及公司信息。首版使用静态 JSON 配置内容，无需后台。

## 技术栈

- Vue 3 + TypeScript
- uni-app（编译目标：微信小程序）
- 静态数据：`src/data/equipment.json`、`src/data/company.json`

## 目录说明

| 路径 | 说明 |
|------|------|
| `src/pages/index` | 首页（Banner、分类、推荐设备） |
| `src/pages/products` | 产品列表与设备详情 |
| `src/pages/about` | 关于我们 |
| `src/components` | 通用展示组件 |
| `src/data` | 设备与公司静态数据 |
| `src/utils/content.ts` | 数据读取封装 |

## 本地开发

```bash
cd mobile/pharmaPackaging
npm install
npm run dev:mp-weixin
```

使用微信开发者工具打开编译输出目录：`dist/dev/mp-weixin`（路径以实际编译结果为准）。

发布前在 `src/manifest.json` 的 `mp-weixin.appid` 中填写真实小程序 AppID。

## 构建

```bash
npm run build:mp-weixin
npm run check:package-size
```

产物目录：`dist/build/mp-weixin`，上传微信后台提交审核。

微信单分包上限约 2MB。产品图位于 `src/subpackage/products/static/products/`，更新或抓取后请执行：

```bash
npm run compress:products   # 压缩图片并修正 equipment.json 路径、同步首页推荐图
npm run build:mp-weixin
npm run check:package-size  # 任一分包超限则 exit 1
```

若 `subpackage/products` 仍超限，再执行 `npm run split:product-media` 将图片拆到 `products-media-*` 分包。

**注意**：`preloadRule` 中同一页面预加载的分包总体积不得超过 **2MB**。首页勿预加载 `products`/`about`/`news` 等大分包（首页 Banner、分类、推荐图已在主包 `static/`）。

## 内容维护

1. 编辑 `src/data/equipment.json` 增删设备、分类、Banner。
2. 编辑 `src/data/company.json` 更新公司介绍、资质、联系方式。
3. 将产品图、Banner、证书图放入 `src/static/`，并在 JSON 中引用路径（如 `/static/products/xxx.jpg`）。

替换图片后重新编译即可，一般无需改页面代码。

## H5 预览（可选）

```bash
npm run dev:h5
```
