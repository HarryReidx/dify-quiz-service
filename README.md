# Dify Quiz Service

基于 Spring Boot 3.5.5 的试卷生成微服务，用于替代旧的 Python Flask 服务。

## 技术栈

- **Language**: Java 17
- **Framework**: Spring Boot 3.5.5
- **Database**: PostgreSQL 12+ (复用 spring-mcps 数据库)
- **Storage**: MinIO 8.5.7 (复用 spring-mcps MinIO)
- **HTTP Client**: OkHttp 4.12.0
- **Build Tool**: Maven
- **Template Engine**: Thymeleaf

## 功能特性

- 接收结构化 JSON 请求生成交互式 HTML 试卷
- 支持单选题、多选题、判断题
- 自动评分和错题解析
- MinIO 对象存储集成
- PostgreSQL 任务状态管理和日志记录

## API 接口

### POST /api/quiz/generate

同步生成试卷（阻塞等待，返回完整结果）

**Request Body:**
```json
{
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
}
```

**Response:**
```json
{
  "taskId": "uuid",
  "status": "COMPLETED",
  "url": "http://117.50.75.212:9000/ty-ai-flow/quiz-files/uuid.html",
  "message": "试卷生成成功",
  "totalTime": 1234,
  "fileSize": 56789
}
```

### GET /api/quiz/task/{taskId}

查询任务详情

### GET /api/quiz/task/{taskId}/logs

查询任务日志

### GET /api/quiz/health

健康检查

## 快速开始

### 1. 数据库准备

**复用 spring-mcps 的数据库**，执行建表脚本：

```bash
psql -h 117.50.75.212 -U postgres -d dify -f src/main/resources/schema.sql
```

### 2. 配置文件

默认配置已设置为复用 spring-mcps 的数据库和 MinIO：

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
```

### 3. 构建运行

```bash
# Windows
run.bat

# Linux/Mac
mvn spring-boot:run
```

### 4. 测试

```bash
# Windows
test-api.bat

# Linux/Mac
bash test-api.sh
```

## 数据库表结构

```sql
-- 试卷任务表
CREATE TABLE mcp_quiz_tasks (
    id UUID PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    audience VARCHAR(200),
    purpose VARCHAR(200),
    status VARCHAR(20) NOT NULL,
    original_request JSONB NOT NULL,
    result_url TEXT,
    html_path TEXT,
    score_rules JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    error_msg TEXT,
    total_questions INTEGER,
    file_size BIGINT
);

-- 任务日志表
CREATE TABLE mcp_quiz_task_logs (
    id UUID PRIMARY KEY,
    task_id UUID NOT NULL REFERENCES mcp_quiz_tasks(id),
    log_level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL
);
```

## 生成的 HTML 功能

- ✅ Bootstrap 5 + FontAwesome 现代化设计
- ✅ 实时答题进度条
- ✅ 单选互斥、多选可取消
- ✅ 智能评分（多选题部分分）
- ✅ 错题高亮和解析显示
- ✅ 重新答题功能

## 项目结构

```
dify-quiz-service/
├── src/main/java/com/example/quiz/
│   ├── QuizServiceApplication.java
│   ├── config/
│   │   ├── AppProperties.java
│   │   ├── MinioClientConfig.java
│   │   └── JdbcConfig.java
│   ├── controller/
│   │   └── QuizController.java
│   ├── entity/
│   │   ├── QuizTask.java
│   │   └── QuizTaskLog.java
│   ├── model/
│   │   ├── QuizRequest.java
│   │   ├── QuizQuestion.java
│   │   ├── QuizOption.java
│   │   └── QuizResponse.java
│   ├── repository/
│   │   ├── QuizTaskRepository.java
│   │   └── QuizTaskLogRepository.java
│   └── service/
│       ├── QuizGenerationService.java
│       └── MinioService.java
└── src/main/resources/
    ├── application.yml
    ├── schema.sql
    └── templates/
        └── quiz_template.html
```

## 与 Flask 服务的区别

| 特性 | Flask 服务 | Spring Boot 服务 |
|------|-----------|-----------------|
| 输入格式 | Markdown | 结构化 JSON |
| 数据库 | 无 | PostgreSQL (任务+日志) |
| 任务管理 | 无 | 完整的任务状态跟踪 |
| 日志记录 | 无 | 数据库持久化日志 |
| 类型安全 | 弱类型 | 强类型 + 验证 |
| 代码风格 | - | 与 spring-mcps 一致 |

## 与 spring-mcps 的集成

- 复用相同的 PostgreSQL 数据库 (dify)
- 复用相同的 MinIO 存储 (ty-ai-flow bucket)
- 遵循相同的代码风格和架构模式
- 使用相同的表命名规范 (mcp_* 前缀)
- 使用相同的日志记录机制

## 开发说明

- 遵循 Clean Architecture 和 DDD 原则
- 使用 Spring Data JDBC 而非 JPA
- 依赖注入通过构造函数
- 代码风格与 spring-mcps 保持一致
- 全局异常处理更新任务状态

## License

MIT
