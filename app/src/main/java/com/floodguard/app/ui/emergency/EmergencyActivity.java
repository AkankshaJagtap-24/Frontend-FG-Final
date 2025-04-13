package com.floodguard.app.ui.emergency;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.floodguard.app.R;
import com.floodguard.app.ui.dashboard.DashboardActivity;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.material.progressindicator.CircularProgressIndicator;

public class EmergencyActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;
    
    private EditText mobileEditText;
    private Button accessButton;
    private CircularProgressIndicator progressIndicator;
    private TextView locationStatusText;
    private View locationStatusContainer;
    
    private FusedLocationProviderClient fusedLocationClient;
    private Location currentLocation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_emergency);
        
        // Initialize location client
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        
        // Initialize views
        mobileEditText = findViewById(R.id.mobileEditText);
        accessButton = findViewById(R.id.accessButton);
        progressIndicator = findViewById(R.id.progressIndicator);
        locationStatusText = findViewById(R.id.locationStatusText);
        locationStatusContainer = findViewById(R.id.locationStatusContainer);
        
        ImageButton backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(v -> onBackPressed());
        
        accessButton.setOnClickListener(v -> validateAndProceed());
        
        // Check and request location permission
        if (checkLocationPermission()) {
            getLastLocation();
        } else {
            requestLocationPermission();
        }
    }
    
    private boolean checkLocationPermission() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }
    
    private void requestLocationPermission() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                LOCATION_PERMISSION_REQUEST_CODE);
    }
    
    private void getLastLocation() {
        if (checkLocationPermission()) {
            locationStatusContainer.setVisibility(View.VISIBLE);
            locationStatusText.setText("Detecting your location...");
            
            fusedLocationClient.getLastLocation()
                    .addOnSuccessListener(this, new OnSuccessListener<Location>() {
                        @Override
                        public void onSuccess(Location location) {
                            if (location != null) {
                                currentLocation = location;
                                locationStatusText.setText(String.format(
                                        "Location detected\nLat: %.6f, Lng: %.6f",
                                        location.getLatitude(),
                                        location.getLongitude()
                                ));
                            } else {
                                locationStatusText.setText("Unable to get your current location. Please ensure location services are enabled.");
                            }
                        }
                    })
                    .addOnFailureListener(this, e -> {
                        locationStatusText.setText("Failed to get location: " + e.getMessage());
                    });
        }
    }
    
    private void validateAndProceed() {
        String mobile = mobileEditText.getText().toString().trim();
        
        if (mobile.isEmpty()) {
            Toast.makeText(this, "Please enter your mobile number", Toast.LENGTH_SHORT).show();
            return;
        }
        
        // Show progress
        progressIndicator.setVisibility(View.VISIBLE);
        accessButton.setEnabled(false);
        
        // Simulate network delay
        new Thread(() -> {
            try {
                // Simulate API call
                Thread.sleep(1500);
                
                // Update UI on main thread
                runOnUiThread(() -> {
                    progressIndicator.setVisibility(View.GONE);
                    accessButton.setEnabled(true);
                    
                    // Navigate to dashboard
                    Intent intent = new Intent(EmergencyActivity.this, DashboardActivity.class);
                    intent.putExtra("isEmergency", true);
                    if (currentLocation != null) {
                        intent.putExtra("latitude", currentLocation.getLatitude());
                        intent.putExtra("longitude", currentLocation.getLongitude());
                    }
                    startActivity(intent);
                });
                
            } catch (InterruptedException e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    progressIndicator.setVisibility(View.GONE);
                    accessButton.setEnabled(true);
                    Toast.makeText(EmergencyActivity.this, "Failed to process request. Please try again.", Toast.LENGTH_SHORT).show();
                });
            }
        }).start();
    }
    
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                getLastLocation();
            } else {
                Toast.makeText(this, "Location permission denied. Some features may not work correctly.", Toast.LENGTH_SHORT).show();
            }
        }
    }
}

