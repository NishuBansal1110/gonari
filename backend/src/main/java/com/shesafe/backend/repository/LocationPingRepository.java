package com.shesafe.backend.repository;

import com.shesafe.backend.document.LocationPing;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationPingRepository extends MongoRepository<LocationPing, String> {
    List<LocationPing> findByRideIdOrderByTimestampAsc(String rideId);
}
