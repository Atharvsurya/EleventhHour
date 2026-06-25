package com.github.atharvsurya.controller;

import com.github.atharvsurya.dto.ApiResponse;
import com.github.atharvsurya.model.Task;
import com.github.atharvsurya.model.User;
import com.github.atharvsurya.repository.TaskRepository;
import com.github.atharvsurya.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    // Helper: Extracts User ID from the secure JWT Principal
    private Long getUserIdFromToken(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }

    // 1. Get ONLY the tasks for the logged-in user
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getUserTasks(Principal principal) {
        try {
            Long userId = getUserIdFromToken(principal);
            List<Task> tasks = taskRepository.findByUserId(userId);
            return ResponseEntity.ok(ApiResponse.ok("Tasks fetched.", tasks));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Error: " + e.getMessage()));
        }
    }

    // 2. Add a new task (automatically assigned to the logged-in user)
    @PostMapping
    public ResponseEntity<ApiResponse<?>> addTask(@RequestBody Task task, Principal principal) {
        try {
            Long userId = getUserIdFromToken(principal);
            User user = userRepository.findById(userId).orElseThrow();

            task.setUser(user);
            if (task.getStatus() == null || task.getStatus().isEmpty()) {
                task.setStatus("PENDING");
            }

            Task savedTask = taskRepository.save(task);
            return ResponseEntity.ok(ApiResponse.ok("Task added.", savedTask));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Error: " + e.getMessage()));
        }
    }

    // 3. Update task (Strict ownership check!)
    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<?>> updateTask(@PathVariable Long taskId, @RequestBody Task updatedTaskDetails, Principal principal) {
        try {
            Long userId = getUserIdFromToken(principal);
            Task existingTask = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            // SECURITY CHECK: Ensure the task being updated actually belongs to the user
            if (!existingTask.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.fail("Unauthorized: You do not own this task"));
            }

            existingTask.setTitle(updatedTaskDetails.getTitle());
            existingTask.setDescription(updatedTaskDetails.getDescription());
            existingTask.setPriority(updatedTaskDetails.getPriority());
            existingTask.setDeadline(updatedTaskDetails.getDeadline());
            existingTask.setStatus(updatedTaskDetails.getStatus());

            return ResponseEntity.ok(ApiResponse.ok("Task Updated", taskRepository.save(existingTask)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Error: " + e.getMessage()));
        }
    }

    // 4. Delete task (Strict ownership check!)
    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<?>> deleteTask(@PathVariable Long taskId, Principal principal) {
        try {
            Long userId = getUserIdFromToken(principal);
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found"));

            // SECURITY CHECK: Ensure the task being deleted actually belongs to the user
            if (!task.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(ApiResponse.fail("Unauthorized: You do not own this task"));
            }

            taskRepository.delete(task);
            return ResponseEntity.ok(ApiResponse.ok("Task deleted successfully.", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Error: " + e.getMessage()));
        }
    }
}