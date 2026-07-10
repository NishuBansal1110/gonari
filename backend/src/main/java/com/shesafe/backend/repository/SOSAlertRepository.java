package com.shesafe.backend.repository;

import com.shesafe.backend.document.SOSAlert;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SOSAlertRepository extends MongoRepository<SOSAlert, String> {
    List<SOSAlert> findByStatus(String status);
    List<SOSAlert> findByRideId(String rideId);
}
