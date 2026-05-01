package com.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class ExpenseTrackerApplication {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseTrackerApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ExpenseTrackerApplication.class, args);
    }

    @Bean
    public CommandLineRunner logDbConnection(@Value("${spring.data.mongodb.uri}") String mongoUri) {
        return args -> {
            String maskedUri = mongoUri.replaceAll("mongodb(\\+srv)?://[^@]+@", "mongodb$1://***:***@");
            logger.info("Connecting to MongoDB at: {}", maskedUri);
        };
    }

    @Bean
    public CommandLineRunner demoUserSeeder(com.tracker.repository.UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        return args -> {
            String demoEmail = "sasi@gmail.com";
            if (!userRepository.findByEmail(demoEmail).isPresent()) {
                com.tracker.model.User user = new com.tracker.model.User();
                user.setName("sasi");
                user.setEmail(demoEmail);
                user.setPassword(passwordEncoder.encode("password123"));
                userRepository.save(user);
                logger.info(">>> DEMO USER '{}' CREATED WITH PASSWORD 'password123' <<<", demoEmail);
            } else {
                logger.info(">>> DEMO USER '{}' ALREADY EXISTS <<<", demoEmail);
            }
        };
    }
}
