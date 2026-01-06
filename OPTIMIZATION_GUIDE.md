# Quiz Template 优化指南

## 当前问题
- HTML文件过大（2138行）
- CSS样式内联在HTML中（约1520行）
- JavaScript代码内联在HTML中（约600行）
- 难以维护和修改

## 优化方案

### 1. 文件结构
```
src/main/resources/
├── static/
│   ├── css/
│   │   └── quiz-styles.css      # 提取所有CSS样式
│   ├── js/
│   │   └── quiz-script.js       # 提取所有JavaScript
│   └── images/
│       └── tsingyun-ai-logo-白.svg
└── templates/
    └── quiz_template.html       # 简化后的HTML模板
```

### 2. 优化步骤

#### 步骤1: 提取CSS
将 `<style>` 标签内的所有CSS（第10-1530行）移动到 `static/css/quiz-styles.css`

#### 步骤2: 提取JavaScript  
将 `<script>` 标签内的所有JS（第1783-2135行）移动到 `static/js/quiz-script.js`

#### 步骤3: 更新HTML引用
```html
<head>
    <link rel="stylesheet" href="/css/quiz-styles.css">
</head>
<body>
    <!-- HTML内容 -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/quiz-script.js"></script>
</body>
```

### 3. 预期效果
- HTML文件从 2138行 减少到 约200行
- 代码结构清晰，易于维护
- 样式和逻辑分离
- 浏览器可以缓存CSS和JS文件

### 4. 注意事项
- 保留 Thymeleaf 模板语法在HTML中
- 保留 `QUIZ_DATA` 的内联script（需要服务器端数据）
- 确保静态资源路径正确

## 下一步
是否需要我执行这个优化？我将：
1. 创建 quiz-styles.css 文件
2. 创建 quiz-script.js 文件  
3. 创建简化版的 quiz_template_v2.html
4. 保留原文件作为备份
