package com.example.quiz.service;

import com.example.quiz.config.AppProperties;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

/**
 * MinIO 存储服务
 *
 * @author HarryReid(黄药师)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {
    private final MinioClient minioClient;
    private final AppProperties appProperties;

    /**
     * 上传 HTML 文件到 MinIO
     *
     * @param filename HTML 文件名
     * @param htmlContent HTML 内容
     * @return 公开访问 URL
     */
    public String uploadHtml(String filename, String htmlContent) {
        try {
            String bucketName = appProperties.getMinio().getBucketName();
            String uploadPath = appProperties.getMinio().getUploadPath();
            String objectName = uploadPath + filename;

            // 确保 bucket 存在
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
                log.info("创建 MinIO bucket: {}", bucketName);
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }

            // 上传文件
            byte[] bytes = htmlContent.getBytes(StandardCharsets.UTF_8);
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectName)
                            .stream(new ByteArrayInputStream(bytes), bytes.length, -1)
                            .contentType("text/html; charset=utf-8")
                            .build()
            );

            // 构建公开访问 URL
            String publicUrl = String.format("%s/%s", 
                    appProperties.getMinio().getPublicUrlPrefix(), 
                    objectName);

            log.info("HTML 文件上传成功: {}", publicUrl);
            return publicUrl;
        } catch (Exception e) {
            log.error("上传 HTML 到 MinIO 失败: {}", filename, e);
            throw new RuntimeException("MinIO 上传失败: " + e.getMessage(), e);
        }
    }
}
