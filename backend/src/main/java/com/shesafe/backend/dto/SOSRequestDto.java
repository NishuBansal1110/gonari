package com.shesafe.backend.dto;

public class SOSRequestDto {
    private String rideId;
    private double lat;
    private double lng;

    public SOSRequestDto() {}

    public String getRideId() { return rideId; }
    public void setRideId(String rideId) { this.rideId = rideId; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }
}
