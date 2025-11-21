package com.quitecodedevelopers.elearning.service;

import com.quitecodedevelopers.elearning.model.User;
import com.quitecodedevelopers.elearning.model.dto.LoginRequest;
import com.quitecodedevelopers.elearning.model.dto.RegisterRequest;

import java.util.Map;

public interface AuthService {
    User register(RegisterRequest request);
    Map<String, Object> login(LoginRequest request);
}
