package com.shesafe.backend.service;

import com.shesafe.backend.document.User;
import com.shesafe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VerificationService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getPendingDrivers() {
        return userRepository.findByVerificationStatus("PENDING");
    }

    public List<User> getAllDrivers() {
        return userRepository.findByRole("DRIVER");
    }

    public User updateVerificationStatus(String userId, String status) {
        if (!"APPROVED".equalsIgnoreCase(status) && !"REJECTED".equalsIgnoreCase(status) && !"PENDING".equalsIgnoreCase(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        user.setVerificationStatus(status.toUpperCase());
        return userRepository.save(user);
    }
}
