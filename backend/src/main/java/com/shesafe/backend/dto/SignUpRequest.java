package com.shesafe.backend.dto;

public class SignUpRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String role; 
    private String gender; 
    private String govtIdDocUrl;
    private String selfieUrl;
    private String vehicleType;
    private String vehicleNumber;

    public SignUpRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getGovtIdDocUrl() { return govtIdDocUrl; }
    public void setGovtIdDocUrl(String govtIdDocUrl) { this.govtIdDocUrl = govtIdDocUrl; }

    public String getSelfieUrl() { return selfieUrl; }
    public void setSelfieUrl(String selfieUrl) { this.selfieUrl = selfieUrl; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }
}
