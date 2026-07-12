package com.shesafe.backend.controller;

import com.shesafe.backend.document.Driver;
import com.shesafe.backend.document.Ride;
import com.shesafe.backend.document.User;
import com.shesafe.backend.dto.RideRequestDto;
import com.shesafe.backend.dto.RideResponseDto;
import com.shesafe.backend.repository.DriverRepository;
import com.shesafe.backend.repository.RideRepository;
import com.shesafe.backend.repository.UserRepository;
import com.shesafe.backend.security.CustomUserDetails;
import com.shesafe.backend.service.RideMatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private RideMatchingService rideMatchingService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final SecureRandom random = new SecureRandom();

    private RideResponseDto convertToDto(Ride ride) {
        User rider = userRepository.findById(ride.getRiderId()).orElse(null);
        User driverUser = null;
        Driver driver = null;

        if (ride.getDriverId() != null) {
            driverUser = userRepository.findById(ride.getDriverId()).orElse(null);
            driver = driverRepository.findByUserId(ride.getDriverId()).orElse(null);
        }

        return RideResponseDto.builder()
                .id(ride.getId())
                .riderId(ride.getRiderId())
                .riderName(rider != null ? rider.getName() : "Unknown")
                .riderPhone(rider != null ? rider.getPhone() : "N/A")
                .driverId(ride.getDriverId())
                .driverName(driverUser != null ? driverUser.getName() : null)
                .driverPhone(driverUser != null ? driverUser.getPhone() : null)
                .vehicleType(driver != null ? driver.getVehicleType() : null)
                .vehicleNumber(driver != null ? driver.getVehicleNumber() : null)
                .pickupLat(ride.getPickup().getY())
                .pickupLng(ride.getPickup().getX())
                .dropLat(ride.getDrop().getY())
                .dropLng(ride.getDrop().getX())
                .pickupAddress(ride.getPickupAddress())
                .dropAddress(ride.getDropAddress())
                .status(ride.getStatus())
                .otp(ride.getOtp())
                .fare(ride.getFare())
                .startTime(ride.getStartTime())
                .endTime(ride.getEndTime())
                .createdAt(ride.getCreatedAt())
                .build();
    }

  @PostMapping("/request")
public ResponseEntity<?> requestRide(
        @RequestBody RideRequestDto requestDto,
        @AuthenticationPrincipal CustomUserDetails userDetails) {

    System.out.println("====== REQUEST RIDE API HIT ======");
    System.out.println("STEP 1");

    String riderId = userDetails.getUser().getId();

    System.out.println("STEP 2");

    List<Ride> activeRides = rideRepository.findByRiderIdAndStatusIn(
            riderId,
            List.of("REQUESTED", "ACCEPTED", "ONGOING"));

    System.out.println("STEP 3");

    if (!activeRides.isEmpty()) {
        return ResponseEntity.badRequest()
                .body("You already have an active ride request or trip.");
    }

    System.out.println("STEP 4");

    String otp = String.format("%04d", random.nextInt(10000));

    System.out.println("STEP 5");

    Ride ride = Ride.builder()
            .riderId(riderId)
            .pickup(new GeoJsonPoint(requestDto.getPickupLng(), requestDto.getPickupLat()))
            .drop(new GeoJsonPoint(requestDto.getDropLng(), requestDto.getDropLat()))
            .pickupAddress(requestDto.getPickupAddress())
            .dropAddress(requestDto.getDropAddress())
            .status("REQUESTED")
            .otp(otp)
            .fare(requestDto.getFare())
            .createdAt(LocalDateTime.now())
            .build();

    System.out.println("STEP 6");

    Ride savedRide = rideRepository.save(ride);

    System.out.println("STEP 7");

    RideResponseDto responseDto = convertToDto(savedRide);

    System.out.println("STEP 8");

    System.out.println("Skipping driver matching");

return ResponseEntity.ok(responseDto);

    System.out.println("STEP 10");

    return ResponseEntity.ok(responseDto);
}
    

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptRide(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        String driverUserId = userDetails.getUser().getId();

        // Check if user is DRIVER
        if (!"DRIVER".equalsIgnoreCase(userDetails.getUser().getRole())) {
            return ResponseEntity.badRequest().body("Only drivers can accept rides.");
        }

        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));

        if (!"REQUESTED".equalsIgnoreCase(ride.getStatus())) {
            return ResponseEntity.badRequest().body("Ride is already accepted or cancelled.");
        }

        // Make driver unavailable
        Driver driver = driverRepository.findByUserId(driverUserId)
                .orElseThrow(() -> new IllegalArgumentException("Driver profile not found"));
        driver.setAvailable(false);
        driverRepository.save(driver);

        ride.setDriverId(driverUserId);
        ride.setStatus("ACCEPTED");
        Ride savedRide = rideRepository.save(ride);
        RideResponseDto responseDto = convertToDto(savedRide);

        // Notify Rider and Driver via WS
        messagingTemplate.convertAndSend("/topic/ride/" + ride.getId(), responseDto);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<?> startRide(@PathVariable String id, @RequestParam String otp, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));

        if (!"ACCEPTED".equalsIgnoreCase(ride.getStatus())) {
            return ResponseEntity.badRequest().body("Ride must be accepted before it can start.");
        }

        if (!ride.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP. Cannot start ride.");
        }

        ride.setStatus("ONGOING");
        ride.setStartTime(LocalDateTime.now());
        Ride savedRide = rideRepository.save(ride);
        RideResponseDto responseDto = convertToDto(savedRide);

        // Notify Rider and Driver
        messagingTemplate.convertAndSend("/topic/ride/" + ride.getId(), responseDto);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeRide(@PathVariable String id, @AuthenticationPrincipal CustomUserDetails userDetails) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));

        if (!"ONGOING".equalsIgnoreCase(ride.getStatus())) {
            return ResponseEntity.badRequest().body("Ride must be ongoing to complete it.");
        }

        ride.setStatus("COMPLETED");
        ride.setEndTime(LocalDateTime.now());
        Ride savedRide = rideRepository.save(ride);
        RideResponseDto responseDto = convertToDto(savedRide);

        // Make driver available again
        Driver driver = driverRepository.findByUserId(ride.getDriverId())
                .orElseThrow(() -> new IllegalArgumentException("Driver profile not found"));
        driver.setAvailable(true);
        driverRepository.save(driver);

        // Notify Rider and Driver
        messagingTemplate.convertAndSend("/topic/ride/" + ride.getId(), responseDto);

        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveRide(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUser().getId();
        List<Ride> rides;

        if ("DRIVER".equalsIgnoreCase(userDetails.getUser().getRole())) {
            rides = rideRepository.findByDriverIdAndStatusIn(userId, List.of("ACCEPTED", "ONGOING"));
        } else {
            rides = rideRepository.findByRiderIdAndStatusIn(userId, List.of("REQUESTED", "ACCEPTED", "ONGOING"));
        }

        if (rides.isEmpty()) {
            return ResponseEntity.ok().body(null);
        }

        return ResponseEntity.ok(convertToDto(rides.get(0)));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getRideHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String userId = userDetails.getUser().getId();
        List<Ride> rides;

        if ("DRIVER".equalsIgnoreCase(userDetails.getUser().getRole())) {
            rides = rideRepository.findByDriverId(userId);
        } else {
            rides = rideRepository.findByRiderId(userId);
        }

        List<RideResponseDto> dtos = rides.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
