package com.shesafe.backend.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "locationPings")
public class LocationPing {
    @Id
    private String id;
    
    private String rideId;
    private String userId; 
    private GeoJsonPoint location;
    private LocalDateTime timestamp;

    // Constructors
    public LocationPing() {}

    public LocationPing(String id, String rideId, String userId, GeoJsonPoint location, LocalDateTime timestamp) {
        this.id = id;
        this.rideId = rideId;
        this.userId = userId;
        this.location = location;
        this.timestamp = timestamp;
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

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    // Builder
    public static LocationPingBuilder builder() {
        return new LocationPingBuilder();
    }

    public static class LocationPingBuilder {
        private String id;
        private String rideId;
        private String userId;
        private GeoJsonPoint location;
        private LocalDateTime timestamp;

        public LocationPingBuilder id(String id) { this.id = id; return this; }
        public LocationPingBuilder rideId(String rideId) { this.rideId = rideId; return this; }
        public LocationPingBuilder userId(String userId) { this.userId = userId; return this; }
        public LocationPingBuilder location(GeoJsonPoint location) { this.location = location; return this; }
        public LocationPingBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public LocationPing build() {
            return new LocationPing(id, rideId, userId, location, timestamp);
        }
    }
}
