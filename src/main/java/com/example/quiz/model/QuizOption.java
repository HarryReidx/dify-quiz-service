package com.example.quiz.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 试卷选项模型
 *
 * @author HarryReid(黄药师)
 */
@Data
public class QuizOption {
    @NotBlank(message = "选项标签不能为空")
    private String label;

    @NotBlank(message = "选项内容不能为空")
    private String content;

    @NotNull(message = "必须指定选项是否正确")
    @JsonProperty("isCorrect")
    private Boolean isCorrect;
}
