-- MySQL 版本的建表脚本
-- 使用方法：mysql -h 117.50.226.140 -P 3306 -u root -p dify < recreate-tables-mysql.sql

-- 删除旧表（如果存在）
DROP TABLE IF EXISTS mcp_quiz_task_logs;
DROP TABLE IF EXISTS mcp_quiz_tasks;

-- Quiz Tasks Table (MySQL 版本)
CREATE TABLE mcp_quiz_tasks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(500) NOT NULL,
    audience VARCHAR(200),
    purpose VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    original_request TEXT NOT NULL,
    result_url TEXT,
    html_path TEXT,
    score_rules TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    error_msg TEXT,
    total_questions INTEGER,
    file_size BIGINT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index for status queries
CREATE INDEX idx_mcp_quiz_tasks_status ON mcp_quiz_tasks(status);

-- Index for created_at queries
CREATE INDEX idx_mcp_quiz_tasks_created_at ON mcp_quiz_tasks(created_at DESC);

-- Quiz Task Logs Table (MySQL 版本)
CREATE TABLE mcp_quiz_task_logs (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    task_id CHAR(36) NOT NULL,
    log_level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES mcp_quiz_tasks(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index for task_id queries
CREATE INDEX idx_mcp_quiz_task_logs_task_id ON mcp_quiz_task_logs(task_id);

-- Index for created_at queries
CREATE INDEX idx_mcp_quiz_task_logs_created_at ON mcp_quiz_task_logs(created_at DESC);

-- 显示创建的表
SHOW TABLES LIKE 'mcp_quiz%';
