# 黑马记账 App

> 一个简洁现代的 Windows 桌面记账应用，帮助你轻松管理日常收支。

## 项目概述

**黑马记账** 是一款面向个人和家庭的 Windows 桌面记账应用，采用 Electron + React + TypeScript 技术栈开发，具有简洁现代的苹果风格 UI 设计。

### 核心特性
- 📝 快速记账：支持收入和支出记录
- 📊 分类管理：必要支出 / 非必要支出两大分类
- 💰 预算管控：月度预算设置与超支提醒
- 📈 统计分析：日/周/月/年多维度收支统计
- 👥 多用户支持：家人共用，数据独立
- 💾 数据安全：本地 SQLite 数据库存储
- 📤 数据导出：CSV 格式导出

## 技术栈

| 层面 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 桌面框架 | Electron | latest | 跨平台桌面应用框架 |
| 前端框架 | React | 18+ | UI 组件化开发 |
| 编程语言 | TypeScript | 5+ | 类型安全 |
| 构建工具 | Vite | 5+ | 快速开发和构建 |
| UI 组件库 | Tailwind CSS | 3+ | 原子化 CSS |
| UI 组件 | shadcn/ui | latest | 高质量可定制组件 |
| 图标库 | Lucide React | latest | 简洁图标风格 |
| 状态管理 | Zustand | 4+ | 轻量级状态管理 |
| 路由 | React Router | 6+ | 页面路由 |
| 数据存储 | SQLite | 3+ | 本地数据库（better-sqlite3） |
| 图表库 | Recharts | 2+ | 数据可视化 |
| 密码加密 | bcrypt | 5+ | 密码安全存储 |

## 项目结构

```
黑马记账App/
├── src/                    # 源代码
│   ├── main/              # Electron 主进程
│   │   ├── index.ts       # 主进程入口
│   │   ├── database.ts    # 数据库操作
│   │   └── ipc.ts         # 进程间通信
│   ├── renderer/          # React 前端
│   │   ├── App.tsx        # 根组件
│   │   ├── main.tsx       # 入口文件
│   │   ├── components/    # 通用组件
│   │   │   ├── ui/        # 基础 UI 组件（shadcn/ui）
│   │   │   └── layout/    # 布局组件
│   │   ├── pages/         # 页面组件
│   │   ├── stores/        # Zustand 状态管理
│   │   ├── hooks/         # 自定义 Hook
│   │   ├── utils/         # 工具函数
│   │   └── styles/        # 全局样式
│   └── shared/            # 共享代码
│       └── types.ts       # 类型定义
├── resources/             # 静态资源
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 功能清单

### 1. 用户系统
- [ ] 用户注册（用户名 + 密码）
- [ ] 用户登录
- [ ] 密码加密存储（bcrypt）
- [ ] 多用户数据隔离
- [ ] 用户切换
- [ ] 昵称/头像设置

### 2. 记账功能
- [ ] 添加支出记录
- [ ] 添加收入记录
- [ ] 账单列表展示
- [ ] 编辑账单
- [ ] 删除账单
- [ ] 按日期筛选
- [ ] 按分类筛选
- [ ] 按备注搜索

### 3. 分类系统
- [ ] 支出分类（必要/非必要）
- [ ] 收入分类（工资/奖金/投资/兼职/其他）
- [ ] 分类图标展示

### 4. 预算功能
- [ ] 设置月度总预算
- [ ] 设置分类预算（必要/非必要）
- [ ] 预算进度展示
- [ ] 超支提醒（80% 警告，100% 警示）

### 5. 统计功能
- [ ] 日统计（今日收支）
- [ ] 周统计（本周趋势）
- [ ] 月统计（月度总结）
- [ ] 年统计（年度对比）
- [ ] 分类占比饼图
- [ ] 收支趋势折线图
- [ ] 结余计算

### 6. 数据管理
- [ ] 导出 CSV
- [ ] 数据备份
- [ ] 数据恢复

## 分类设计

### 支出分类

#### 必要支出（生存必需）
| 子分类 | 图标 | 说明 |
|--------|------|------|
| 餐饮 | 🍚 | 早/中/晚餐、零食、饮料 |
| 居住 | 🏠 | 房租、水电、物业、维修 |
| 交通 | 🚗 | 公交、地铁、打车、加油 |
| 医疗 | 💊 | 看病、药品、保健 |
| 日用 | 🛒 | 生活必需品、日用品 |

#### 非必要支出（提升品质）
| 子分类 | 图标 | 说明 |
|--------|------|------|
| 娱乐 | 🎮 | 电影、游戏、KTV、演出 |
| 购物 | 👗 | 衣服、电子产品、奢侈品 |
| 社交 | 🎁 | 聚餐、礼物、红包 |
| 学习 | 📚 | 书籍、课程、培训 |
| 旅游 | ✈️ | 门票、住宿、交通费 |

### 收入分类
| 分类 | 图标 | 说明 |
|------|------|------|
| 工资 | 💰 | 月薪、基本工资 |
| 奖金 | 🎉 | 年终奖、绩效奖金 |
| 投资 | 📈 | 理财收益、股票分红 |
| 兼职 | 💼 | 副业、自由职业收入 |
| 其他 | 🎁 | 红包、礼金、其他收入 |

## 数据模型

### users 表
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nickname TEXT,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### transactions 表
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  amount DECIMAL(10,2) NOT NULL,
  category_id INTEGER NOT NULL,
  is_necessary BOOLEAN DEFAULT 0,
  note TEXT,
  transaction_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### categories 表
```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  is_necessary BOOLEAN DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);
```

### budgets 表
```sql
CREATE TABLE budgets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  month TEXT NOT NULL,
  total_budget DECIMAL(10,2) DEFAULT 0,
  necessary_budget DECIMAL(10,2) DEFAULT 0,
  unnecessary_budget DECIMAL(10,2) DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## UI 设计规范

### 配色方案
```
主色：#007AFF（苹果蓝）
背景：#F5F5F7（浅灰）
卡片：#FFFFFF（纯白）
文字：#1D1D1F（深灰）
次要：#86868B（中灰）
成功：#34C759（绿色 - 收入）
警告：#FF9500（橙色 - 预算警告）
危险：#FF3B30（红色 - 超支/支出）
```

### 设计原则
- 大量留白，呼吸感强
- 圆角卡片，柔和阴影
- 简洁图标，避免复杂
- 字体清晰，层次分明
- 收入用绿色标识，支出用红色标识

### 页面布局
```
┌─────────────────────────────────────────┐
│  顶部栏：Logo + 用户头像 + 设置           │
├──────────┬──────────────────────────────┤
│  侧边栏   │        主内容区               │
│          │                              │
│ - 首页    │   （根据菜单显示不同内容）      │
│ - 记账    │                              │
│ - 账单    │                              │
│ - 统计    │                              │
│ - 预算    │                              │
│ - 设置    │                              │
└──────────┴──────────────────────────────┘
```

### 核心页面
1. **登录/注册页**：简洁居中表单
2. **首页**：今日收支 + 预算进度 + 快速记账
3. **记账页**：收入/支出切换 + 金额 + 分类
4. **账单列表页**：时间轴展示 + 筛选
5. **统计页**：图表 + 数据卡片
6. **预算页**：预算设置 + 进度展示
7. **设置页**：用户信息 + 数据管理

## 开发计划

### 阶段 1：项目初始化（第 1 天）
- [ ] 创建 Electron + React + TypeScript 项目
- [ ] 配置 Vite
- [ ] 配置 Tailwind CSS
- [ ] 安装 shadcn/ui
- [ ] 配置 SQLite
- [ ] 建立目录结构

### 阶段 2：用户系统（第 2 天）
- [ ] 数据库表创建
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 密码加密（bcrypt）
- [ ] 用户状态管理

### 阶段 3：核心记账（第 3-4 天）
- [ ] 分类数据初始化
- [ ] 添加账单 API
- [ ] 账单列表 API
- [ ] 编辑/删除 API
- [ ] Zustand 状态管理

### 阶段 4：预算功能（第 5 天）
- [ ] 预算设置
- [ ] 进度计算
- [ ] 超支提醒

### 阶段 5：UI 开发（第 6-7 天）
- [ ] 登录/注册页
- [ ] 首页
- [ ] 记账页
- [ ] 账单列表页
- [ ] 统计页
- [ ] 预算页
- [ ] 设置页

### 阶段 6：统计与导出（第 8 天）
- [ ] 日/周/月统计
- [ ] Recharts 图表
- [ ] CSV 导出
- [ ] 数据备份/恢复

### 阶段 7：测试与打包（第 9 天）
- [ ] 功能测试
- [ ] Bug 修复
- [ ] Windows 打包
- [ ] 最终优化

## 开发规范

### 代码规范
- 使用 TypeScript 严格模式
- 组件使用函数式组件 + Hooks
- 使用 ESLint + Prettier 格式化
- 文件命名：组件用 PascalCase，工具用 camelCase
- 注释：关键逻辑必须有中文注释

### Git 规范
- 提交信息使用中文
- 格式：`类型: 描述`（如：`功能: 添加用户注册`）
- 类型：功能/修复/文档/样式/重构/测试/构建

### 性能要求
- 启动时间 < 3 秒
- 列表加载（1000 条）< 1 秒
- 内存占用 < 300MB
- 记账操作 < 10 秒完成

## 运行命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 打包 Windows 安装包
npm run package

# 测试
npm run test
```

## 注意事项

1. **数据安全**：密码必须使用 bcrypt 加密，不可明文存储
2. **数据隔离**：不同用户的数据必须完全隔离
3. **金额精度**：使用 DECIMAL(10,2) 存储金额，避免浮点数精度问题
4. **日期处理**：统一使用 ISO 格式存储日期
5. **错误处理**：所有异步操作必须有错误处理
6. **用户体验**：操作要有加载状态和成功/失败反馈

## 待办事项

当前优先级：
1. 🔴 高优先级：项目初始化
2. 🔴 高优先级：用户系统
3. 🟡 中优先级：核心记账功能
4. 🟡 中优先级：UI 开发
5. 🟢 低优先级：统计图表
6. 🟢 低优先级：数据导出
