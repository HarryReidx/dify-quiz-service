# 快速开始使用优化后的模板

## 🚀 一键切换到优化版本

### 步骤1: 备份原文件
```bash
cd src/main/resources/templates
copy quiz_template.html quiz_template_backup.html
```

### 步骤2: 替换为优化版本
```bash
del quiz_template.html
ren quiz_template_v2.html quiz_template.html
```

### 步骤3: 放置Logo文件
将 `tsingyun-ai-logo-白.svg` 复制到 `src/main/resources/static/` 目录

### 步骤4: 重启应用
```bash
# 如果使用run.bat
run.bat

# 或者使用Maven
mvn spring-boot:run
```

## ✅ 验证

访问测试页面，检查：
- [ ] 页面样式正常
- [ ] 考试模式可用
- [ ] 练习模式可用
- [ ] 左下角Logo显示

## 🔄 如果需要回滚

```bash
cd src/main/resources/templates
del quiz_template.html
copy quiz_template_backup.html quiz_template.html
```

## 📊 优化效果

- HTML文件: 2138行 → 242行 (减少88.7%)
- 代码结构: 更清晰、更易维护
- 浏览器缓存: CSS和JS可被缓存
- 加载速度: 更快

## 💡 提示

所有功能都已保留，包括：
- ✅ 双模式切换
- ✅ 拖动模式切换器
- ✅ 引用依据tooltip
- ✅ 左下角果冻效果footer
- ✅ 响应式设计
