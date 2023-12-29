# KeyManager

## 项目描述

基于 React 打造的vps密钥管理系统模版

基于 React hooks、antd、 redux、 React router 等技术

css 样式基于 styled components 组件实现



### 项目目录

```
├── config-overrides.js         # 打包配置
├── public                      # 公共目录（不参与编译）
├── src                         # 项目主目录
│   ├── App.jsx
│   ├── api
│   ├── assets                  # 静态资源
│   ├── components              # 公共组件
│   │   ├── Icon
│   │   └── page-info
│   ├── index.js                # 项目入口
│   ├── routers                 # 路由配置
│   ├── setupProxy.js           # 代理设置
│   ├── store                   # 状态管理
│   │   ├── base
│   │   ├── index.js
│   │   └── reducer.js
│   ├── utils                   # 工具方法
│   └── views                   # 页面目录

```

### 使用说明

```shell
git clone https://github.com/ifoxhz/KeyManagerReact.git



// 安装依赖
npm install // yarn

// 运行
npm start // yarn start

// 打包
npm run build // yarn build

// 打包测试服

npm run build:test // yarn build:test

```

