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
    System.out.println("RideMatchingService HIT");
    return List.of();
}
}
