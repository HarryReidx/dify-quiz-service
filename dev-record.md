# Dify Quiz Service 项目开发上下文

## 项目概述

**项目名称**: dify-quiz-service  
**项目位置**: `D:\1-workspace\1-tsingyun-ws\5-ai\dify-quiz-service`  
**项目类型**: Spring Boot 3.5.5 微服务  
**目的**: 替代旧的 Python Flask 试卷生成服务，为 Dify AI Agent 工作流提供试卷生成能力

## 技术栈

- **语言**: Java 17
- **框架**: Spring Boot 3.5.5
- **数据库**: PostgreSQL 12+ (复用 spring-mcps 的数据库)
- **对象存储**: MinIO 8.5.7 (复用 spring-mcps 的 MinIO)
- **模板引擎**: Thymeleaf
- **数据访问**: Spring Data JDBC
- **构建工具**: Maven
- **依赖管理**: Lombok, Jackson, OkHttp 4.12.0

## 项目结构

```
dify-quiz-service/
├── src/main/java/com/example/quiz/
│   ├── QuizServiceApplication.java          # 主应用类
│   ├── config/
│   │   ├── AppProperties.java               # 配置属性 (@ConfigurationProperties)
│   │   ├── MinioClientConfig.java           # MinIO 客户端配置
│   │   └── JdbcConfig.java                  # JDBC 配置
│   ├── controller/
│   │   └── QuizController.java              # REST API 控制器
│   ├── entity/
│   │   ├── QuizTask.java                    # 任务实体 (mcp_quiz_tasks)
│   │   └── QuizTaskLog.java                 # 日志实体 (mcp_quiz_task_logs)
│   ├── model/
│   │   ├── QuizRequest.java                 # 请求模型
│   │   ├── QuizQuestion.java                # 题目模型 (含 QuestionType 枚举)
│   │   ├── QuizOption.java                  # 选项模型
│   │   └── QuizResponse.java                # 响应模型
│   ├── repository/
│   │   ├── QuizTaskRepository.java          # 任务数据访问
│   │   └── QuizTaskLogRepository.java       # 日志数据访问
│   └── service/
│       ├── QuizGenerationService.java       # 试卷生成核心服务
│       └── MinioService.java                # MinIO 上传服务
└── src/main/resources/
    ├── application.yml                       # 应用配置
    ├── schema.sql                            # 数据库建表脚本
    └── templates/
        └── quiz_template.html                # Thymeleaf 模板
```

## 核心配置

### 数据库配置 (复用 spring-mcps)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://117.50.75.212:5432/dify
    username: postgres
    password: TyAdmin@2026
```

### MinIO 配置 (复用 spring-mcps)
```yaml
app:
  minio:
    endpoint: http://117.50.75.212:9000
    access-key: minioadmin
    secret-key: TyAdmin@2026
    bucket-name: ty-ai-flow
    upload-path: quiz-files/
    public-url-prefix: http://117.50.75.212:9000/ty-ai-flow
```

### 服务端口
```yaml
server:
  port: 8081
```

## 数据库表结构

### mcp_quiz_tasks (试卷任务表)
- `id` UUID PRIMARY KEY
- `title` VARCHAR(500) - 试卷标题
- `audience` VARCHAR(200) - 受众
- `purpose` VARCHAR(200) - 考察目的
- `status` VARCHAR(20) - 任务状态 (PENDING/PROCESSING/COMPLETED/FAILED)
- `original_request` JSONB - 原始请求 JSON
- `result_url` TEXT - 生成的 HTML URL
- `html_path` TEXT - MinIO 文件路径
- `score_rules` JSONB - 评分规则
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP
- `error_msg` TEXT - 错误信息
- `total_questions` INTEGER - 题目总数
- `file_size` BIGINT - 文件大小

### mcp_quiz_task_logs (任务日志表)
- `id` UUID PRIMARY KEY
- `task_id` UUID REFERENCES mcp_quiz_tasks(id)
- `log_level` VARCHAR(20) - 日志级别
- `message` TEXT - 日志消息
- `created_at` TIMESTAMP

## API 接口

### POST /api/quiz/generate
同步生成试卷（阻塞等待，返回完整结果）

**请求体**:
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

**题目类型**:
- `SINGLE` - 单选题
- `MULTI` - 多选题
- `JUDGE` - 判断题

**响应**:
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

## 代码风格规范 (与 spring-mcps 保持一致)

### 1. 包结构
- 使用 `com.example.quiz` (与 spring-mcps 的 `com.example.ingest` 一致)

### 2. 实体类
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("mcp_quiz_tasks")
public class QuizTask {
    @Id
    private UUID id;
    
    @Column("title")
    private String title;
    // ...
}
```

### 3. 配置类
```java
@Data
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private MinioConfig minio = new MinioConfig();
    // ...
}
```

### 4. 注释风格
```java
/**
 * 试卷生成服务
 *
 * @author HarryReid(黄药师)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuizGenerationService {
    // ...
}
```

### 5. 表命名规范
- 使用 `mcp_` 前缀 (如 `mcp_quiz_tasks`, `mcp_quiz_task_logs`)

### 6. 依赖注入
- 使用构造函数注入 + `@RequiredArgsConstructor`

## 生成的 HTML 功能

- ✅ Bootstrap 5 + FontAwesome 现代化 UI
- ✅ 实时答题进度条
- ✅ 单选互斥、多选可取消
- ✅ 智能评分（单选/判断全对得分，多选漏选部分分、错选不得分）
- ✅ 错题高亮和解析显示
- ✅ 重新答题功能

## 快速命令

### 编译
```bash
cd D:\1-workspace\1-tsingyun-ws\5-ai\dify-quiz-service
mvn clean package -DskipTests
```

### 启动
```bash
run.bat  # Windows
# 或
java -jar target/dify-quiz-service-0.0.1-SNAPSHOT.jar
```

### 测试
```bash
test-api.bat  # Windows
# 或
bash test-api.sh
```

### 数据库建表
```bash
psql -h 117.50.75.212 -U postgres -d dify -f src/main/resources/schema.sql
```

## 参考项目

**spring-mcps** 位于: `D:\1-workspace\1-tsingyun-ws\5-ai\spring-mcps`

需要参考 spring-mcps 的代码风格时，可以查看：
- `src/main/java/com/example/ingest/entity/IngestTask.java` - 实体类风格
- `src/main/java/com/example/ingest/config/AppProperties.java` - 配置类风格
- `src/main/java/com/example/ingest/controller/DocumentIngestController.java` - 控制器风格
- `src/main/resources/application.yml` - 配置文件风格

## 开发原则

1. **Clean Architecture** - 遵循 DDD 和 Clean Architecture 原则
2. **依赖注入** - 通过构造函数注入依赖
3. **类型安全** - 使用强类型，避免 Any
4. **代码一致性** - 与 spring-mcps 保持高度一致的代码风格
5. **日志记录** - 使用 Slf4j + 数据库持久化日志
6. **异常处理** - 全局异常处理，更新任务状态为 FAILED

## 核心类说明

### QuizGenerationService
试卷生成核心服务，负责：
- 创建任务记录
- 使用 Thymeleaf 渲染 HTML
- 调用 MinioService 上传文件
- 更新任务状态和日志

### MinioService
MinIO 对象存储服务，负责：
- 上传 HTML 文件到 MinIO
- 返回公开访问 URL
- 自动创建 bucket（如果不存在）

### QuizController
REST API 控制器，提供：
- POST /api/quiz/generate - 同步生成试卷
- GET /api/quiz/task/{taskId} - 查询任务详情
- GET /api/quiz/task/{taskId}/logs - 查询任务日志
- GET /api/quiz/health - 健康检查

## 当前状态

- ✅ 项目结构完整
- ✅ 代码编译通过
- ✅ 数据库表已创建
- ✅ 服务启动成功
- ✅ API 测试通过
- ✅ 文档完整
- ✅ 试卷生成功能正常
- ✅ MinIO 文件上传正常
- ✅ 选项级错误解析功能
- ✅ 引用文献悬停功能
- ✅ 题型视觉区分优化
- ✅ 按钮样式和交互优化

## 已解决的问题

### 1. Spring Data JDBC UUID 主键问题
**问题**: 使用 UUID 作为主键时，Spring Data JDBC 默认执行 UPDATE 而不是 INSERT
**解决方案**: 
- 实体类实现 `Persistable<UUID>` 接口
- 添加 `@Transient @Builder.Default private boolean isNew = true;` 字段
- 实现 `isNew()` 方法返回该字段
- 在更新实体前调用 `markNotNew()` 方法

### 2. JSONB 类型转换问题
**问题**: PostgreSQL 的 JSONB 类型无法直接映射到 String
**解决方案**: 将数据库字段类型从 JSONB 改为 TEXT

### 3. Lombok @Builder 忽略字段初始化
**问题**: `@Builder` 会忽略字段的初始化表达式
**解决方案**: 使用 `@Builder.Default` 注解标记需要默认值的字段

## 常见问题

### 1. 编译失败
确保已安装 Java 17 和 Maven 3.6+：
```bash
java -version
mvn -version
```

### 2. 数据库连接失败
检查数据库配置和网络连接：
```bash
psql -h 117.50.75.212 -U postgres -d dify
```

### 3. MinIO 上传失败
检查 MinIO 服务是否正常：
```bash
curl http://117.50.75.212:9000/minio/health/live
```

### 4. 端口被占用
修改 `src/main/resources/application.yml` 中的端口：
```yaml
server:
  port: 8082  # 改为其他端口
```

### 5. 重新初始化数据库
如果需要重新创建数据库表：
```bash
java -jar target/dify-quiz-service-0.0.1-SNAPSHOT.jar --spring.profiles.active=init
```

## 文档索引

- `README.md` - 完整项目文档
- `QUICKSTART.md` - 快速启动指南
- `SETUP.md` - 详细部署指南
- `PROJECT_SUMMARY.md` - 项目总结
- `DIFY_QUIZ_SERVICE_CONTEXT.md` - 本文档（开发上下文）

---

**使用说明**: 当你在新的 AI 会话中继续开发此项目时，请将本文档内容提供给 AI，告诉它你在 `D:\1-workspace\1-tsingyun-ws\5-ai\dify-quiz-service` 目录下工作，需要继续开发或调试该项目。
