package com.github.atharvsurya.repository;

import com.github.atharvsurya.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    Optional<Task> findByUserIdAndStatus(Long userId, String status);

    List<Task> findByUserId(Long userId);
}