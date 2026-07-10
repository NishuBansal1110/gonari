package com.shesafe.backend.controller;

import com.shesafe.backend.document.User;
import com.shesafe.backend.security.CustomUserDetails;
import com.shesafe.backend.service.VerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    private boolean isAdmin(CustomUserDetails userDetails) {
        return "ADMIN".equalsIgnoreCase(userDetails.getUser().getRole());
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingDrivers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (!isAdmin(userDetails)) {
            return ResponseEntity.status(403).body("Only administrators can view pending drivers.");
        }
        List<User> pending = verificationService.getPendingDrivers();
        return ResponseEntity.ok(pending);
    }

    @GetMapping("/drivers")
    public ResponseEntity<?> getAllDrivers(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (!isAdmin(userDetails)) {
            return ResponseEntity.status(403).body("Only administrators can view driver records.");
        }
        List<User> drivers = verificationService.getAllDrivers();
        return ResponseEntity.ok(drivers);
    }

    @PutMapping("/{userId}/approve")
    public ResponseEntity<?> approveDriver(@PathVariable String userId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (!isAdmin(userDetails)) {
            return ResponseEntity.status(403).body("Only administrators can approve drivers.");
        }
        try {
            User updated = verificationService.updateVerificationStatus(userId, "APPROVED");
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{userId}/reject")
    public ResponseEntity<?> rejectDriver(@PathVariable String userId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (!isAdmin(userDetails)) {
            return ResponseEntity.status(403).body("Only administrators can reject drivers.");
        }
        try {
            User updated = verificationService.updateVerificationStatus(userId, "REJECTED");
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
