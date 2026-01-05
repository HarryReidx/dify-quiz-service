package com.example.quiz.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 试卷生成响应模型
 *
 * @author HarryReid(黄药师)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {
    private String taskId;
    private String status;
    private String url;
    private String message;
}
