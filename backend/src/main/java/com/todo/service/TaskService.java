package com.todo.service;

import com.todo.dto.TaskCreateRequest;
import com.todo.dto.TaskDto;
import com.todo.enums.Priority;
import com.todo.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface TaskService {
    Page<TaskDto> getTasks(Long userId, TaskStatus status, Priority priority, LocalDate dueDate, String search, Pageable pageable);
    TaskDto getTaskById(Long userId, Long taskId);
    TaskDto createTask(Long userId, TaskCreateRequest request);
    TaskDto updateTask(Long userId, Long taskId, TaskCreateRequest request);
    void deleteTask(Long userId, Long taskId);
    TaskDto updateTaskStatus(Long userId, Long taskId, TaskStatus status);
}
