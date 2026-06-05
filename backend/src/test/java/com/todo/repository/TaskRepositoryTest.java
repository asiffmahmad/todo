package com.todo.repository;

import com.todo.entity.Task;
import com.todo.entity.User;
import com.todo.enums.Priority;
import com.todo.enums.Role;
import com.todo.enums.TaskStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    public void setUp() {
        taskRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password");
        testUser.setRole(Role.USER);
        testUser = userRepository.save(testUser);

        Task task1 = new Task();
        task1.setTitle("Task One");
        task1.setDescription("Description One");
        task1.setStatus(TaskStatus.PENDING);
        task1.setPriority(Priority.HIGH);
        task1.setDueDate(LocalDate.now().plusDays(1));
        task1.setUser(testUser);
        taskRepository.save(task1);

        Task task2 = new Task();
        task2.setTitle("Task Two");
        task2.setDescription("Description Two");
        task2.setStatus(TaskStatus.COMPLETED);
        task2.setPriority(Priority.LOW);
        task2.setDueDate(LocalDate.now().plusDays(2));
        task2.setUser(testUser);
        taskRepository.save(task2);
    }

    @Test
    public void testCountByUserId() {
        Long count = taskRepository.countByUserId(testUser.getId());
        assertEquals(2, count);
    }

    @Test
    public void testCountByUserIdAndStatus() {
        Long pendingCount = taskRepository.countByUserIdAndStatus(testUser.getId(), TaskStatus.PENDING);
        Long completedCount = taskRepository.countByUserIdAndStatus(testUser.getId(), TaskStatus.COMPLETED);

        assertEquals(1, pendingCount);
        assertEquals(1, completedCount);
    }

    @Test
    public void testFindByUserIdAndFilters_StatusFilter() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Task> result = taskRepository.findByUserIdAndFilters(
                testUser.getId(),
                TaskStatus.COMPLETED,
                null,
                null,
                null,
                pageable
        );

        assertEquals(1, result.getTotalElements());
        assertEquals("Task Two", result.getContent().get(0).getTitle());
    }

    @Test
    public void testFindByUserIdAndFilters_SearchFilter() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Task> result = taskRepository.findByUserIdAndFilters(
                testUser.getId(),
                null,
                null,
                null,
                "One",
                pageable
        );

        assertEquals(1, result.getTotalElements());
        assertEquals("Task One", result.getContent().get(0).getTitle());
    }
}
