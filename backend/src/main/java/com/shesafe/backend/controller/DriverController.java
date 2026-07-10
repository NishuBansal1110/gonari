package com.shesafe.backend.controller;

import com.shesafe.backend.document.Driver;
import com.shesafe.backend.document.User;
import com.shesafe.backend.dto.LocationUpdateDto;
import com.shesafe.backend.repository.DriverRepository;
import com.shesafe.backend.repository.UserRepository;
import com.shesafe.backend.security.CustomUserDetails;
import com.shesafe.backend.service.RideMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideMatchingService rideMatchingService;

    @GetMapping("/status")
    public ResponseEntity<?> getStatus(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUser().getId();
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        return ResponseEntity.ok(driver);
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateStatus(@RequestParam boolean available, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUser().getId();
        
        // Enforce admin verification check!
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"APPROVED".equalsIgnoreCase(user.getVerificationStatus())) {
            return ResponseEntity.badRequest().body("Your account is not approved by admin. You cannot go online.");
        }

        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        
        driver.setAvailable(available);
        driver.setUpdatedAt(LocalDateTime.now());
        Driver savedDriver = driverRepository.save(driver);
        return ResponseEntity.ok(savedDriver);
    }

    @GetMapping("/nearby")
    public ResponseEntity<?> getNearbyDrivers(@RequestParam double lat, @RequestParam double lng, @RequestParam(defaultValue = "10.0") double radius) {
        List<Driver> nearby = rideMatchingService.findNearbyDrivers(lat, lng, radius);
        return ResponseEntity.ok(nearby);
    }
}
