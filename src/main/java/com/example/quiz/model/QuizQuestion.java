package com.example.quiz.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * 试卷题目模型
 *
 * @author HarryReid(黄药师)
 */
@Data
public class QuizQuestion {
    @NotNull(message = "题目ID不能为空")
    private Integer id;

    @NotNull(message = "题目类型不能为空")
    private QuestionType type;

    @NotBlank(message = "题目内容不能为空")
    private String content;

    @NotEmpty(message = "选项列表不能为空")
    @Valid
    private List<QuizOption> options;

    private String explanation;

    private String reference;

    /**
     * 题目类型枚举
     */
    public enum QuestionType {
        SINGLE,  // 单选题
        MULTI,   // 多选题
        JUDGE    // 判断题
    }
}
