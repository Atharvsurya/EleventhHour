package com.github.atharvsurya.controller;

import com.github.atharvsurya.dto.ApiResponse;
import com.github.atharvsurya.model.User;
import com.github.atharvsurya.repository.UserRepository;
import com.github.atharvsurya.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- DTOs for the requests (You can move these to your dto package!) ---
    public static class AuthRequest {
        public String username;
        public String password;
    }

    // 1. REGISTER ENDPOINT
    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody User newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ApiResponse.fail("Username is already taken!");
        }

        // NEVER save a plain text password. Hash it first!
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));

        // Default role if none provided
        if (newUser.getRole() == null) newUser.setRole("USER");

        User savedUser = userRepository.save(newUser);
        savedUser.setPassword(null); // Don't send the hash back to the frontend

        return ApiResponse.ok("User registered successfully", savedUser);
    }

    // 2. LOGIN ENDPOINT
    @PostMapping("/login")
    public ApiResponse<Map<String, String>> login(@RequestBody AuthRequest request) {
        try {
            // This triggers Spring Security to check the password against the database
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username, request.password)
            );
        } catch (Exception e) {
            return ApiResponse.fail("Invalid username or password");
        }

        // If we get here, the password was correct!
        // Let's find the user ID to embed in the token.
        Optional<User> user = userRepository.findByUsername(request.username);

        if (user.isPresent()) {
            String token = jwtUtil.generateToken(user.get().getUsername(), user.get().getId());

            // Return the token to the React frontend
            Map<String, String> data = new HashMap<>();
            data.put("token", token);
            data.put("username", user.get().getUsername());

            return ApiResponse.ok("Login successful", data);
        }

        return ApiResponse.fail("User not found");
    }
}