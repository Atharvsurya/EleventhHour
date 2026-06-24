package com.github.atharvsurya.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.atharvsurya.dto.ApiResponse;
import com.github.atharvsurya.dto.ScheduleBlockDto;
import com.github.atharvsurya.model.Task;
import com.github.atharvsurya.model.User;
import com.github.atharvsurya.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class GeminiAgentService {

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    private final TaskRepository taskRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiAgentService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public ApiResponse<List<ScheduleBlockDto>> generateProactiveSchedule(User user) throws Exception {
        Optional<Task> pendingTasksopt = taskRepository.findByUserIdAndStatus(user.getId(), "PENDING");

        if (pendingTasksopt.isEmpty()) {
            return ApiResponse.fail("No tasks found.");
        }
        List<Task> pendingTasks = Collections.singletonList(pendingTasksopt.get());
        StringBuilder taskContext = new StringBuilder();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        // Traditional for loop to build context
        for (int i = 0; i < pendingTasks.size(); i++) {
            Task task = pendingTasks.get(i);
            taskContext.append(String.format("[%d] ID: %d, Title: '%s', Deadline: %s, Current Priority: %d\n",
                    i, task.getId(), task.getTitle(), task.getDeadline().format(formatter), task.getPriority()));
        }

        // Construct the system instructions and task context for the Gemini Agent
        String basePrompt = "You are 'The Last-Minute Life Saver' AI productivity companion. " +
                "Analyze the following pending tasks and generate an optimal, proactive execution schedule. " +
                "Do not just remind the user; break tasks down into actionable schedule blocks with start and end times. " +
                "Return the response STRICTLY as a JSON array named 'scheduleBlocks' where each element contains: " +
                "'taskId' (long), 'startTime' (ISO_LOCAL_DATE_TIME string), 'endTime' (ISO_LOCAL_DATE_TIME string), " +
                "'actionPlan' (string detailing sub-tasks), and 'priorityRank' (int 1-5, 1 being highest critical priority). " +
                "Here are the user's current tasks:\n";

        // ... (Task Context and Prompt logic remains exactly the same) ...
        String completePrompt = basePrompt + taskContext.toString();

        // 1. Construct the JSON request payload
        com.fasterxml.jackson.databind.node.ObjectNode rootRequestNode = objectMapper.createObjectNode();

        // --- THE FIX: Tell Gemini to natively output clean JSON ---
        com.fasterxml.jackson.databind.node.ObjectNode generationConfigNode = rootRequestNode.putObject("generationConfig");
        generationConfigNode.put("responseMimeType", "application/json");
        // ---------------------------------------------------------

        com.fasterxml.jackson.databind.node.ArrayNode contentsArray = rootRequestNode.putArray("contents");
        com.fasterxml.jackson.databind.node.ObjectNode contentNode = contentsArray.addObject();
        com.fasterxml.jackson.databind.node.ArrayNode partsArray = contentNode.putArray("parts");
        com.fasterxml.jackson.databind.node.ObjectNode partNode = partsArray.addObject();
        partNode.put("text", completePrompt);

        // 2. Execute the POST call
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> entity = new HttpEntity<>(rootRequestNode.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL + apiKey, entity, String.class);

        // 3. Parse the clean JSON directly (No string manipulation needed!)
        JsonNode root = objectMapper.readTree(response.getBody());
        String rawJsonText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        // You can now delete all the `if (rawJsonText.contains("```json"))` code completely!

        JsonNode scheduleBlocksJson = objectMapper.readTree(rawJsonText.trim());
        // ... (Rest of your array mapping logic remains the same) ...
        JsonNode arrayNode = scheduleBlocksJson.isArray() ? scheduleBlocksJson : scheduleBlocksJson.path("scheduleBlocks");

        List<ScheduleBlockDto> proposedDtos = new ArrayList<>();

        // Traditional for loop to parse JSON and map to DTOs
        for (int i = 0; i < arrayNode.size(); i++) {
            JsonNode blockNode = arrayNode.get(i);
            Long taskId = blockNode.get("taskId").asLong();
            String startTimeStr = blockNode.get("startTime").asText();
            String endTimeStr = blockNode.get("endTime").asText();
            String actionPlan = blockNode.get("actionPlan").asText();
            int priorityRank = blockNode.get("priorityRank").asInt();

            Task associatedTask = null;
            for (int j = 0; j < pendingTasks.size(); j++) {
                if (pendingTasks.get(j).getId().equals(taskId)) {
                    associatedTask = pendingTasks.get(j);
                    associatedTask.setPriority(priorityRank); // Update priority
                    taskRepository.save(associatedTask); // Persist priority change
                    break;
                }
            }

            if (associatedTask != null) {
                ScheduleBlockDto dto = new ScheduleBlockDto();
                dto.setTaskId(associatedTask.getId());
                dto.setTaskTitle(associatedTask.getTitle());
                dto.setStartTime(LocalDateTime.parse(startTimeStr, DateTimeFormatter.ISO_DATE_TIME));
                dto.setEndTime(LocalDateTime.parse(endTimeStr, DateTimeFormatter.ISO_DATE_TIME));
                dto.setActionPlan(actionPlan);
                dto.setPriority(priorityRank);
                proposedDtos.add(dto);
            }
        }

        return ApiResponse.ok("Schedule generated.", proposedDtos);
    }
}