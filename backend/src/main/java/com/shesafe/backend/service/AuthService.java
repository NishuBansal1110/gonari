package com.shesafe.backend.service;

import com.shesafe.backend.document.Driver;
import com.shesafe.backend.document.User;
import com.shesafe.backend.dto.AuthResponse;
import com.shesafe.backend.dto.LoginRequest;
import com.shesafe.backend.dto.SignUpRequest;
import com.shesafe.backend.repository.DriverRepository;
import com.shesafe.backend.repository.UserRepository;
import com.shesafe.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse signup(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Enforce female-only sign-up for this safety platform
        if (!"FEMALE".equalsIgnoreCase(request.getGender()) && !"ADMIN".equalsIgnoreCase(request.getRole())) {
            throw new IllegalArgumentException("Gonari is a women and girls only platform.");
        }

        String initialStatus = "APPROVED";
        if ("DRIVER".equalsIgnoreCase(request.getRole())) {
            initialStatus = "PENDING"; // Drivers start as PENDING and require admin approval
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole().toUpperCase())
                .gender(request.getGender().toUpperCase())
                .verificationStatus(initialStatus)
                .govtIdDocUrl(request.getGovtIdDocUrl()) // Base64 document content
                .selfieUrl(request.getSelfieUrl()) // Base64 selfie content
                .createdAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // If user is a driver, initialize the driver document
       // If user is a driver, initialize the driver document
if ("DRIVER".equalsIgnoreCase(savedUser.getRole())) {

    System.out.println("===== DRIVER DOCUMENT CREATING =====");

    Driver driver = Driver.builder()
            .userId(savedUser.getId())
            .vehicleType(request.getVehicleType())
            .vehicleNumber(request.getVehicleNumber())
            .rating(5.0)
            .isAvailable(false)
            .currentLocation(new GeoJsonPoint(0.0, 0.0))
            .updatedAt(LocalDateTime.now())
            .build();

    driverRepository.save(driver);

    System.out.println("===== DRIVER SAVED SUCCESSFULLY =====");
}

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole(), savedUser.getId(), savedUser.getName());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .gender(savedUser.getGender())
                .verificationStatus(savedUser.getVerificationStatus())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + request.getEmail()));

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId(), user.getName());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .gender(user.getGender())
                .verificationStatus(user.getVerificationStatus())
                .build();
    }
}
