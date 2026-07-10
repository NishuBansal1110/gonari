package com.shesafe.backend.controller;

import com.shesafe.backend.dto.ContactRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-us")
public class ContactController {

    @PostMapping
    public ResponseEntity<?> receiveContactForm(@RequestBody ContactRequestDto contactDto) {
        System.out.println("====== NEW CONTACT FORM RECEIVED ======");
        System.out.println("Name: " + contactDto.getName());
        System.out.println("Email: " + contactDto.getEmail());
        System.out.println("Message: " + contactDto.getMessage());
        System.out.println("=======================================");
        
        return ResponseEntity.ok().body("{\"message\": \"Thank you! Your feedback has been received and our safety team is reviewing it.\"}");
    }
}
