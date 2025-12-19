package com.example.quiz.repository;

import com.example.quiz.entity.QuizTaskLog;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * 试卷任务日志数据访问层
 *
 * @author HarryReid(黄药师)
 */
@Repository
public interface QuizTaskLogRepository extends CrudRepository<QuizTaskLog, UUID> {
    /**
     * 根据任务ID查询日志，按创建时间倒序
     */
    List<QuizTaskLog> findByTaskIdOrderByCreatedAtDesc(UUID taskId);
}
