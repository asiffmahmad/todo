package com.todo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Fallback controller to serve the React SPA index.html for any unmapped route.
 */
@Controller
@RequestMapping("/")
public class HomeController {
    @GetMapping("{path:[^.]*}")
    public String forward() {
        // Forward to index.html located in classpath:/static/
        return "forward:/index.html";
    }
}
