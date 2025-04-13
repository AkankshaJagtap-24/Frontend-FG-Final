package com.floodguard.app.ui.dashboard.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.floodguard.app.R;
import com.floodguard.app.data.AlertData;

import java.util.ArrayList;
import java.util.List;

public class AlertAdapter extends RecyclerView.Adapter<AlertAdapter.AlertViewHolder> {

    private List<AlertData> alerts = new ArrayList<>();
    private Context context;

    public AlertAdapter(Context context) {
        this.context = context;
    }

    public void setAlerts(List<AlertData> alerts) {
        this.alerts = alerts;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public AlertViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_alert, parent, false);
        return new AlertViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AlertViewHolder holder, int position) {
        AlertData alert = alerts.get(position);
        holder.bind(alert);
    }

    @Override
    public int getItemCount() {
        return alerts.size();
    }

    class AlertViewHolder extends RecyclerView.ViewHolder {
        private ImageView alertIcon;
        private TextView alertTitleText, alertDescriptionText, alertTimeText;
        private View itemView;

        public AlertViewHolder(@NonNull View itemView) {
            super(itemView);
            this.itemView = itemView;
            alertIcon = itemView.findViewById(R.id.alertIcon);
            alertTitleText = itemView.findViewById(R.id.alertTitleText);
            alertDescriptionText = itemView.findViewById(R.id.alertDescriptionText);
            alertTimeText = itemView.findViewById(R.id.alertTimeText);
        }

        public void bind(AlertData alert) {
            alertTitleText.setText(alert.getTitle());
            alertDescriptionText.setText(alert.getDescription());
            alertTimeText.setText(alert.getTime());

            // Set background and colors based on severity
            switch (alert.getSeverity()) {
                case HIGH:
                    itemView.setBackground(ContextCompat.getDrawable(context, R.drawable.bg_red_alert));
                    alertIcon.setColorFilter(ContextCompat.getColor(context, R.color.red_500));
                    alertTitleText.setTextColor(ContextCompat.getColor(context, R.color.red_400));
                    alertDescriptionText.setTextColor(ContextCompat.getColor(context, R.color.red_300));
                    break;
                case MEDIUM:
                    itemView.setBackground(ContextCompat.getDrawable(context, R.drawable.bg_amber_alert));
                    alertIcon.setColorFilter(ContextCompat.getColor(context, R.color.amber_500));
                    alertTitleText.setTextColor(ContextCompat.getColor(context, R.color.amber_400));
                    alertDescriptionText.setTextColor(ContextCompat.getColor(context, R.color.amber_300));
                    break;
                case LOW:
                    itemView.setBackground(ContextCompat.getDrawable(context, R.drawable.bg_cyan_alert));
                    alertIcon.setColorFilter(ContextCompat.getColor(context, R.color.cyan_500));
                    alertTitleText.setTextColor(ContextCompat.getColor(context, R.color.cyan_400));
                    alertDescriptionText.setTextColor(ContextCompat.getColor(context, R.color.cyan_300));
                    break;
            }
        }
    }
}

