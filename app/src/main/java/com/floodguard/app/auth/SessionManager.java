package com.floodguard.app.auth;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;

import java.util.HashMap;

public class SessionManager {
    // Shared Preferences
    SharedPreferences pref;
    
    // Editor for Shared preferences
    Editor editor;
    
    // Context
    Context _context;
    
    // Shared pref mode
    int PRIVATE_MODE = 0;
    
    // Sharedpref file name
    private static final String PREF_NAME = "FloodGuardPref";
    
    // All Shared Preferences Keys
    private static final String IS_LOGIN = "IsLoggedIn";
    
    // User name (make variable public to access from outside)
    public static final String KEY_NAME = "name";
    
    // Email address (make variable public to access from outside)
    public static final String KEY_EMAIL = "email";
    
    // Mobile number
    public static final String KEY_MOBILE = "mobile";
    
    // Location permission
    public static final String KEY_LOCATION_PERMISSION = "location_permission";
    
    // SMS permission
    public static final String KEY_SMS_PERMISSION = "sms_permission";
    
    // User ID
    public static final String KEY_USER_ID = "user_id";
    
    // Constructor
    public SessionManager(Context context) {
        this._context = context;
        pref = _context.getSharedPreferences(PREF_NAME, PRIVATE_MODE);
        editor = pref.edit();
    }
    
    /**
     * Create login session
     * */
    public void createLoginSession(String userId, String name, String mobile, String email, 
                                  boolean locationPermission, boolean smsPermission) {
        // Storing login value as TRUE
        editor.putBoolean(IS_LOGIN, true);
        
        // Storing user details in pref
        editor.putString(KEY_USER_ID, userId);
        editor.putString(KEY_NAME, name);
        editor.putString(KEY_MOBILE, mobile);
        editor.putString(KEY_EMAIL, email);
        editor.putBoolean(KEY_LOCATION_PERMISSION, locationPermission);
        editor.putBoolean(KEY_SMS_PERMISSION, smsPermission);
        
        // commit changes
        editor.commit();
    }
    
    /**
     * Get stored session data
     * */
    public HashMap<String, String> getUserDetails() {
        HashMap<String, String> user = new HashMap<String, String>();
        
        user.put(KEY_USER_ID, pref.getString(KEY_USER_ID, null));
        user.put(KEY_NAME, pref.getString(KEY_NAME, null));
        user.put(KEY_EMAIL, pref.getString(KEY_EMAIL, null));
        user.put(KEY_MOBILE, pref.getString(KEY_MOBILE, null));
        
        return user;
    }
    
    /**
     * Get location permission
     * */
    public boolean getLocationPermission() {
        return pref.getBoolean(KEY_LOCATION_PERMISSION, false);
    }
    
    /**
     * Get SMS permission
     * */
    public boolean getSmsPermission() {
        return pref.getBoolean(KEY_SMS_PERMISSION, false);
    }
    
    /**
     * Update user details
     * */
    public void updateUserDetails(String name, String mobile, String email, 
                                 boolean locationPermission, boolean smsPermission) {
        editor.putString(KEY_NAME, name);
        editor.putString(KEY_MOBILE, mobile);
        editor.putString(KEY_EMAIL, email);
        editor.putBoolean(KEY_LOCATION_PERMISSION, locationPermission);
        editor.putBoolean(KEY_SMS_PERMISSION, smsPermission);
        
        // commit changes
        editor.commit();
    }
    
    /**
     * Clear session details
     * */
    public void logoutUser() {
        // Clearing all data from Shared Preferences
        editor.clear();
        editor.commit();
    }
    
    /**
     * Quick check for login
     * **/
    public boolean isLoggedIn() {
        return pref.getBoolean(IS_LOGIN, false);
    }
}

