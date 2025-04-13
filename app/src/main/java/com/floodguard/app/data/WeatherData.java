package com.floodguard.app.data;

public class WeatherData {
    
    private int temperature;
    private int feelsLike;
    private String condition;
    private int humidity;
    private int windSpeed;
    private int rainfall;
    private int precipitation;
    
    public WeatherData(int temperature, int feelsLike, String condition, int humidity, int windSpeed, int rainfall, int precipitation) {
        this.temperature = temperature;
        this.feelsLike = feelsLike;
        this.condition = condition;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.rainfall = rainfall;
        this.precipitation = precipitation;
    }
    
    public int getTemperature() {
        return temperature;
    }
    
    public int getFeelsLike() {
        return feelsLike;
    }
    
    public String getCondition() {
        return condition;
    }
    
    public int getHumidity() {
        return humidity;
    }
    
    public int getWindSpeed() {
        return windSpeed;
    }
    
    public int getRainfall() {
        return rainfall;
    }
    
    public int getPrecipitation() {
        return precipitation;
    }
}

