package com.floodguard.app;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.animation.AlphaAnimation;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.floodguard.app.auth.SessionManager;
import com.floodguard.app.ui.home.HomeActivity;
import com.floodguard.app.ui.dashboard.DashboardActivity;

public class MainActivity extends AppCompatActivity {

    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        // Initialize session manager
        sessionManager = new SessionManager(getApplicationContext());
        
        // Set up splash screen animations
        ImageView logoImage = findViewById(R.id.logoImage);
        TextView appTitle = findViewById(R.id.appTitle);
        TextView appSlogan = findViewById(R.id.appSlogan);
        
        AlphaAnimation fadeIn = new AlphaAnimation(0.0f, 1.0f);
        fadeIn.setDuration(1500);
        
        logoImage.startAnimation(fadeIn);
        appTitle.startAnimation(fadeIn);
        appSlogan.startAnimation(fadeIn);
        
        // Delay and then navigate to appropriate screen
        new Handler().postDelayed(() -> {
            Intent intent;
            
            // Check if user is logged in
            if (sessionManager.isLoggedIn()) {
                intent = new Intent(MainActivity.this, DashboardActivity.class);
            } else {
                intent = new Intent(MainActivity.this, HomeActivity.class);
            }
            
            startActivity(intent);
            finish();
        }, 2500);
    }
}

