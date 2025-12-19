package com.example.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 试卷生成任务日志实体
 *
 * @author HarryReid(黄药师)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("mcp_quiz_task_logs")
public class QuizTaskLog {

    @Id
    private UUID id;

    @Column("task_id")
    private UUID taskId;

    @Column("log_level")
    private String logLevel;

    @Column("message")
    private String message;

    @Column("created_at")
    private LocalDateTime createdAt;
}
