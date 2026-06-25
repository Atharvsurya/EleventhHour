package com.github.atharvsurya.controller;

import com.github.atharvsurya.dto.ApiResponse;
import com.github.atharvsurya.dto.ScheduleBlockDto;
import com.github.atharvsurya.model.ScheduleBlock;
import com.github.atharvsurya.model.Task;
import com.github.atharvsurya.model.User;
import com.github.atharvsurya.repository.ScheduleBlockRepository;
import com.github.atharvsurya.repository.TaskRepository;
import com.github.atharvsurya.repository.UserRepository;
import com.github.atharvsurya.service.GeminiAgentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/agent")
public class AgentController {

    private final GeminiAgentService agentService;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final ScheduleBlockRepository scheduleBlockRepository;

    public AgentController(GeminiAgentService agentService,
                           UserRepository userRepository,
                           TaskRepository taskRepository,
                           ScheduleBlockRepository scheduleBlockRepository) {
        this.agentService = agentService;
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.scheduleBlockRepository = scheduleBlockRepository;
    }

    private Long getUserIdFromToken(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // 1. Propose Plan: Securely fetched for the current user
    @PostMapping("/propose-plan")
    public ResponseEntity<ApiResponse<?>> proposePlan(Principal principal) throws Exception {
        Long userId = getUserIdFromToken(principal);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ApiResponse<List<ScheduleBlockDto>> res = agentService.generateProactiveSchedule(user);

        return res.isSuccess()
                ? ResponseEntity.ok(res)
                : ResponseEntity.status(404).body(res);
    }

    // 2. Confirm Plan: Securely saved for the current user
    @PostMapping("/confirm-plan")
    public ResponseEntity<ApiResponse<String>> confirmPlan(@RequestBody List<ScheduleBlockDto> confirmedDtos, Principal principal) {
        try {
            Long userId = getUserIdFromToken(principal);
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<ScheduleBlock> blocksToSave = new ArrayList<>();

            for (ScheduleBlockDto dto : confirmedDtos) {
                // SECURITY CHECK: Verify the task being scheduled belongs to this user
                Task task = taskRepository.findById(dto.getTaskId())
                        .orElseThrow(() -> new RuntimeException("Task not found: " + dto.getTaskId()));

                if (!task.getUser().getId().equals(userId)) {
                    throw new RuntimeException("Unauthorized: Task does not belong to you.");
                }

                ScheduleBlock block = new ScheduleBlock();
                block.setUser(user);
                block.setTask(task);
                block.setStartTime(dto.getStartTime());
                block.setEndTime(dto.getEndTime());
                block.setActionPlan(dto.getActionPlan());
                block.setIsLocked(true);

                blocksToSave.add(block);
            }

            scheduleBlockRepository.saveAll(blocksToSave);
            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully locked " + blocksToSave.size() + " blocks.", null));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }
}