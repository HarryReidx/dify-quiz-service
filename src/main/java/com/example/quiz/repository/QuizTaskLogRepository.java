package com.example.quiz.repository;

import com.example.quiz.entity.QuizTaskLog;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 试卷任务日志数据访问层
 *
 * @author HarryReid(黄药师)
 */
@Repository
public interface QuizTaskLogRepository extends CrudRepository<QuizTaskLog, String> {
    /**
     * 根据任务ID查询日志，按创建时间倒序
     */
    List<QuizTaskLog> findByTaskIdOrderByCreatedAtDesc(String taskId);
}
