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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/agent")
@CrossOrigin(origins = "*")
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

    @PostMapping("/propose-plan")
    public ResponseEntity<ApiResponse<?>> proposePlan(@RequestParam Long userId) throws Exception {
        Optional<User> optUser = userRepository.findById(userId);
        if(optUser.isEmpty())
            return ResponseEntity.ok(ApiResponse.fail("User not found."));
        User user = optUser.get();
        ApiResponse<List<ScheduleBlockDto>> res = agentService.generateProactiveSchedule(user);
        return res.isSuccess()
                ? ResponseEntity.ok(res)
                : ResponseEntity.status(404).body(res);
    }

    @PostMapping("/confirm-plan")
    public ResponseEntity<ApiResponse<String>> confirmPlan(@RequestParam Long userId, @RequestBody List<ScheduleBlockDto> confirmedDtos) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<ScheduleBlock> blocksToSave = new ArrayList<>();

            for (int i = 0; i < confirmedDtos.size(); i++) {
                ScheduleBlockDto dto = confirmedDtos.get(i);
                Task task = taskRepository.findById(dto.getTaskId())
                        .orElseThrow(() -> new RuntimeException("Task not found: " + dto.getTaskId()));

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

            // Return success response
            return ResponseEntity.ok(new ApiResponse<>(true, "Successfully locked " + blocksToSave.size() + " blocks.", null));

        } catch (Exception e) {
            // Return error response
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Error: " + e.getMessage(), null));
        }
    }
}