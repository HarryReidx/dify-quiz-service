-- 删除旧表
DROP TABLE IF EXISTS mcp_quiz_task_logs CASCADE;
DROP TABLE IF EXISTS mcp_quiz_tasks CASCADE;

-- Quiz Tasks Table (与 mcp_ingest_tasks 风格保持一致)
CREATE TABLE IF NOT EXISTS mcp_quiz_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    audience VARCHAR(200),
    purpose VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    original_request TEXT NOT NULL,
    result_url TEXT,
    html_path TEXT,
    score_rules TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    error_msg TEXT,
    total_questions INTEGER,
    file_size BIGINT
);

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_mcp_quiz_tasks_status ON mcp_quiz_tasks(status);

-- Index for created_at queries
CREATE INDEX IF NOT EXISTS idx_mcp_quiz_tasks_created_at ON mcp_quiz_tasks(created_at DESC);

-- Quiz Task Logs Table (与 mcp_ingest_task_logs 风格保持一致)
CREATE TABLE IF NOT EXISTS mcp_quiz_task_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES mcp_quiz_tasks(id) ON DELETE CASCADE,
    log_level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index for task_id queries
CREATE INDEX IF NOT EXISTS idx_mcp_quiz_task_logs_task_id ON mcp_quiz_task_logs(task_id);

-- Index for created_at queries
CREATE INDEX IF NOT EXISTS idx_mcp_quiz_task_logs_created_at ON mcp_quiz_task_logs(created_at DESC);
