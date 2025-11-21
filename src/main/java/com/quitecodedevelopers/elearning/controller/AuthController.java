package com.quitecodedevelopers.elearning.controller;

import com.quitecodedevelopers.elearning.model.User;
import com.quitecodedevelopers.elearning.model.dto.LoginRequest;
import com.quitecodedevelopers.elearning.model.dto.RegisterRequest;
import com.quitecodedevelopers.elearning.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request){
        User saved = authService.register(request);
        saved.setPassword(null);
        return ResponseEntity.ok(saved);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request){
        return ResponseEntity.ok(authService.login(request));
    }
}
