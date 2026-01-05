package com.example.quiz.controller;

import com.example.quiz.model.QuizRequest;
import com.example.quiz.repository.QuizTaskLogRepository;
import com.example.quiz.repository.QuizTaskRepository;
import com.example.quiz.service.QuizGenerationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * 试卷生成控制器
 *
 * @author HarryReid(黄药师)
 */
@Slf4j
@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {
    private final QuizGenerationService quizGenerationService;
    private final QuizTaskRepository taskRepository;
    private final QuizTaskLogRepository taskLogRepository;

    /**
     * 同步生成试卷
     * 阻塞等待，返回完整结果
     */
    @PostMapping("/generate/sync")
    public ResponseEntity<Map<String, Object>> generateQuizSync(@Valid @RequestBody QuizRequest request) {
        log.info("收到同步试卷生成请求: title={}, questions={}", 
                request.getTitle(), request.getQuestions().size());

        // 参数校验
        validateRequest(request);

        // 创建并执行同步任务
        Map<String, Object> response = quizGenerationService.createAndExecuteTaskSync(request);

        return ResponseEntity.ok(response);
    }

    /**
     * 生成试卷（兼容旧接口，默认同步）
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateQuiz(@Valid @RequestBody QuizRequest request) {
        return generateQuizSync(request);
    }

    /**
     * 查询任务详情
     */
    @GetMapping("/task/{taskId}")
    public ResponseEntity<?> getTask(@PathVariable String taskId) {
        return taskRepository.findById(taskId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 查询任务日志
     */
    @GetMapping("/task/{taskId}/logs")
    public ResponseEntity<?> getTaskLogs(@PathVariable String taskId) {
        return ResponseEntity.ok(taskLogRepository.findByTaskIdOrderByCreatedAtDesc(taskId));
    }

    /**
     * 健康检查
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    /**
     * 参数校验
     */
    private void validateRequest(QuizRequest request) {
        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            throw new IllegalArgumentException("试卷标题不能为空");
        }
        if (request.getQuestions() == null || request.getQuestions().isEmpty()) {
            throw new IllegalArgumentException("题目列表不能为空");
        }
        if (request.getQuestions().size() > 100) {
            throw new IllegalArgumentException("题目数量不能超过 100 题");
        }
    }
}
