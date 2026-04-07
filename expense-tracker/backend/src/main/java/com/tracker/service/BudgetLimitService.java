package com.tracker.service;

import com.tracker.dto.BudgetLimitDto;
import com.tracker.model.BudgetLimit;
import com.tracker.model.Expense;
import com.tracker.model.User;
import com.tracker.repository.BudgetLimitRepository;
import com.tracker.repository.ExpenseRepository;
import com.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BudgetLimitService {

    private final BudgetLimitRepository budgetLimitRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Autowired
    public BudgetLimitService(BudgetLimitRepository budgetLimitRepository,
                               ExpenseRepository expenseRepository,
                               UserRepository userRepository) {
        this.budgetLimitRepository = budgetLimitRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    /** Return all budget limits for the current user. */
    public List<BudgetLimitDto> getAllBudgets() {
        User user = getCurrentUser();
        return budgetLimitRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /** Create or update a budget limit for a category. */
    public BudgetLimitDto upsertBudget(String category, Double limitAmount) {
        User user = getCurrentUser();
        Optional<BudgetLimit> existing = budgetLimitRepository
                .findByUserIdAndCategory(user.getId(), category);

        BudgetLimit budget = existing.orElse(new BudgetLimit());
        budget.setUserId(user.getId());
        budget.setCategory(category);
        budget.setLimitAmount(limitAmount);

        return mapToDto(budgetLimitRepository.save(budget));
    }

    /** Delete a budget limit for a category. */
    public void deleteBudget(String category) {
        User user = getCurrentUser();
        budgetLimitRepository.findByUserIdAndCategory(user.getId(), category)
                .ifPresent(budgetLimitRepository::delete);
    }

    /**
     * Return a map of { category -> totalSpent } for the current calendar month,
     * considering only entries of type "expense".
     */
    public Map<String, Double> getCategorySpending() {
        User user = getCurrentUser();
        List<Expense> expenses = expenseRepository.findByUserId(user.getId());

        LocalDate now = LocalDate.now();
        int currentMonth = now.getMonthValue();
        int currentYear = now.getYear();

        Map<String, Double> spending = new HashMap<>();
        for (Expense exp : expenses) {
            if (!"expense".equalsIgnoreCase(exp.getType())) continue;
            if (exp.getDate() == null || exp.getAmount() == null) continue;
            if (exp.getDate().getMonthValue() != currentMonth
                    || exp.getDate().getYear() != currentYear) continue;
            spending.merge(exp.getCategory(), exp.getAmount(), (a, b) -> a + b);
        }
        return spending;
    }

    private BudgetLimitDto mapToDto(BudgetLimit budget) {
        return new BudgetLimitDto(budget.getId(), budget.getCategory(), budget.getLimitAmount());
    }
}
