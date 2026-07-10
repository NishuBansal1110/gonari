package com.shesafe.backend.repository;

import com.shesafe.backend.document.Driver;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends MongoRepository<Driver, String> {
    Optional<Driver> findByUserId(String userId);
    List<Driver> findByIsAvailable(boolean isAvailable);
    
    // Geospatial query to find nearby available drivers whose user IDs match the active/approved ones.
    List<Driver> findByIsAvailableTrueAndUserIdInAndCurrentLocationNear(
            List<String> userIds, 
            Point location, 
            Distance maxDistance
    );
}
