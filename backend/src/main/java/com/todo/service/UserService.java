package com.todo.service;

import com.todo.dto.UserDto;
import com.todo.dto.UserProfileUpdateRequest;

public interface UserService {
    UserDto getProfile(Long userId);
    UserDto updateProfile(Long userId, UserProfileUpdateRequest request);
}
