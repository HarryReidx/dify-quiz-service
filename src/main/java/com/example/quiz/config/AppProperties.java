package com.example.quiz.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 应用配置属性
 * 映射 application.yml 中的 app.* 配置
 *
 * @author HarryReid(黄药师)
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    /** MinIO 存储配置 */
    private MinioConfig minio = new MinioConfig();

    /** 试卷评分配置 */
    private QuizConfig quiz = new QuizConfig();

    /**
     * MinIO 存储配置
     */
    @Data
    public static class MinioConfig {
        private String endpoint;
        private String accessKey;
        private String secretKey;
        private String bucketName;
        private String region;
        private String uploadPath = "quiz-files/";
        private String publicUrlPrefix;
    }

    /**
     * 试卷评分配置
     */
    @Data
    public static class QuizConfig {
        private int defaultPassScore = 60;
        private int defaultExcellentScore = 80;
    }
}
