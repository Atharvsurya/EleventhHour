package com.github.atharvsurya.controller;

import com.github.atharvsurya.dto.ApiResponse;
import com.github.atharvsurya.model.Task;
import com.github.atharvsurya.model.User;
import com.github.atharvsurya.repository.TaskRepository;
import com.github.atharvsurya.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    // 1. Get all tasks for a specific user
    @GetMapping
    public ResponseEntity<ApiResponse<?>> getUserTasks(@RequestParam Long userId) {
        try {
            List<Task> tasks = taskRepository.findByUserId(userId);
            return ResponseEntity.ok(ApiResponse.ok("Tasks fetched.", tasks));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Error fetching tasks: " + e.getMessage()));
        }
    }

    // 2. Add a new task
    @PostMapping
    public ResponseEntity<ApiResponse<?>> addTask(@RequestParam Long userId, @RequestBody Task task) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            task.setUser(user);

            // Auto-assign PENDING status if the frontend doesn't provide one
            if (task.getStatus() == null || task.getStatus().isEmpty()) {
                task.setStatus("PENDING");
            }

            Task savedTask = taskRepository.save(task);
            return ResponseEntity.ok(ApiResponse.ok("Task added.", savedTask));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Error adding task: " + e.getMessage()));
        }
    }

    // 3. Update an existing task
    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<?>> updateTask(@PathVariable Long taskId, @RequestBody Task updatedTaskDetails) {
        try {
            Task existingTask = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

            // Map updated fields over to the existing database record
            existingTask.setTitle(updatedTaskDetails.getTitle());
            existingTask.setDescription(updatedTaskDetails.getDescription());
            existingTask.setPriority(updatedTaskDetails.getPriority());
            existingTask.setDeadline(updatedTaskDetails.getDeadline());
            existingTask.setStatus(updatedTaskDetails.getStatus());

            Task savedTask = taskRepository.save(existingTask);
            return ResponseEntity.ok(ApiResponse.ok("Task Updated", savedTask));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("\"Error updating task: \" + e.getMessage()"));
        }
    }

    // 4. Delete a task
    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<?>> deleteTask(@PathVariable Long taskId) {
        try {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new RuntimeException("Task not found with ID: " + taskId));

            taskRepository.delete(task);
            return ResponseEntity.ok(ApiResponse.ok("Task deleted successfully.", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("Error deleting task: " + e.getMessage()));
        }
    }
}