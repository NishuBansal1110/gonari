package com.shesafe.backend.service;

import com.shesafe.backend.document.Driver;
import com.shesafe.backend.document.LocationPing;
import com.shesafe.backend.dto.LocationUpdateDto;
import com.shesafe.backend.repository.DriverRepository;
import com.shesafe.backend.repository.LocationPingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LocationTrackingService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private LocationPingRepository locationPingRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void updateDriverLocation(String driverUserId, LocationUpdateDto updateDto) {
        Driver driver = driverRepository.findByUserId(driverUserId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found for user: " + driverUserId));

        GeoJsonPoint newPoint = new GeoJsonPoint(updateDto.getLng(), updateDto.getLat());
        driver.setCurrentLocation(newPoint);
        driver.setUpdatedAt(LocalDateTime.now());
        driverRepository.save(driver);

        if (updateDto.getRideId() != null && !updateDto.getRideId().isEmpty()) {
            LocationPing ping = LocationPing.builder()
                    .rideId(updateDto.getRideId())
                    .userId(driverUserId)
                    .location(newPoint)
                    .timestamp(LocalDateTime.now())
                    .build();
            locationPingRepository.save(ping);

            updateDto.setDriverId(driverUserId);
            messagingTemplate.convertAndSend("/topic/ride/" + updateDto.getRideId() + "/location", updateDto);
        }
    }
}
