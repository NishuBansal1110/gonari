package com.shesafe.backend.dto;

public class RideRequestDto {
    private double pickupLat;
    private double pickupLng;
    private double dropLat;
    private double dropLng;
    private String pickupAddress;
    private String dropAddress;
    private double fare;

    public RideRequestDto() {}

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

    public double getFare() { return fare; }
    public void setFare(double fare) { this.fare = fare; }
}
