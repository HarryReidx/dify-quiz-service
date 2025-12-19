package com.example.quiz.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories;

/**
 * JDBC 配置
 *
 * @author HarryReid(黄药师)
 */
@Configuration
@EnableJdbcRepositories(basePackages = "com.example.quiz.repository")
public class JdbcConfig {
}
