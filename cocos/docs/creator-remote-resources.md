# Creator 3.8.8 正式微信远程资源

## 工程中的实际配置

`assets/resources.meta` 的 `userData.bundleConfigID` 指向 `canclub_resources`。对应配置位于 `settings/v2/packages/builder.json` 的 `bundleConfig.custom.canclub_resources.configs`。

| 平台 | 配置 | 资源位置 |
| --- | --- | --- |
| 编辑器与 Web | `web.preferredOptions.isRemote = false` | 本地 resources |
| 微信小游戏 | `miniGame.configMode = overwrite`，`overwriteSettings.wechatgame.isRemote = true` | 远程 resources |
| 微信合并模式 | `compressionType = merge_all_json` | 合并 JSON 元数据，PNG 保持原尺寸 |

该字段结构取自 Cocos 官方仓库 [v3.8.8 的 resources.meta](https://github.com/cocos/cocos-test-projects/blob/v3.8.8/assets/resources.meta) 与 [v3.8.8 的 builder.json](https://github.com/cocos/cocos-test-projects/blob/v3.8.8/settings/v2/packages/builder.json)。没有使用旧版仅在目录 meta 上写 `isRemoteBundle` 的结构。

`build-config/wechatgame.json` 的公共服务器字段 `server` 和微信包设置 `remoteServerAddress` 留空。运行 `npm run build:creator:wechat` 时，以 `WECHAT_CREATOR_SERVER` 注入同一个实际 HTTPS 地址；空地址不会生成可假装发布的正式包。编辑器 Web 配置不受该值影响。

## 读取与部署

业务仍向 `Assets.load` 提供 Preview11 路径。正式 Creator 路径先调用 `assetManager.loadBundle('resources')` 确保索引就绪，再调用 `resources.load` 获取所需纹理；已经加载的 Bundle 会复用。自定义姿态材质也等待同一个索引。这里没有 `loadDir` 或全资源预加载。官方 [Asset Bundle 文档](https://docs.cocos.com/creator/3.8/manual/en/asset/bundle.html) 说明 `loadBundle` 加载配置与脚本，实际资源按需要继续加载。

正式输出分成：

- `build/creator-wechatgame/`：微信开发者工具的导入/上传目录。
- `build/creator-remote-art/remote/`：完整资源部署目录，必须保留其所有配置、import/native 文件及版本名。
- `build/creator-remote-art/Creator-WeChat-BUILD-REPORT.json`：实际导出检查与主包预算报告。

Cocos 3.8.8 的微信适配器将远程 Bundle 地址组成 `server + 'remote/' + bundleName`；例如服务器为 `https://assets.example.test/can-club/`，则 resources 的配置地址为 `https://assets.example.test/can-club/remote/resources/config.<hash>.json`。Bundle 脚本留在主包的 `src/bundle-scripts`。构建脚本只移出 `remote/`，不搬走脚本。官方 [缓存管理文档](https://docs.cocos.com/creator/3.8/manual/en/asset/cache-manager.html) 同样要求部署远程目录并在小游戏上传前从包内移除它。

构建脚本会检查实际输出的 `assets.remoteBundles` 包含 `resources`，`assets.server` 与请求地址一致，远程配置存在，没有遗留本地 `assets/resources`。任何一项不符都会失败。然后递归核算主包和分包文件；显式文件/目录打包忽略项与 DevTools 配置一致。

## 命令行与验证边界

[Creator 命令行构建文档](https://docs.cocos.com/creator/3.8/manual/en/editor/publish/publish-in-command-line.html) 规定 `--project` 与 `--build configPath=...` 的用法，并将 `36` 定义为构建成功退出码，`32`/`34` 为失败。脚本接受 `36`，也接受外层启动器映射成的 `0`，两者都必须继续通过实际产物检查。

当前工作环境没有 Creator 编辑器。配置结构已对照官方 3.8.8 工程，脚本与失败门槛已通过文件夹 fixture；这不表示 Creator 编辑器导入/构建已运行，也没有已配置或已部署的业务 CDN。正式发布还需要安装编辑器完成导出、配置真实服务器的 HTTPS 下载域名、部署对应版本 Bundle，并用开发者工具与真机验收。

[Cocos 3.8 当前分包限制](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/subpackage.html) 为主包不超过 4 M、所有分包不超过 30 M、单个分包不另限大小。工程将主包和所有分包一并计入 30 MiB 作为保守预算；远程 Bundle 不属于本地上传主包或分包。原始文件字节检查不替代微信上传计量。
