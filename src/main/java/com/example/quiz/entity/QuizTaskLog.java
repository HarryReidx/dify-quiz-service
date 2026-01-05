package com.example.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;

/**
 * 试卷生成任务日志实体
 *
 * @author HarryReid(黄药师)
 */
@Data
@Builder
@Slf4j
@NoArgsConstructor
@AllArgsConstructor
@Table("mcp_quiz_task_logs")
public class QuizTaskLog implements Persistable<String> {

    @Id
    private String id;

    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Column("task_id")
    private String taskId;

    @Column("log_level")
    private String logLevel;

    @Column("message")
    private String message;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Override
    public boolean isNew() {
        return isNew;
    }

    public void markNotNew() {
        this.isNew = false;
    }
}
