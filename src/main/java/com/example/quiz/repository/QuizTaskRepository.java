package com.example.quiz.repository;

import com.example.quiz.entity.QuizTask;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * 试卷任务数据访问层
 *
 * @author HarryReid(黄药师)
 */
@Repository
public interface QuizTaskRepository extends CrudRepository<QuizTask, String> {
}
