package com.shesafe.backend.controller;

import com.shesafe.backend.dto.LocationUpdateDto;
import com.shesafe.backend.security.CustomUserDetails;
import com.shesafe.backend.service.LocationTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    @Autowired
    private LocationTrackingService locationTrackingService;

    // HTTP Endpoint fallback
    @PostMapping("/update")
    public ResponseEntity<?> updateLocationRest(@RequestBody LocationUpdateDto updateDto, @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            String driverUserId = userDetails.getUser().getId();
            locationTrackingService.updateDriverLocation(driverUserId, updateDto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // WebSocket STOMP Endpoint
    // Messages sent to /app/location/update will be mapped here
    @MessageMapping("/location/update")
    public void updateLocationWebSocket(@Payload LocationUpdateDto updateDto) {
        if (updateDto.getDriverId() != null) {
            locationTrackingService.updateDriverLocation(updateDto.getDriverId(), updateDto);
        }
    }
}
