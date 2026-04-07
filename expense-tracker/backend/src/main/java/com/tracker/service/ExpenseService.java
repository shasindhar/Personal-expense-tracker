package com.tracker.service;

import com.tracker.dto.ExpenseDto;
import com.tracker.model.Expense;
import com.tracker.model.User;
import com.tracker.repository.ExpenseRepository;
import com.tracker.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<ExpenseDto> getAllExpenses() {
        User user = getCurrentUser();
        List<Expense> expenses = expenseRepository.findByUserId(user.getId());
        
        return expenses.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ExpenseDto createExpense(ExpenseDto expenseDto) {
        User user = getCurrentUser();
        
        Expense expense = new Expense();
        expense.setUserId(user.getId());
        expense.setTitle(expenseDto.getTitle());
        expense.setAmount(expenseDto.getAmount());
        expense.setCategory(expenseDto.getCategory());
        expense.setType(expenseDto.getType());
        expense.setDate(expenseDto.getDate());
        expense.setNotes(expenseDto.getNotes());
                
        Expense savedExpense = expenseRepository.save(expense);
        return mapToDto(savedExpense);
    }

    public void deleteExpense(@org.springframework.lang.NonNull String id) {
        User user = getCurrentUser();
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
                
        if (!expense.getUserId().equals(user.getId())) {
            throw new IllegalArgumentException("You are not authorized to delete this expense");
        }
        
        expenseRepository.deleteById(id);
    }

    private ExpenseDto mapToDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setTitle(expense.getTitle());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setType(expense.getType());
        dto.setDate(expense.getDate());
        dto.setNotes(expense.getNotes());
        return dto;
    }
}
