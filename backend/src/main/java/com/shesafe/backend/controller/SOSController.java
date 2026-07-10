package com.shesafe.backend.controller;

import com.shesafe.backend.document.EmergencyContact;
import com.shesafe.backend.document.SOSAlert;
import com.shesafe.backend.dto.SOSRequestDto;
import com.shesafe.backend.repository.EmergencyContactRepository;
import com.shesafe.backend.repository.SOSAlertRepository;
import com.shesafe.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sos")
public class SOSController {

    @Autowired
    private SOSAlertRepository sosAlertRepository;

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/trigger")
    public ResponseEntity<?> triggerSOS(@RequestBody SOSRequestDto requestDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUser().getId();
        String userName = userDetails.getUser().getName();

        SOSAlert alert = SOSAlert.builder()
                .rideId(requestDto.getRideId())
                .userId(userId)
                .location(new GeoJsonPoint(requestDto.getLng(), requestDto.getLat()))
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build();

        SOSAlert savedAlert = sosAlertRepository.save(alert);

        // Fetch user's emergency contacts
        List<EmergencyContact> contacts = emergencyContactRepository.findByUserId(userId);

        // Simulate sending SMS / notifications
        System.out.println("====== EMERGENCY SOS TRIGGERED BY " + userName + " ======");
        System.out.println("Current location: [" + requestDto.getLat() + ", " + requestDto.getLng() + "]");
        System.out.println("Notifying emergency contacts:");
        for (EmergencyContact contact : contacts) {
            System.out.println("- Sent alert to " + contact.getName() + " (" + contact.getPhone() + ", Relation: " + contact.getRelation() + ")");
        }
        System.out.println("==============================================");

        // Broadcast to WebSocket clients (e.g. admins or family tracking)
        messagingTemplate.convertAndSend("/topic/sos", savedAlert);

        return ResponseEntity.ok(savedAlert);
    }

    // Emergency Contacts Management APIs
    @GetMapping("/contacts")
    public ResponseEntity<?> getContacts(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUser().getId();
        List<EmergencyContact> contacts = emergencyContactRepository.findByUserId(userId);
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("/contacts")
    public ResponseEntity<?> addContact(@RequestBody EmergencyContact contact, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUser().getId();
        contact.setUserId(userId);
        EmergencyContact saved = emergencyContactRepository.save(contact);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<?> deleteContact(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUser().getId();
        
        EmergencyContact contact = emergencyContactRepository.findById(id).orElse(null);
        if (contact == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!contact.getUserId().equals(userId)) {
            return ResponseEntity.badRequest().body("Unauthorized access to delete contact.");
        }
        
        emergencyContactRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
