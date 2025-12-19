package com.example.quiz.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

/**
 * 试卷生成请求模型
 *
 * @author HarryReid(黄药师)
 */
@Data
public class QuizRequest {
    @NotBlank(message = "试卷标题不能为空")
    private String title;

    @NotBlank(message = "受众不能为空")
    private String audience;

    @NotBlank(message = "考察目的不能为空")
    private String purpose;

    @NotEmpty(message = "题目列表不能为空")
    @Valid
    private List<QuizQuestion> questions;
}
