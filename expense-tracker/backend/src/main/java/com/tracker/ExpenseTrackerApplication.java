package com.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class ExpenseTrackerApplication {
    private static final Logger logger = LoggerFactory.getLogger(ExpenseTrackerApplication.class);

    private final com.tracker.repository.UserRepository userRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public ExpenseTrackerApplication(com.tracker.repository.UserRepository userRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

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

    @EventListener(ApplicationReadyEvent.class)
    public void seedDemoUser() {
        String demoEmail = "sasi@gmail.com";
        if (!userRepository.existsByEmail(demoEmail)) {
            com.tracker.model.User user = new com.tracker.model.User();
            user.setName("sasi");
            user.setEmail(demoEmail);
            user.setPassword(passwordEncoder.encode("password123"));
            userRepository.save(user);
            logger.info("Demo user '{}' created with password 'password123'", demoEmail);
        }
    }
}
