package com.todo.service;

import com.todo.dto.DashboardStatsDto;

public interface DashboardStatsService {
    DashboardStatsDto getStats(Long userId);
}
