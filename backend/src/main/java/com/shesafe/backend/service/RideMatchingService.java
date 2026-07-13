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

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RideMatchingService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Driver> findNearbyDrivers(double lat, double lng, double radiusKm) {

        Point pickupPoint = new Point(lng, lat);

        Distance distance = new Distance(radiusKm, Metrics.KILOMETERS);

        List<Driver> drivers =
                driverRepository.findByIsAvailableTrueAndUserIdInAndCurrentLocationNear(
                        userRepository.findByRole("DRIVER")
                                .stream()
                                .filter(user ->
                                        "APPROVED".equalsIgnoreCase(user.getVerificationStatus())
                                                &&
                                        "FEMALE".equalsIgnoreCase(user.getGender()))
                                .map(User::getId)
                                .collect(Collectors.toList()),
                        pickupPoint,
                        distance
                );

        drivers.sort(Comparator.comparingDouble(Driver::getRating).reversed());

        return drivers;
    }
}