package com.shesafe.backend.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "sosAlerts")
public class SOSAlert {
    @Id
    private String id;
    
    private String rideId;
    private String userId; 
    private GeoJsonPoint location;
    private String status; 
    private LocalDateTime createdAt;

    // Constructors
    public SOSAlert() {}

    public SOSAlert(String id, String rideId, String userId, GeoJsonPoint location, String status, LocalDateTime createdAt) {
        this.id = id;
        this.rideId = rideId;
        this.userId = userId;
        this.location = location;
        this.status = status;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRideId() { return rideId; }
    public void setRideId(String rideId) { this.rideId = rideId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public GeoJsonPoint getLocation() { return location; }
    public void setLocation(GeoJsonPoint location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static SOSAlertBuilder builder() {
        return new SOSAlertBuilder();
    }

    public static class SOSAlertBuilder {
        private String id;
        private String rideId;
        private String userId;
        private GeoJsonPoint location;
        private String status;
        private LocalDateTime createdAt;

        public SOSAlertBuilder id(String id) { this.id = id; return this; }
        public SOSAlertBuilder rideId(String rideId) { this.rideId = rideId; return this; }
        public SOSAlertBuilder userId(String userId) { this.userId = userId; return this; }
        public SOSAlertBuilder location(GeoJsonPoint location) { this.location = location; return this; }
        public SOSAlertBuilder status(String status) { this.status = status; return this; }
        public SOSAlertBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public SOSAlert build() {
            return new SOSAlert(id, rideId, userId, location, status, createdAt);
        }
    }
}
