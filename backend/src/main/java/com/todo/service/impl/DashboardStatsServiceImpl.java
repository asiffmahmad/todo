package com.todo.service.impl;

import com.todo.dto.DashboardStatsDto;
import com.todo.dto.TaskDto;
import com.todo.enums.TaskStatus;
import com.todo.mapper.TaskMapper;
import com.todo.repository.TaskRepository;
import com.todo.service.DashboardStatsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardStatsServiceImpl implements DashboardStatsService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public DashboardStatsServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsDto getStats(Long userId) {
        long totalTasks = taskRepository.countByUserId(userId);
        long completedTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.COMPLETED);
        long pendingTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.PENDING);
        long inProgressTasks = taskRepository.countByUserIdAndStatus(userId, TaskStatus.IN_PROGRESS);

        double completionPercentage = 0.0;
        if (totalTasks > 0) {
            completionPercentage = ((double) completedTasks / totalTasks) * 100.0;
        }

        List<TaskDto> recentTasks = taskRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(taskMapper::toDto)
                .collect(Collectors.toList());

        return new DashboardStatsDto(
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
                completionPercentage,
                recentTasks
        );
    }
}
