package com.shesafe.backend.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "rides")
public class Ride {
    @Id
    private String id;
    
    private String riderId;
    private String driverId; 
    
    private GeoJsonPoint pickup;
    private GeoJsonPoint drop;
    
    private String pickupAddress;
    private String dropAddress;
    
    private String status; 
    private String otp; 
    private double fare;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;

    // Constructors
    public Ride() {}

    public Ride(String id, String riderId, String driverId, GeoJsonPoint pickup, GeoJsonPoint drop, String pickupAddress, String dropAddress, String status, String otp, double fare, LocalDateTime startTime, LocalDateTime endTime, LocalDateTime createdAt) {
        this.id = id;
        this.riderId = riderId;
        this.driverId = driverId;
        this.pickup = pickup;
        this.drop = drop;
        this.pickupAddress = pickupAddress;
        this.dropAddress = dropAddress;
        this.status = status;
        this.otp = otp;
        this.fare = fare;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRiderId() { return riderId; }
    public void setRiderId(String riderId) { this.riderId = riderId; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public GeoJsonPoint getPickup() { return pickup; }
    public void setPickup(GeoJsonPoint pickup) { this.pickup = pickup; }

    public GeoJsonPoint getDrop() { return drop; }
    public void setDrop(GeoJsonPoint drop) { this.drop = drop; }

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDropAddress() { return dropAddress; }
    public void setDropAddress(String dropAddress) { this.dropAddress = dropAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public double getFare() { return fare; }
    public void setFare(double fare) { this.fare = fare; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static RideBuilder builder() {
        return new RideBuilder();
    }

    public static class RideBuilder {
        private String id;
        private String riderId;
        private String driverId;
        private GeoJsonPoint pickup;
        private GeoJsonPoint drop;
        private String pickupAddress;
        private String dropAddress;
        private String status;
        private String otp;
        private double fare;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private LocalDateTime createdAt;

        public RideBuilder id(String id) { this.id = id; return this; }
        public RideBuilder riderId(String riderId) { this.riderId = riderId; return this; }
        public RideBuilder driverId(String driverId) { this.driverId = driverId; return this; }
        public RideBuilder pickup(GeoJsonPoint pickup) { this.pickup = pickup; return this; }
        public RideBuilder drop(GeoJsonPoint drop) { this.drop = drop; return this; }
        public RideBuilder pickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; return this; }
        public RideBuilder dropAddress(String dropAddress) { this.dropAddress = dropAddress; return this; }
        public RideBuilder status(String status) { this.status = status; return this; }
        public RideBuilder otp(String otp) { this.otp = otp; return this; }
        public RideBuilder fare(double fare) { this.fare = fare; return this; }
        public RideBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public RideBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public RideBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public Ride build() {
            return new Ride(id, riderId, driverId, pickup, drop, pickupAddress, dropAddress, status, otp, fare, startTime, endTime, createdAt);
        }
    }
}
