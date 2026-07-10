package com.shesafe.backend.dto;

public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;
    private String role;
    private String gender;
    private String verificationStatus;

    public AuthResponse() {}

    public AuthResponse(String token, String userId, String name, String email, String role, String gender, String verificationStatus) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.gender = gender;
        this.verificationStatus = verificationStatus;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    // Builder
    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private String userId;
        private String name;
        private String email;
        private String role;
        private String gender;
        private String verificationStatus;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder userId(String userId) { this.userId = userId; return this; }
        public AuthResponseBuilder name(String name) { this.name = name; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder role(String role) { this.role = role; return this; }
        public AuthResponseBuilder gender(String gender) { this.gender = gender; return this; }
        public AuthResponseBuilder verificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, userId, name, email, role, gender, verificationStatus);
        }
    }
}
