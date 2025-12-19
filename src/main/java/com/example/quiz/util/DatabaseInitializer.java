package com.example.quiz.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * 数据库初始化工具
 * 仅在 init profile 下运行
 *
 * @author HarryReid(黄药师)
 */
@Slf4j
@Component
@Profile("init")
public class DatabaseInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("开始初始化数据库...");

        // 删除旧表
        log.info("删除旧表...");
        jdbcTemplate.execute("DROP TABLE IF EXISTS mcp_quiz_task_logs CASCADE");
        jdbcTemplate.execute("DROP TABLE IF EXISTS mcp_quiz_tasks CASCADE");

        // 创建新表
        log.info("创建 mcp_quiz_tasks 表...");
        jdbcTemplate.execute("""
            CREATE TABLE mcp_quiz_tasks (
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
            )
        """);

        log.info("创建索引...");
        jdbcTemplate.execute("CREATE INDEX idx_mcp_quiz_tasks_status ON mcp_quiz_tasks(status)");
        jdbcTemplate.execute("CREATE INDEX idx_mcp_quiz_tasks_created_at ON mcp_quiz_tasks(created_at DESC)");

        log.info("创建 mcp_quiz_task_logs 表...");
        jdbcTemplate.execute("""
            CREATE TABLE mcp_quiz_task_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                task_id UUID NOT NULL REFERENCES mcp_quiz_tasks(id) ON DELETE CASCADE,
                log_level VARCHAR(20) NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        """);

        log.info("创建日志表索引...");
        jdbcTemplate.execute("CREATE INDEX idx_mcp_quiz_task_logs_task_id ON mcp_quiz_task_logs(task_id)");
        jdbcTemplate.execute("CREATE INDEX idx_mcp_quiz_task_logs_created_at ON mcp_quiz_task_logs(created_at DESC)");

        log.info("数据库初始化完成！");
    }
}
