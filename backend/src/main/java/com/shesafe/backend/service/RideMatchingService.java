package com.shesafe.backend.service;

import com.shesafe.backend.document.Driver;
import com.shesafe.backend.document.User;
import com.shesafe.backend.repository.DriverRepository;
import com.shesafe.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RideMatchingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    public List<Driver> findNearbyDrivers(double lat, double lng, double radiusInKm) {
        // 1. Get all active, approved female drivers from User collection
        List<User> approvedFemaleDrivers = userRepository.findByRole("DRIVER").stream()
                .filter(user -> "APPROVED".equalsIgnoreCase(user.getVerificationStatus()) && "FEMALE".equalsIgnoreCase(user.getGender()))
                .collect(Collectors.toList());

        List<String> approvedUserIds = approvedFemaleDrivers.stream()
                .map(User::getId)
                .collect(Collectors.toList());

        if (approvedUserIds.isEmpty()) {
            return List.of();
        }

        // 2. Query Driver collection using geospatial index
        // In MongoDB, coordinates are stored as [longitude, latitude]
        Point pickupPoint = new Point(lng, lat);
        Distance searchDistance = new Distance(radiusInKm, Metrics.KILOMETERS);

        return driverRepository.findByIsAvailableTrueAndUserIdInAndCurrentLocationNear(
                approvedUserIds,
                pickupPoint,
                searchDistance
        );
    }
}
