package com.todo.util;

import com.todo.entity.Task;
import com.todo.entity.User;
import com.todo.enums.Priority;
import com.todo.enums.Role;
import com.todo.enums.TaskStatus;
import com.todo.repository.TaskRepository;
import com.todo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class SampleDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    public SampleDataInitializer(UserRepository userRepository,
                                 TaskRepository taskRepository,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Initialize Admin User
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
        }

        // Initialize Regular User and Sample Tasks
        if (!userRepository.existsByEmail("user@example.com")) {
            User user = new User();
            user.setUsername("user");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("User@123"));
            user.setRole(Role.USER);
            user.setEnabled(true);
            User savedUser = userRepository.save(user);

            // Create sample tasks
            Task task1 = new Task();
            task1.setTitle("Complete Spring Boot Architecture");
            task1.setDescription("Define database schemas, DTOs, controllers, services, and security filters.");
            task1.setStatus(TaskStatus.COMPLETED);
            task1.setPriority(Priority.HIGH);
            task1.setDueDate(LocalDate.now().minusDays(2));
            task1.setUser(savedUser);
            taskRepository.save(task1);

            Task task2 = new Task();
            task2.setTitle("Setup Redux Toolkit State Management");
            task2.setDescription("Configure store, auth slices, task slices, theme switcher, and API Axios interceptors.");
            task2.setStatus(TaskStatus.IN_PROGRESS);
            task2.setPriority(Priority.HIGH);
            task2.setDueDate(LocalDate.now());
            task2.setUser(savedUser);
            taskRepository.save(task2);

            Task task3 = new Task();
            task3.setTitle("Design Modern UI Layout with Material UI");
            task3.setDescription("Build layouts with dark mode, sidebars, responsive grids, task cards, and interactive dashboards.");
            task3.setStatus(TaskStatus.IN_PROGRESS);
            task3.setPriority(Priority.MEDIUM);
            task3.setDueDate(LocalDate.now().plusDays(1));
            task3.setUser(savedUser);
            taskRepository.save(task3);

            Task task4 = new Task();
            task4.setTitle("Write Unit Tests for Security and Controllers");
            task4.setDescription("Add MockMvc testing for auth endpoints, task CRUD controllers, services, and mock security contexts.");
            task4.setStatus(TaskStatus.PENDING);
            task4.setPriority(Priority.MEDIUM);
            task4.setDueDate(LocalDate.now().plusDays(3));
            task4.setUser(savedUser);
            taskRepository.save(task4);

            Task task5 = new Task();
            task5.setTitle("Deploy Full-Stack Application using Docker Compose");
            task5.setDescription("Develop backend and frontend Dockerfiles, nginx configurations, and docker-compose deployment script.");
            task5.setStatus(TaskStatus.PENDING);
            task5.setPriority(Priority.LOW);
            task5.setDueDate(LocalDate.now().plusDays(5));
            task5.setUser(savedUser);
            taskRepository.save(task5);
        }
    }
}
