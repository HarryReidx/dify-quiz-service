# Dify Quiz Service 部署指南

## 前置条件

1. Java 17
2. Maven 3.6+
3. 访问 spring-mcps 的数据库和 MinIO

## 部署步骤

### 1. 清理旧代码（如果存在）

删除 `src/main/java/com/dify` 目录（旧的包结构）：

```bash
rm -rf src/main/java/com/dify
```

### 2. 执行数据库建表脚本

连接到 spring-mcps 的数据库执行：

```bash
psql -h 117.50.75.212 -U postgres -d dify -f src/main/resources/schema.sql
```

或手动执行 SQL：

```sql
-- 试卷任务表
CREATE TABLE IF NOT EXISTS mcp_quiz_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    audience VARCHAR(200),
    purpose VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    original_request JSONB NOT NULL,
    result_url TEXT,
    html_path TEXT,
    score_rules JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    error_msg TEXT,
    total_questions INTEGER,
    file_size BIGINT
);

-- 任务日志表
CREATE TABLE IF NOT EXISTS mcp_quiz_task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES mcp_quiz_tasks(id) ON DELETE CASCADE,
    log_level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_mcp_quiz_tasks_status ON mcp_quiz_tasks(status);
CREATE INDEX IF NOT EXISTS idx_mcp_quiz_tasks_created_at ON mcp_quiz_tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mcp_quiz_task_logs_task_id ON mcp_quiz_task_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_mcp_quiz_task_logs_created_at ON mcp_quiz_task_logs(created_at DESC);
```

### 3. 构建项目

```bash
mvn clean package -DskipTests
```

### 4. 运行服务

```bash
# Windows
run.bat

# Linux/Mac
java -jar target/dify-quiz-service-0.0.1-SNAPSHOT.jar
```

服务将在 `http://localhost:8081` 启动。

### 5. 测试服务

```bash
# Windows
test-api.bat

# Linux/Mac
bash test-api.sh
```

## 配置说明

### application.yml

默认配置已设置为复用 spring-mcps 的资源：

```yaml
spring:
  datasource:
    url: jdbc:postgresql://117.50.75.212:5432/dify
    username: postgres
    password: TyAdmin@2026

app:
  minio:
    endpoint: http://117.50.75.212:9000
    access-key: minioadmin
    secret-key: TyAdmin@2026
    bucket-name: ty-ai-flow
    upload-path: quiz-files/
    public-url-prefix: http://117.50.75.212:9000/ty-ai-flow
```

### 环境变量覆盖

可以通过环境变量覆盖配置：

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://your-host:5432/dify
export S3_ENDPOINT=http://your-minio:9000
export S3_ACCESS_KEY=your-access-key
export S3_SECRET_KEY=your-secret-key
```

## API 测试

### 生成试卷

```bash
curl -X POST http://localhost:8081/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Java 基础测试",
    "audience": "初级开发者",
    "purpose": "入职考核",
    "questions": [
      {
        "id": 1,
        "type": "SINGLE",
        "content": "Java中int占用几个字节？",
        "options": [
          { "label": "A", "content": "4", "isCorrect": true },
          { "label": "B", "content": "8", "isCorrect": false }
        ],
        "explanation": "int在Java中固定为32位，即4字节。",
        "reference": "Java语言规范 第3章"
      }
    ]
  }'
```

### 查询任务

```bash
curl http://localhost:8081/api/quiz/task/{taskId}
```

### 查询日志

```bash
curl http://localhost:8081/api/quiz/task/{taskId}/logs
```

### 健康检查

```bash
curl http://localhost:8081/api/quiz/health
```

## 故障排查

### 1. 数据库连接失败

检查数据库配置和网络连接：

```bash
psql -h 117.50.75.212 -U postgres -d dify
```

### 2. MinIO 上传失败

检查 MinIO 配置和 bucket 是否存在：

```bash
mc alias set myminio http://117.50.75.212:9000 minioadmin TyAdmin@2026
mc ls myminio/ty-ai-flow
```

### 3. 查看日志

```bash
tail -f logs/spring.log
```

## 生产部署建议

1. 使用 Docker 容器化部署
2. 配置 Nginx 反向代理
3. 启用 HTTPS
4. 配置日志轮转
5. 监控服务健康状态

## 与 Dify 集成

在 Dify 工作流中调用此服务：

1. 使用 HTTP 节点
2. 配置 POST 请求到 `/api/quiz/generate`
3. 传入试卷 JSON 数据
4. 获取返回的 URL 并展示给用户
