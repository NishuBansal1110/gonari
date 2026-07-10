package com.shesafe.backend.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String name;
    private String email;
    private String phone;
    private String passwordHash;
    
    private String role; // RIDER, DRIVER, ADMIN
    private String gender; // FEMALE
    
    private String verificationStatus; // PENDING, APPROVED, REJECTED
    private String govtIdDocUrl; 
    private String selfieUrl; 
    
    private LocalDateTime createdAt;

    // Constructors
    public User() {}

    public User(String id, String name, String email, String phone, String passwordHash, String role, String gender, String verificationStatus, String govtIdDocUrl, String selfieUrl, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.role = role;
        this.gender = gender;
        this.verificationStatus = verificationStatus;
        this.govtIdDocUrl = govtIdDocUrl;
        this.selfieUrl = selfieUrl;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }
    
    public String getGovtIdDocUrl() { return govtIdDocUrl; }
    public void setGovtIdDocUrl(String govtIdDocUrl) { this.govtIdDocUrl = govtIdDocUrl; }
    
    public String getSelfieUrl() { return selfieUrl; }
    public void setSelfieUrl(String selfieUrl) { this.selfieUrl = selfieUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private String id;
        private String name;
        private String email;
        private String phone;
        private String passwordHash;
        private String role;
        private String gender;
        private String verificationStatus;
        private String govtIdDocUrl;
        private String selfieUrl;
        private LocalDateTime createdAt;

        public UserBuilder id(String id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder phone(String phone) { this.phone = phone; return this; }
        public UserBuilder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public UserBuilder role(String role) { this.role = role; return this; }
        public UserBuilder gender(String gender) { this.gender = gender; return this; }
        public UserBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }
        public UserBuilder govtIdDocUrl(String govtIdDocUrl) { this.govtIdDocUrl = govtIdDocUrl; return this; }
        public UserBuilder selfieUrl(String selfieUrl) { this.selfieUrl = selfieUrl; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            return new User(id, name, email, phone, passwordHash, role, gender, verificationStatus, govtIdDocUrl, selfieUrl, createdAt);
        }
    }
}
