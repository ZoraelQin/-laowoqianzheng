# 老挝签证申请表（中英双语）

网页链接：https://a7e64b7a337f34f1e.app.workbuddy.host/?sharecode=RX2NCFUPUY
基于 Vite + React 的单页申请表单。字段依据老挝使领馆纸质申请表与老挝官方 eVisa 申请表整理，分为个人信息、护照信息、旅行信息、声明与签名四部分。支持中英切换、必填校验、打印/保存 PDF、提交发送到邮箱。

## 一、本地运行

```bash
npm install
npm run dev
```

浏览器打开终端提示的地址（默认 http://localhost:5173）。

构建生产版本：

```bash
npm run build
```

产物在 `dist/` 目录，可直接部署到任意静态托管平台。

## 二、邮箱发送配置（EmailJS）

表单提交后想把内容发到指定邮箱，需要借助 EmailJS（纯前端邮件服务，免费额度足够个人使用）。配置只需一次：

1. 注册并登录 <https://dashboard.emailjs.com/>。
2. 在 **Email Services** 添加一个服务（如 Gmail / Outlook），按提示授权，记下 **Service ID**。
3. 在 **Email Templates** 新建模板，记下 **Template ID**。模板内容可参考：

   ```
   Subject: 老挝签证申请 / {{from_name}}

   收件人：{{to_email}}
   申请人：{{from_name}}
   回复邮箱：{{reply_to}}

   {{form_data}}
   ```

   > 模板中必须包含 `{{to_email}}`、`{{from_name}}`、`{{reply_to}}`、`{{form_data}}` 这几个变量，代码会按这些名字传值。同时所有表单字段（如 `surname`、`passportNo`）也会作为变量传入，可在模板中按需引用。

4. 在 **Account → General** 找到 **Public Key**。
5. 回到页面右上角点击 **邮箱配置 / Email setup**，填入 Service ID、Template ID、Public Key 和接收邮箱，保存。

配置保存在当前浏览器的 `localStorage`，不会上传到服务器。换浏览器或清理缓存后需要重新填写。

> **收不到邮件？** EmailJS 免费版需要完成邮箱验证（Email Service 页面中的 "Verify" 按钮），并确认模板中的接收邮箱与验证过的邮箱一致。请同时检查垃圾邮件箱。

未配置邮箱时，提交后仍会弹出填写摘要，支持复制内容、打开邮件客户端手动发送，以及打印/保存 PDF。

## 三、部署上线

本项目是纯静态站点，构建后把 `dist/` 目录部署即可。推荐部署到专业托管平台（稳定、独立、免费）：

1. **推送代码到 GitHub**（仓库已初始化，分支 `main`）：

   ```bash
   git remote add origin https://github.com/<你的用户名>/laos-visa-form.git
   git push -u origin main
   ```

2. **选择任一平台导入**（均为自动识别，无需手写配置）：

   | 平台 | 操作 |
   | --- | --- |
   | Cloudflare Pages | Workers & Pages → Create → 连接仓库 → 构建命令 `npm run build`、输出目录 `dist` |
   | Netlify | Add new site → Import from Git → 已内置 `netlify.toml`，直接部署 |
   | Vercel | Add New Project → 导入仓库 → 自动识别 Vite，直接部署 |

3. 部署完成获得独立域名（如 `xxx.pages.dev`），打开后右上角完成一次邮箱配置即可长期使用。

也可将 `dist/` 内文件直接上传到任意静态服务器 / 对象存储。

## 四、后续维护

| 需求 | 做法 |
| --- | --- |
| 修改字段 | 编辑 `src/config.js` 中的 `sections` 和 `ui`，字段会自动渲染 |
| 修改下拉选项 | 编辑 `src/config.js` 中的 `options` |
| 修改邮件模板变量 | 编辑 `src/App.jsx` 中 `emailjs.send` 的参数对象，同时同步 EmailJS 后台模板 |
| 查看提交记录 | 邮件会发到配置时填写的邮箱；如需后台管理，需要另接数据库（如 Supabase） |
| 换接收邮箱 | 打开页面右上角"邮箱配置"修改 `toEmail` 后保存 |

## 五、文件结构

```
src/
  config.js               字段定义、中英文字典、下拉选项
  utils.js                校验、摘要生成、配置读写
  App.jsx                 页面主逻辑与状态管理
  styles.css              样式（含响应式与打印样式）
  components/
    FormField.jsx         通用字段渲染
    ConfigModal.jsx       邮箱配置弹窗
    ResultModal.jsx       提交结果弹窗
```
