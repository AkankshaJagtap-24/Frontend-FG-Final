package com.floodguard.app.data;

public class AlertData {
    
    public enum Severity {
        HIGH, MEDIUM, LOW
    }
    
    private String id;
    private String title;
    private String description;
    private String time;
    private String location;
    private Severity severity;
    
    public AlertData(String id, String title, String description, String time, String location, Severity severity) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.time = time;
        this.location = location;
        this.severity = severity;
    }
    
    public String getId() {
        return id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public String getTime() {
        return time;
    }
    
    public String getLocation() {
        return location;
    }
    
    public Severity getSeverity() {
        return severity;
    }
}

