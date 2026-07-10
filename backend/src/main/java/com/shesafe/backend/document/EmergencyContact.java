package com.shesafe.backend.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "emergencyContacts")
public class EmergencyContact {
    @Id
    private String id;
    
    private String userId; 
    private String name;
    private String phone;
    private String relation;

    // Constructors
    public EmergencyContact() {}

    public EmergencyContact(String id, String userId, String name, String phone, String relation) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.phone = phone;
        this.relation = relation;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRelation() { return relation; }
    public void setRelation(String relation) { this.relation = relation; }

    // Builder
    public static EmergencyContactBuilder builder() {
        return new EmergencyContactBuilder();
    }

    public static class EmergencyContactBuilder {
        private String id;
        private String userId;
        private String name;
        private String phone;
        private String relation;

        public EmergencyContactBuilder id(String id) { this.id = id; return this; }
        public EmergencyContactBuilder userId(String userId) { this.userId = userId; return this; }
        public EmergencyContactBuilder name(String name) { this.name = name; return this; }
        public EmergencyContactBuilder phone(String phone) { this.phone = phone; return this; }
        public EmergencyContactBuilder relation(String relation) { this.relation = relation; return this; }

        public EmergencyContact build() {
            return new EmergencyContact(id, userId, name, phone, relation);
        }
    }
}
