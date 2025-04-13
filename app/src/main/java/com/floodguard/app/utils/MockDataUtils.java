package com.floodguard.app.utils;

import android.location.Location;

import com.floodguard.app.data.AlertData;
import com.floodguard.app.data.WeatherData;

import java.util.ArrayList;
import java.util.List;

public class MockDataUtils {
    
    public static List<AlertData> getMockAlerts() {
        List<AlertData> alerts = new ArrayList<>();
        
        alerts.add(new AlertData(
                "alert-1",
                "Evacuation Notice",
                "Riverside community - Water levels rising rapidly. Immediate evacuation recommended.",
                "10 min ago",
                "2.5 km away",
                AlertData.Severity.HIGH
        ));
        
        alerts.add(new AlertData(
                "alert-2",
                "Flood Warning",
                "Downtown area - Heavy rainfall expected to continue for the next 6 hours. Avoid low-lying areas.",
                "25 min ago",
                "1.2 km away",
                AlertData.Severity.MEDIUM
        ));
        
        return alerts;
    }
    
    public static List<AlertData> getMockAlertsWithLocation(Location location) {
        // In a real app, this would fetch alerts based on the location
        // For this demo, we'll just return the mock alerts
        return getMockAlerts();
    }
    
    public static WeatherData getMockWeather() {
        return new WeatherData(
                23,
                25,
                "Heavy Rain",
                85,
                18,
                32,
                85
        );
    }
    
    public static WeatherData getMockWeatherWithLocation(Location location) {
        // In a real app, this would fetch weather data based on the location
        // For this demo, we'll just return the mock weather
        return getMockWeather();
    }
}

