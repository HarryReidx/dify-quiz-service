package com.example.quiz.config;

import io.minio.MinioClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MinIO 客户端配置
 *
 * @author HarryReid(黄药师)
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class MinioClientConfig {
    private final AppProperties appProperties;

    @Bean
    public MinioClient minioClient() {
        log.info("初始化 MinIO 客户端: endpoint={}, bucket={}",
                appProperties.getMinio().getEndpoint(),
                appProperties.getMinio().getBucketName());

        return MinioClient.builder()
                .endpoint(appProperties.getMinio().getEndpoint())
                .credentials(
                        appProperties.getMinio().getAccessKey(),
                        appProperties.getMinio().getSecretKey()
                )
                .build();
    }
}
