package com.github.atharvsurya.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedule_blocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "action_plan", columnDefinition = "TEXT", nullable = false)
    private String actionPlan; // Store proposed sub-tasks / actionable steps

    @Column(name = "is_locked")
    private Boolean isLocked = false;
}