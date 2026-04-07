package com.tracker.repository;

import com.tracker.model.BudgetLimit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetLimitRepository extends MongoRepository<BudgetLimit, String> {
    List<BudgetLimit> findByUserId(String userId);
    Optional<BudgetLimit> findByUserIdAndCategory(String userId, String category);
}
