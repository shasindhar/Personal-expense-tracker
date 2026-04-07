package com.tracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "budget_limits")
public class BudgetLimit {

    @Id
    private String id;

    private String userId;

    private String category;

    private Double limitAmount;

    public BudgetLimit() {}

    public BudgetLimit(String id, String userId, String category, Double limitAmount) {
        this.id = id;
        this.userId = userId;
        this.category = category;
        this.limitAmount = limitAmount;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getLimitAmount() { return limitAmount; }
    public void setLimitAmount(Double limitAmount) { this.limitAmount = limitAmount; }
}
