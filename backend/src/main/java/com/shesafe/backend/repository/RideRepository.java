package com.shesafe.backend.repository;

import com.shesafe.backend.document.Ride;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RideRepository extends MongoRepository<Ride, String> {
    List<Ride> findByRiderId(String riderId);
    List<Ride> findByDriverId(String driverId);
    List<Ride> findByStatus(String status);
    
    // Find active rides for a rider (REQUESTED, ACCEPTED, ONGOING)
    List<Ride> findByRiderIdAndStatusIn(String riderId, List<String> statuses);
    
    // Find active rides for a driver
    List<Ride> findByDriverIdAndStatusIn(String driverId, List<String> statuses);
}
