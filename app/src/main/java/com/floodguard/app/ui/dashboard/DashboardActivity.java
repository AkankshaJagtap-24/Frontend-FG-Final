package com.floodguard.app.ui.dashboard;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;

import com.floodguard.app.R;
import com.floodguard.app.auth.SessionManager;
import com.floodguard.app.ui.dashboard.fragments.AlertsFragment;
import com.floodguard.app.ui.dashboard.fragments.ForumFragment;
import com.floodguard.app.ui.dashboard.fragments.HomeFragment;
import com.floodguard.app.ui.dashboard.fragments.ProfileFragment;
import com.floodguard.app.ui.dashboard.fragments.WeatherFragment;
import com.floodguard.app.ui.home.HomeActivity;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.material.bottomnavigation.BottomNavigationView;
import com.google.android.material.navigation.NavigationView;

import java.util.HashMap;

public class DashboardActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;
    private static final int SMS_PERMISSION_REQUEST_CODE = 1002;

    private DrawerLayout drawerLayout;
    private NavigationView navigationView;
    private BottomNavigationView bottomNavigationView;
    private SessionManager sessionManager;
    private FusedLocationProviderClient fusedLocationClient;
    private Location currentLocation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        // Initialize session manager
        sessionManager = new SessionManager(getApplicationContext());

        // Check if user is logged in
        if (!sessionManager.isLoggedIn()) {
            // Redirect to login page
            Intent intent = new Intent(DashboardActivity.this, HomeActivity.class);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            startActivity(intent);
            finish();
            return;
        }

        // Initialize location client
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        // Set up toolbar
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        // Set up drawer layout
        drawerLayout = findViewById(R.id.drawer_layout);
        navigationView = findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        // Set up bottom navigation
        bottomNavigationView = findViewById(R.id.bottom_navigation);
        bottomNavigationView.setOnNavigationItemSelectedListener(item -> {
            Fragment selectedFragment = null;
            
            switch (item.getItemId()) {
                case R.id.nav_home:
                    selectedFragment = new HomeFragment();
                    break;
                case R.id.nav_alerts:
                    selectedFragment = new AlertsFragment();
                    break;
                case R.id.nav_weather:
                    selectedFragment = new WeatherFragment();
                    break;
                case R.id.nav_forum:
                    selectedFragment = new ForumFragment();
                    break;
                case R.id.nav_profile:
                    selectedFragment = new ProfileFragment();
                    break;
            }
            
            if (selectedFragment != null) {
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, selectedFragment)
                        .commit();
                return true;
            }
            
            return false;
        });

        // Set up user info in navigation drawer
        setupNavHeader();

        // Check and request permissions
        checkAndRequestPermissions();

        // Get location
        if (checkLocationPermission()) {
            getLastLocation();
        }

        // Set default fragment
        if (savedInstanceState == null) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragment_container, new HomeFragment())
                    .commit();
            bottomNavigationView.setSelectedItemId(R.id.nav_home);
        }

        // Check if opened from emergency
        if (getIntent().getBooleanExtra("isEmergency", false)) {
            // Show emergency alert
            showEmergencyAlert();
        }
    }

    private void setupNavHeader() {
        View headerView = navigationView.getHeaderView(0);
        TextView nameTextView = headerView.findViewById(R.id.nav_header_name);
        TextView mobileTextView = headerView.findViewById(R.id.nav_header_mobile);
        ImageView profileImageView = headerView.findViewById(R.id.nav_header_image);

        // Get user details
        HashMap<String, String> user = sessionManager.getUserDetails();
        String name = user.get(SessionManager.KEY_NAME);
        String mobile = user.get(SessionManager.KEY_MOBILE);

        // Set user details
        nameTextView.setText(name);
        mobileTextView.setText(mobile);

        // Set profile image with initials
        if (name != null && !name.isEmpty()) {
            String initials = getInitials(name);
            TextView initialsTextView = headerView.findViewById(R.id.nav_header_initials);
            initialsTextView.setText(initials);
        }
    }

    private String getInitials(String name) {
        StringBuilder initials = new StringBuilder();
        String[] parts = name.split(" ");
        for (String part : parts) {
            if (!part.isEmpty()) {
                initials.append(part.charAt(0));
            }
        }
        return initials.toString().toUpperCase();
    }

    private void checkAndRequestPermissions() {
        if (!checkLocationPermission() && sessionManager.getLocationPermission()) {
            requestLocationPermission();
        }

        if (!checkSmsPermission() && sessionManager.getSmsPermission()) {
            requestSmsPermission();
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

    private boolean checkSmsPermission() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestSmsPermission() {
        ActivityCompat.requestPermissions(this,
                new String[]{Manifest.permission.SEND_SMS},
                SMS_PERMISSION_REQUEST_CODE);
    }

    private void getLastLocation() {
        if (checkLocationPermission()) {
            fusedLocationClient.getLastLocation()
                    .addOnSuccessListener(this, location -> {
                        if (location != null) {
                            currentLocation = location;
                            // Update location-based data
                            updateLocationBasedData(location);
                        }
                    })
                    .addOnFailureListener(this, e -> {
                        Toast.makeText(this, "Failed to get location: " + e.getMessage(), Toast.LENGTH_SHORT).show();
                    });
        }
    }

    private void updateLocationBasedData(Location location) {
        // In a real app, this would fetch alerts and weather data based on location
        // For this demo, we'll just update the fragments if they're active
        Fragment currentFragment = getSupportFragmentManager().findFragmentById(R.id.fragment_container);
        
        if (currentFragment instanceof HomeFragment) {
            ((HomeFragment) currentFragment).updateLocationData(location);
        } else if (currentFragment instanceof AlertsFragment) {
            ((AlertsFragment) currentFragment).updateLocationData(location);
        } else if (currentFragment instanceof WeatherFragment) {
            ((WeatherFragment) currentFragment).updateLocationData(location);
        }
    }

    private void showEmergencyAlert() {
        new AlertDialog.Builder(this)
                .setTitle("Emergency Mode")
                .setMessage("You are now in emergency mode. Your location has been shared with emergency services.")
                .setPositiveButton("OK", null)
                .setIcon(R.drawable.ic_alert_triangle)
                .show();
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        switch (item.getItemId()) {
            case R.id.nav_drawer_profile:
                getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, new ProfileFragment())
                        .commit();
                bottomNavigationView.setSelectedItemId(R.id.nav_profile);
                break;
            case R.id.nav_drawer_settings:
                Toast.makeText(this, "Settings", Toast.LENGTH_SHORT).show();
                break;
            case R.id.nav_drawer_logout:
                logoutUser();
                break;
        }

        drawerLayout.closeDrawer(GravityCompat.START);
        return true;
    }

    private void logoutUser() {
        new AlertDialog.Builder(this)
                .setTitle("Logout")
                .setMessage("Are you sure you want to logout?")
                .setPositiveButton("Yes", (dialog, which) -> {
                    sessionManager.logoutUser();
                    Intent intent = new Intent(DashboardActivity.this, HomeActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                })
                .setNegativeButton("No", null)
                .show();
    }

    @Override
    public void onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
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

