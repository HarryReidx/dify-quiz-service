# 快速启动指南

## 1. 编译项目

```bash
cd dify-quiz-service
mvn clean package -DskipTests
```

编译成功后会生成 `target/dify-quiz-service-0.0.1-SNAPSHOT.jar`

## 2. 执行数据库建表

连接到数据库执行建表脚本：

```bash
psql -h 117.50.75.212 -U postgres -d dify -f src/main/resources/schema.sql
```

或者手动执行 `src/main/resources/schema.sql` 中的 SQL。

## 3. 启动服务

### Windows
```bash
run.bat
```

### Linux/Mac
```bash
java -jar target/dify-quiz-service-0.0.1-SNAPSHOT.jar
```

服务将在 `http://localhost:8081` 启动。

## 4. 测试服务

### Windows
```bash
test-api.bat
```

### Linux/Mac
```bash
bash test-api.sh
```

## 5. 查看结果

测试成功后，响应中会包含生成的试卷 URL：

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

在浏览器中打开 `url` 即可查看生成的交互式试卷。

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

## API 文档

详见 [README.md](README.md)
