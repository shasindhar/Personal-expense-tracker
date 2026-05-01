package com.tracker.controller;

import com.tracker.repository.UserRepository;
import com.tracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public HealthController(UserRepository userRepository, ExpenseRepository expenseRepository, MongoTemplate mongoTemplate) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> status = new HashMap<>();
        try {
            status.put("database", "connected");
            status.put("userCount", userRepository.count());
            status.put("expenseCount", expenseRepository.count());
            status.put("dbName", mongoTemplate.getDb().getName());
        } catch (Exception e) {
            status.put("database", "disconnected");
            status.put("error", e.getMessage());
        }
        return ResponseEntity.ok(status);
    }
}
