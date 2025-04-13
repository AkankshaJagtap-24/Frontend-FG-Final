package com.floodguard.app.ui.dashboard.fragments;

import android.content.DialogInterface;
import android.location.Location;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.floodguard.app.R;
import com.floodguard.app.data.AlertData;
import com.floodguard.app.data.WeatherData;
import com.floodguard.app.ui.dashboard.adapters.AlertAdapter;
import com.floodguard.app.utils.LocationUtils;
import com.floodguard.app.utils.MockDataUtils;
import com.google.android.material.progressindicator.CircularProgressIndicator;

import java.util.List;

public class HomeFragment extends Fragment {

    private RecyclerView alertsRecyclerView;
    private AlertAdapter alertAdapter;
    private TextView weatherTempText, weatherConditionText;
    private TextView humidityText, windText, rainfallText;
    private Button sosButton;
    private CircularProgressIndicator sosProgressIndicator;
    private TextView locationErrorText;
    private View locationErrorContainer;
    private View weatherCard;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        // Initialize views
        alertsRecyclerView = view.findViewById(R.id.alertsRecyclerView);
        weatherTempText = view.findViewById(R.id.weatherTempText);
        weatherConditionText = view.findViewById(R.id.weatherConditionText);
        humidityText = view.findViewById(R.id.humidityText);
        windText = view.findViewById(R.id.windText);
        rainfallText = view.findViewById(R.id.rainfallText);
        sosButton = view.findViewById(R.id.sosButton);
        sosProgressIndicator = view.findViewById(R.id.sosProgressIndicator);
        locationErrorText = view.findViewById(R.id.locationErrorText);
        locationErrorContainer = view.findViewById(R.id.locationErrorContainer);
        weatherCard = view.findViewById(R.id.weatherCard);

        // Set up alerts recycler view
        alertsRecyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        alertAdapter = new AlertAdapter(getContext());
        alertsRecyclerView.setAdapter(alertAdapter);

        // Set up SOS button
        sosButton.setOnClickListener(v -> showSosConfirmDialog());

        // Load mock data
        loadMockData();

        return view;
    }

    private void loadMockData() {
        // Load mock alerts
        List<AlertData> alerts = MockDataUtils.getMockAlerts();
        alertAdapter.setAlerts(alerts);

        // Load mock weather
        WeatherData weather = MockDataUtils.getMockWeather();
        updateWeatherUI(weather);
    }

    private void updateWeatherUI(WeatherData weather) {
        weatherTempText.setText(String.format("%d°C", weather.getTemperature()));
        weatherConditionText.setText(weather.getCondition());
        humidityText.setText(String.format("%d%%", weather.getHumidity()));
        windText.setText(String.format("%d km/h", weather.getWindSpeed()));
        rainfallText.setText(String.format("%d mm", weather.getRainfall()));
    }

    private void showSosConfirmDialog() {
        new AlertDialog.Builder(requireContext())
                .setTitle("Send SOS Alert?")
                .setMessage("This will send your current location to emergency services.")
                .setIcon(R.drawable.ic_alert_triangle)
                .setPositiveButton("Send SOS", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        sendSosAlert();
                    }
                })
                .setNegativeButton("Cancel", null)
                .show();
    }

    private void sendSosAlert() {
        // Show progress
        sosProgressIndicator.setVisibility(View.VISIBLE);
        sosButton.setEnabled(false);

        // Simulate network delay
        new Thread(() -> {
            try {
                // Simulate API call
                Thread.sleep(2000);

                // Update UI on main thread
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        sosProgressIndicator.setVisibility(View.GONE);
                        sosButton.setEnabled(true);
                        Toast.makeText(getContext(), "SOS alert sent successfully!", Toast.LENGTH_LONG).show();
                    });
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
                if (getActivity() != null) {
                    getActivity().runOnUiThread(() -> {
                        sosProgressIndicator.setVisibility(View.GONE);
                        sosButton.setEnabled(true);
                        Toast.makeText(getContext(), "Failed to send SOS alert. Please try again.", Toast.LENGTH_SHORT).show();
                    });
                }
            }
        }).start();
    }

    public void updateLocationData(Location location) {
        if (location != null) {
            // Hide location error if shown
            locationErrorContainer.setVisibility(View.GONE);

            // In a real app, this would fetch alerts and weather data based on location
            // For this demo, we'll just update the mock data with the location
            List<AlertData> alerts = MockDataUtils.getMockAlertsWithLocation(location);
            alertAdapter.setAlerts(alerts);

            WeatherData weather = MockDataUtils.getMockWeatherWithLocation(location);
            updateWeatherUI(weather);
        } else {
            // Show location error
            locationErrorContainer.setVisibility(View.VISIBLE);
            locationErrorText.setText("Unable to get your location. Some features may not work correctly.");
        }
    }
}

