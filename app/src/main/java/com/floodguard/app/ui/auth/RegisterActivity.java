package com.floodguard.app.ui.auth;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.floodguard.app.R;
import com.floodguard.app.auth.SessionManager;
import com.floodguard.app.ui.dashboard.DashboardActivity;
import com.google.android.material.progressindicator.CircularProgressIndicator;
import com.google.android.material.textfield.TextInputLayout;

import java.util.UUID;

public class RegisterActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;
    private static final int SMS_PERMISSION_REQUEST_CODE = 1002;

    private EditText nameEditText, emailEditText, mobileEditText;
    private CheckBox locationCheckBox, smsCheckBox;
    private Button registerButton;
    private CircularProgressIndicator progressIndicator;
    private TextInputLayout nameLayout, emailLayout, mobileLayout;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        // Initialize session manager
        sessionManager = new SessionManager(getApplicationContext());

        // Initialize views
        nameEditText = findViewById(R.id.nameEditText);
        emailEditText = findViewById(R.id.emailEditText);
        mobileEditText = findViewById(R.id.mobileEditText);
        locationCheckBox = findViewById(R.id.locationCheckBox);
        smsCheckBox = findViewById(R.id.smsCheckBox);
        registerButton = findViewById(R.id.registerButton);
        progressIndicator = findViewById(R.id.progressIndicator);
        nameLayout = findViewById(R.id.nameLayout);
        emailLayout = findViewById(R.id.emailLayout);
        mobileLayout = findViewById(R.id.mobileLayout);

        ImageButton backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(v -> onBackPressed());

        registerButton.setOnClickListener(v -> validateAndRegister());
    }

    private void validateAndRegister() {
        // Reset errors
        nameLayout.setError(null);
        emailLayout.setError(null);
        mobileLayout.setError(null);

        // Get values
        String name = nameEditText.getText().toString().trim();
        String email = emailEditText.getText().toString().trim();
        String mobile = mobileEditText.getText().toString().trim();
        boolean locationPermission = locationCheckBox.isChecked();
        boolean smsPermission = smsCheckBox.isChecked();

        // Validate
        boolean isValid = true;

        if (name.isEmpty()) {
            nameLayout.setError("Name is required");
            isValid = false;
        }

        if (mobile.isEmpty()) {
            mobileLayout.setError("Mobile number is required");
            isValid = false;
        } else if (mobile.length() < 10) {
            mobileLayout.setError("Enter a valid mobile number");
            isValid = false;
        }

        if (!locationPermission || !smsPermission) {
            Toast.makeText(this, "Please accept all permissions to continue", Toast.LENGTH_SHORT).show();
            isValid = false;
        }

        if (isValid) {
            // Check and request permissions if needed
            if (locationPermission && !checkLocationPermission()) {
                requestLocationPermission();
                return;
            }

            if (smsPermission && !checkSmsPermission()) {
                requestSmsPermission();
                return;
            }

            // Proceed with registration
            registerUser(name, email, mobile, locationPermission, smsPermission);
        }
    }

    private void registerUser(String name, String email, String mobile, boolean locationPermission, boolean smsPermission) {
        // Show progress
        progressIndicator.setVisibility(View.VISIBLE);
        registerButton.setEnabled(false);

        // Simulate network delay
        new Thread(() -> {
            try {
                // Simulate API call
                Thread.sleep(1500);

                // Generate a random user ID (in a real app, this would come from the server)
                String userId = UUID.randomUUID().toString();

                // Create session
                sessionManager.createLoginSession(userId, name, mobile, email, locationPermission, smsPermission);

                // Update UI on main thread
                runOnUiThread(() -> {
                    progressIndicator.setVisibility(View.GONE);
                    showSuccessDialog();
                });

            } catch (InterruptedException e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    progressIndicator.setVisibility(View.GONE);
                    registerButton.setEnabled(true);
                    Toast.makeText(RegisterActivity.this, "Registration failed. Please try again.", Toast.LENGTH_SHORT).show();
                });
            }
        }).start();
    }

    private void showSuccessDialog() {
        new AlertDialog.Builder(this)
                .setTitle("Success!")
                .setMessage("Your account has been successfully created.")
                .setPositiveButton("Continue to Dashboard", (dialog, which) -> {
                    Intent intent = new Intent(RegisterActivity.this, DashboardActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                })
                .setCancelable(false)
                .show();
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

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                locationCheckBox.setChecked(true);
                // If we were also waiting for SMS permission, check that next
                if (!checkSmsPermission() && smsCheckBox.isChecked()) {
                    requestSmsPermission();
                } else {
                    // Otherwise proceed with registration
                    validateAndRegister();
                }
            } else {
                locationCheckBox.setChecked(false);
                Toast.makeText(this, "Location permission is required for alerts", Toast.LENGTH_SHORT).show();
            }
        } else if (requestCode == SMS_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                smsCheckBox.setChecked(true);
                // Now we can proceed with registration
                validateAndRegister();
            } else {
                smsCheckBox.setChecked(false);
                Toast.makeText(this, "SMS permission is required for notifications", Toast.LENGTH_SHORT).show();
            }
        }
    }
}

