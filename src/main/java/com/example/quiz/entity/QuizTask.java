package com.example.quiz.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * 试卷生成任务实体
 *
 * @author HarryReid(黄药师)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("mcp_quiz_tasks")
public class QuizTask implements Persistable<UUID> {

    @Id
    private UUID id;

    @Transient
    @Builder.Default
    private boolean isNew = true;

    @Column("title")
    private String title;

    @Column("audience")
    private String audience;

    @Column("purpose")
    private String purpose;

    @Column("status")
    private TaskStatus status;

    @Column("original_request")
    private String originalRequest;

    @Column("result_url")
    private String resultUrl;

    @Column("html_path")
    private String htmlPath;

    @Column("score_rules")
    private String scoreRules;

    @Column("created_at")
    private LocalDateTime createdAt;

    @Column("updated_at")
    private LocalDateTime updatedAt;

    @Column("error_msg")
    private String errorMsg;

    @Column("total_questions")
    private Integer totalQuestions;

    @Column("file_size")
    private Long fileSize;

    /**
     * 任务状态枚举
     */
    public enum TaskStatus {
        PENDING,      // 待处理
        PROCESSING,   // 处理中
        COMPLETED,    // 已完成
        FAILED        // 失败
    }

    @Override
    public boolean isNew() {
        return isNew;
    }

    public void markNotNew() {
        this.isNew = false;
    }
}
