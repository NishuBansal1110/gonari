package com.shesafe.backend.dto;

import java.time.LocalDateTime;

public class RideResponseDto {
    private String id;
    private String riderId;
    private String riderName;
    private String riderPhone;
    
    private String driverId; 
    private String driverName; 
    private String driverPhone; 
    private String vehicleType;
    private String vehicleNumber;
    
    private double pickupLat;
    private double pickupLng;
    private double dropLat;
    private double dropLng;
    
    private String pickupAddress;
    private String dropAddress;
    
    private String status;
    private String otp;
    private double fare;
    
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;

    public RideResponseDto() {}

    public RideResponseDto(String id, String riderId, String riderName, String riderPhone, String driverId, String driverName, String driverPhone, String vehicleType, String vehicleNumber, double pickupLat, double pickupLng, double dropLat, double dropLng, String pickupAddress, String dropAddress, String status, String otp, double fare, LocalDateTime startTime, LocalDateTime endTime, LocalDateTime createdAt) {
        this.id = id;
        this.riderId = riderId;
        this.riderName = riderName;
        this.riderPhone = riderPhone;
        this.driverId = driverId;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.vehicleType = vehicleType;
        this.vehicleNumber = vehicleNumber;
        this.pickupLat = pickupLat;
        this.pickupLng = pickupLng;
        this.dropLat = dropLat;
        this.dropLng = dropLng;
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

    public String getRiderName() { return riderName; }
    public void setRiderName(String riderName) { this.riderName = riderName; }

    public String getRiderPhone() { return riderPhone; }
    public void setRiderPhone(String riderPhone) { this.riderPhone = riderPhone; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverPhone() { return driverPhone; }
    public void setDriverPhone(String driverPhone) { this.driverPhone = driverPhone; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public double getPickupLat() { return pickupLat; }
    public void setPickupLat(double pickupLat) { this.pickupLat = pickupLat; }

    public double getPickupLng() { return pickupLng; }
    public void setPickupLng(double pickupLng) { this.pickupLng = pickupLng; }

    public double getDropLat() { return dropLat; }
    public void setDropLat(double dropLat) { this.dropLat = dropLat; }

    public double getDropLng() { return dropLng; }
    public void setDropLng(double dropLng) { this.dropLng = dropLng; }

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
    public static RideResponseDtoBuilder builder() {
        return new RideResponseDtoBuilder();
    }

    public static class RideResponseDtoBuilder {
        private String id;
        private String riderId;
        private String riderName;
        private String riderPhone;
        private String driverId;
        private String driverName;
        private String driverPhone;
        private String vehicleType;
        private String vehicleNumber;
        private double pickupLat;
        private double pickupLng;
        private double dropLat;
        private double dropLng;
        private String pickupAddress;
        private String dropAddress;
        private String status;
        private String otp;
        private double fare;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private LocalDateTime createdAt;

        public RideResponseDtoBuilder id(String id) { this.id = id; return this; }
        public RideResponseDtoBuilder riderId(String riderId) { this.riderId = riderId; return this; }
        public RideResponseDtoBuilder riderName(String riderName) { this.riderName = riderName; return this; }
        public RideResponseDtoBuilder riderPhone(String riderPhone) { this.riderPhone = riderPhone; return this; }
        public RideResponseDtoBuilder driverId(String driverId) { this.driverId = driverId; return this; }
        public RideResponseDtoBuilder driverName(String driverName) { this.driverName = driverName; return this; }
        public RideResponseDtoBuilder driverPhone(String driverPhone) { this.driverPhone = driverPhone; return this; }
        public RideResponseDtoBuilder vehicleType(String vehicleType) { this.vehicleType = vehicleType; return this; }
        public RideResponseDtoBuilder vehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; return this; }
        public RideResponseDtoBuilder pickupLat(double pickupLat) { this.pickupLat = pickupLat; return this; }
        public RideResponseDtoBuilder pickupLng(double pickupLng) { this.pickupLng = pickupLng; return this; }
        public RideResponseDtoBuilder dropLat(double dropLat) { this.dropLat = dropLat; return this; }
        public RideResponseDtoBuilder dropLng(double dropLng) { this.dropLng = dropLng; return this; }
        public RideResponseDtoBuilder pickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; return this; }
        public RideResponseDtoBuilder dropAddress(String dropAddress) { this.dropAddress = dropAddress; return this; }
        public RideResponseDtoBuilder status(String status) { this.status = status; return this; }
        public RideResponseDtoBuilder otp(String otp) { this.otp = otp; return this; }
        public RideResponseDtoBuilder fare(double fare) { this.fare = fare; return this; }
        public RideResponseDtoBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public RideResponseDtoBuilder text(LocalDateTime endTime) { this.endTime = endTime; return this; } // wait, this was builder.endTime(LocalDateTime)
        public RideResponseDtoBuilder endTime(LocalDateTime endTime) { this.endTime = endTime; return this; }
        public RideResponseDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public RideResponseDto build() {
            return new RideResponseDto(id, riderId, riderName, riderPhone, driverId, driverName, driverPhone, vehicleType, vehicleNumber, pickupLat, pickupLng, dropLat, dropLng, pickupAddress, dropAddress, status, otp, fare, startTime, endTime, createdAt);
        }
    }
}
