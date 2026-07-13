package com.shesafe.backend.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;

import java.time.LocalDateTime;

@Document(collection = "drivers")
public class Driver {
    @Id
    private String id;
    
    private String userId; 
    private String vehicleType; 
    private String vehicleNumber;
    private double rating;
    private boolean isAvailable;
    
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
private GeoJsonPoint currentLocation; // location ki jagah currentLocation 
    
    private LocalDateTime updatedAt;

    // Constructors
    public Driver() {}

    public Driver(String id, String userId, String vehicleType, String vehicleNumber, double rating, boolean isAvailable, GeoJsonPoint currentLocation, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.vehicleType = vehicleType;
        this.vehicleNumber = vehicleNumber;
        this.rating = rating;
        this.isAvailable = isAvailable;
        this.currentLocation = currentLocation;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public GeoJsonPoint getCurrentLocation() { return currentLocation; }
public void setCurrentLocation(GeoJsonPoint currentLocation) { this.currentLocation = currentLocation; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static DriverBuilder builder() {
        return new DriverBuilder();
    }

    public static class DriverBuilder {
        private String id;
        private String userId;
        private String vehicleType;
        private String vehicleNumber;
        private double rating;
        private boolean isAvailable;
        private GeoJsonPoint currentLocation;
        private LocalDateTime updatedAt;

        public DriverBuilder id(String id) { this.id = id; return this; }
        public DriverBuilder userId(String userId) { this.userId = userId; return this; }
        public DriverBuilder vehicleType(String vehicleType) { this.vehicleType = vehicleType; return this; }
        public DriverBuilder vehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; return this; }
        public DriverBuilder rating(double rating) { this.rating = rating; return this; }
        public DriverBuilder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public DriverBuilder currentLocation(GeoJsonPoint currentLocation) { this.currentLocation = currentLocation; return this; }
        public DriverBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Driver build() {
            return new Driver(id, userId, vehicleType, vehicleNumber, rating, isAvailable, currentLocation, updatedAt);
        }
    }
}
