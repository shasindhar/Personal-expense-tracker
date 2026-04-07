package com.tracker.controller;

import com.tracker.dto.BudgetLimitDto;
import com.tracker.service.BudgetLimitService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetLimitService budgetLimitService;

    @Autowired
    public BudgetController(BudgetLimitService budgetLimitService) {
        this.budgetLimitService = budgetLimitService;
    }

    /** GET /api/budgets — list all budget limits for the authenticated user */
    @GetMapping
    public ResponseEntity<List<BudgetLimitDto>> getAllBudgets() {
        return ResponseEntity.ok(budgetLimitService.getAllBudgets());
    }

    /** PUT /api/budgets/{category} — create or update a budget limit */
    @PutMapping("/{category}")
    public ResponseEntity<BudgetLimitDto> upsertBudget(
            @PathVariable String category,
            @Valid @RequestBody BudgetLimitDto dto) {
        return ResponseEntity.ok(budgetLimitService.upsertBudget(category, dto.getLimitAmount()));
    }

    /** DELETE /api/budgets/{category} — remove a budget limit */
    @DeleteMapping("/{category}")
    public ResponseEntity<Void> deleteBudget(@PathVariable String category) {
        budgetLimitService.deleteBudget(category);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/budgets/spending — current-month spending per category */
    @GetMapping("/spending")
    public ResponseEntity<Map<String, Double>> getCategorySpending() {
        return ResponseEntity.ok(budgetLimitService.getCategorySpending());
    }
}
