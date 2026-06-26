package com.github.atharvsurya.repository;

import com.github.atharvsurya.model.ScheduleBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleBlockRepository extends JpaRepository<ScheduleBlock, Long> {
    List<ScheduleBlock> findByUserId(Long userId);
}