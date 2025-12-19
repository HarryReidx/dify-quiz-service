package com.example.quiz.service;

import com.example.quiz.entity.QuizTask;
import com.example.quiz.entity.QuizTaskLog;
import com.example.quiz.model.QuizRequest;
import com.example.quiz.repository.QuizTaskLogRepository;
import com.example.quiz.repository.QuizTaskRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 试卷生成服务
 *
 * @author HarryReid(黄药师)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QuizGenerationService {
    private final QuizTaskRepository taskRepository;
    private final QuizTaskLogRepository taskLogRepository;
    private final MinioService minioService;
    private final SpringTemplateEngine templateEngine;
    private final ObjectMapper objectMapper;

    /**
     * 创建并执行同步任务
     *
     * @param request 试卷生成请求
     * @return 响应结果
     */
    @Transactional
    public Map<String, Object> createAndExecuteTaskSync(QuizRequest request) {
        long startTime = System.currentTimeMillis();
        UUID taskId = null;

        try {
            // 创建任务
            taskId = createTask(request);
            addLog(taskId, "INFO", "开始生成试卷");

            // 生成 HTML
            addLog(taskId, "INFO", "开始渲染 HTML 模板");
            String html = generateHtml(request);
            long htmlSize = html.getBytes().length;
            addLog(taskId, "INFO", String.format("HTML 生成完成，大小: %d 字节", htmlSize));

            // 上传到 MinIO
            addLog(taskId, "INFO", "开始上传到 MinIO");
            String filename = taskId + ".html";
            String url = minioService.uploadHtml(filename, html);
            addLog(taskId, "INFO", "上传成功: " + url);

            // 更新任务状态
            QuizTask task = taskRepository.findById(taskId).orElseThrow();
            task.setStatus(QuizTask.TaskStatus.COMPLETED);
            task.setResultUrl(url);
            task.setHtmlPath(filename);
            task.setFileSize((long) htmlSize);
            task.setUpdatedAt(LocalDateTime.now());
            taskRepository.save(task);

            long totalTime = System.currentTimeMillis() - startTime;
            addLog(taskId, "INFO", String.format("任务完成，总耗时: %d ms", totalTime));

            // 构建响应
            Map<String, Object> response = new HashMap<>();
            response.put("taskId", taskId.toString());
            response.put("status", "COMPLETED");
            response.put("url", url);
            response.put("message", "试卷生成成功");
            response.put("totalTime", totalTime);
            response.put("fileSize", htmlSize);

            return response;

        } catch (Exception e) {
            log.error("同步任务执行失败", e);
            if (taskId != null) {
                addLog(taskId, "ERROR", "任务失败: " + e.getMessage());
                updateTaskFailed(taskId, e.getMessage());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("taskId", taskId != null ? taskId.toString() : null);
            response.put("status", "FAILED");
            response.put("message", "试卷生成失败: " + e.getMessage());
            return response;
        }
    }

    /**
     * 创建任务
     *
     * @param request 试卷生成请求
     * @return 任务 ID
     */
    @Transactional
    public UUID createTask(QuizRequest request) {
        try {
            UUID taskId = UUID.randomUUID();
            QuizTask task = QuizTask.builder()
                    .id(taskId)
                    .title(request.getTitle())
                    .audience(request.getAudience())
                    .purpose(request.getPurpose())
                    .status(QuizTask.TaskStatus.PENDING)
                    .originalRequest(objectMapper.writeValueAsString(request))
                    .totalQuestions(request.getQuestions().size())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            QuizTask saved = taskRepository.save(task);
            log.info("创建试卷任务: taskId={}, title={}", saved.getId(), request.getTitle());
            return saved.getId();
        } catch (Exception e) {
            log.error("创建任务失败", e);
            throw new RuntimeException("创建任务失败: " + e.getMessage(), e);
        }
    }

    /**
     * 生成 HTML
     *
     * @param request 试卷请求
     * @return HTML 内容
     */
    private String generateHtml(QuizRequest request) {
        Context context = new Context();
        context.setVariable("title", request.getTitle());
        context.setVariable("audience", request.getAudience());
        context.setVariable("purpose", request.getPurpose());
        context.setVariable("questions", request.getQuestions());
        return templateEngine.process("quiz_template", context);
    }

    /**
     * 更新任务为失败状态
     *
     * @param taskId 任务 ID
     * @param errorMsg 错误信息
     */
    @Transactional
    public void updateTaskFailed(UUID taskId, String errorMsg) {
        taskRepository.findById(taskId).ifPresent(task -> {
            task.setStatus(QuizTask.TaskStatus.FAILED);
            task.setErrorMsg(errorMsg);
            task.setUpdatedAt(LocalDateTime.now());
            taskRepository.save(task);
        });
    }

    /**
     * 添加任务日志
     *
     * @param taskId 任务 ID
     * @param level 日志级别
     * @param message 日志消息
     */
    private void addLog(UUID taskId, String level, String message) {
        try {
            QuizTaskLog log = QuizTaskLog.builder()
                    .id(UUID.randomUUID())
                    .taskId(taskId)
                    .logLevel(level)
                    .message(message)
                    .createdAt(LocalDateTime.now())
                    .build();
            taskLogRepository.save(log);
        } catch (Exception e) {
            log.error("保存任务日志失败", e);
        }
    }
}
