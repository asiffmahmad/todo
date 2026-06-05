package com.todo.dto;

import java.util.List;

public record DashboardStatsDto(
    long totalTasks,
    long completedTasks,
    long pendingTasks,
    long inProgressTasks,
    double completionPercentage,
    List<TaskDto> recentTasks
) {}
