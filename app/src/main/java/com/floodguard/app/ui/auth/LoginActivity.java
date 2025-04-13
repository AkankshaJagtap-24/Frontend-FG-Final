package com.floodguard.app.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.floodguard.app.R;
import com.floodguard.app.auth.SessionManager;
import com.floodguard.app.ui.dashboard.DashboardActivity;
import com.google.android.material.progressindicator.CircularProgressIndicator;
import com.google.android.material.textfield.TextInputLayout;

import java.util.UUID;

public class LoginActivity extends AppCompatActivity {

    private EditText nameEditText, mobileEditText, otpEditText;
    private Button requestOtpButton, verifyOtpButton, backToLoginButton;
    private CircularProgressIndicator progressIndicator;
    private TextInputLayout nameLayout, mobileLayout, otpLayout;
    private View loginForm, otpForm;
    private TextView resendOtpText, timerText;
    private SessionManager sessionManager;
    private CountDownTimer resendTimer;
    private boolean isTimerRunning = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        // Initialize session manager
        sessionManager = new SessionManager(getApplicationContext());

        // Initialize views
        nameEditText = findViewById(R.id.nameEditText);
        mobileEditText = findViewById(R.id.mobileEditText);
        otpEditText = findViewById(R.id.otpEditText);
        requestOtpButton = findViewById(R.id.requestOtpButton);
        verifyOtpButton = findViewById(R.id.verifyOtpButton);
        backToLoginButton = findViewById(R.id.backToLoginButton);
        progressIndicator = findViewById(R.id.progressIndicator);
        nameLayout = findViewById(R.id.nameLayout);
        mobileLayout = findViewById(R.id.mobileLayout);
        otpLayout = findViewById(R.id.otpLayout);
        loginForm = findViewById(R.id.loginForm);
        otpForm = findViewById(R.id.otpForm);
        resendOtpText = findViewById(R.id.resendOtpText);
        timerText = findViewById(R.id.timerText);

        ImageButton backButton = findViewById(R.id.backButton);
        backButton.setOnClickListener(v -> onBackPressed());

        requestOtpButton.setOnClickListener(v -> validateAndRequestOtp());
        verifyOtpButton.setOnClickListener(v -> validateAndVerifyOtp());
        backToLoginButton.setOnClickListener(v -> showLoginForm());
        resendOtpText.setOnClickListener(v -> resendOtp());
    }

    private void validateAndRequestOtp() {
        // Reset errors
        nameLayout.setError(null);
        mobileLayout.setError(null);

        // Get values
        String name = nameEditText.getText().toString().trim();
        String mobile = mobileEditText.getText().toString().trim();

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

        if (isValid) {
            requestOtp(name, mobile);
        }
    }

    private void requestOtp(String name, String mobile) {
        // Show progress
        progressIndicator.setVisibility(View.VISIBLE);
        requestOtpButton.setEnabled(false);

        // Simulate network delay
        new Thread(() -> {
            try {
                // Simulate API call
                Thread.sleep(1500);

                // Update UI on main thread
                runOnUiThread(() -> {
                    progressIndicator.setVisibility(View.GONE);
                    requestOtpButton.setEnabled(true);
                    showOtpForm(mobile);
                });

            } catch (InterruptedException e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    progressIndicator.setVisibility(View.GONE);
                    requestOtpButton.setEnabled(true);
                    Toast.makeText(LoginActivity.this, "Failed to send OTP. Please try again.", Toast.LENGTH_SHORT).show();
                });
            }
        }).start();
    }

    private void showOtpForm(String mobile) {
        loginForm.setVisibility(View.GONE);
        otpForm.setVisibility(View.VISIBLE);

        // Set mobile number in OTP form
        TextView mobileText = findViewById(R.id.mobileText);
        mobileText.setText(mobile);

        // Start resend timer
        startResendTimer();
    }

    private void showLoginForm() {
        loginForm.setVisibility(View.VISIBLE);
        otpForm.setVisibility(View.GONE);
        otpEditText.setText("");

        // Cancel timer if running
        if (resendTimer != null) {
            resendTimer.cancel();
            isTimerRunning = false;
        }
    }

    private void startResendTimer() {
        resendOtpText.setEnabled(false);
        resendOtpText.setAlpha(0.5f);
        timerText.setVisibility(View.VISIBLE);

        if (resendTimer != null) {
            resendTimer.cancel();
        }

        isTimerRunning = true;
        resendTimer = new CountDownTimer(30000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                timerText.setText(String.format("(%d)", millisUntilFinished / 1000));
            }

            @Override
            public void onFinish() {
                resendOtpText.setEnabled(true);
                resendOtpText.setAlpha(1.0f);
                timerText.setVisibility(View.GONE);
                isTimerRunning = false;
            }
        }.start();
    }

    private void resendOtp() {
        if (!isTimerRunning) {
            Toast.makeText(this, "OTP sent again", Toast.LENGTH_SHORT).show();
            startResendTimer();
        }
    }

    private void validateAndVerifyOtp() {
        // Reset errors
        otpLayout.setError(null);

        // Get values
        String otp = otpEditText.getText().toString().trim();

        // Validate
        if (otp.isEmpty()) {
            otpLayout.setError("OTP is required");
            return;
        }

        if (otp.length() != 6) {
            otpLayout.setError("Enter a valid 6-digit OTP");
            return;
        }

        verifyOtp(otp);
    }

    private void verifyOtp(String otp) {
        // Show progress
        progressIndicator.setVisibility(View.VISIBLE);
        verifyOtpButton.setEnabled(false);

        // Simulate network delay
        new Thread(() -> {
            try {
                // Simulate API call
                Thread.sleep(1500);

                // For demo purposes, any 6-digit OTP is valid
                // In a real app, this would verify with a backend

                // Get user details from form
                String name = nameEditText.getText().toString().trim();
                String mobile = mobileEditText.getText().toString().trim();

                // Generate a random user ID (in a real app, this would come from the server)
                String userId = UUID.randomUUID().toString();

                // Create session
                sessionManager.createLoginSession(userId, name, mobile, "", true, true);

                // Update UI on main thread
                runOnUiThread(() -> {
                    progressIndicator.setVisibility(View.GONE);
                    
                    // Navigate to dashboard
                    Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                });

            } catch (InterruptedException e) {
                e.printStackTrace();
                runOnUiThread(() -> {
                    progressIndicator.setVisibility(View.GONE);
                    verifyOtpButton.setEnabled(true);
                    Toast.makeText(LoginActivity.this, "Verification failed. Please try again.", Toast.LENGTH_SHORT).show();
                });
            }
        }).start();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (resendTimer != null) {
            resendTimer.cancel();
        }
    }
}

