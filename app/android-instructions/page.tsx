"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Code, Smartphone } from "lucide-react"
import Link from "next/link"
import { AndroidLayout } from "@/components/android-layout"

export default function AndroidInstructionsPage() {
  return (
    <AndroidLayout hideNav>
      <div className="flex flex-col min-h-[calc(100dvh-32px)] bg-gray-950 text-white">
        <header className="p-4 flex items-center border-b border-cyan-900">
          <Link href="/dashboard" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-cyan-400" />
          </Link>
          <div className="flex items-center">
            <Smartphone className="w-6 h-6 text-cyan-400 mr-2" />
            <h1 className="text-xl font-bold text-cyan-400">Android Instructions</h1>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <Card className="bg-gray-900 border-cyan-900 mb-4">
            <CardHeader>
              <CardTitle className="text-cyan-400 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Converting to Android App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-200">
                This web app can be converted to a native Android app using WebView. Here are the steps:
              </p>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-cyan-400">1. Create a new Android Studio project</h3>
                <p className="text-sm text-gray-300">
                  Open Android Studio and create a new project with an Empty Activity.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-cyan-400">2. Add WebView to your layout</h3>
                <div className="bg-gray-800 p-3 rounded-md text-sm font-mono text-gray-200 overflow-x-auto">
                  {`<WebView
    android:id="@+id/webview"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />`}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-cyan-400">3. Configure WebView in MainActivity</h3>
                <div className="bg-gray-800 p-3 rounded-md text-sm font-mono text-gray-200 overflow-x-auto">
                  {`WebView webView = findViewById(R.id.webview);
WebSettings webSettings = webView.getSettings();
webSettings.setJavaScriptEnabled(true);
webSettings.setDomStorageEnabled(true);

// Enable geolocation
webView.setWebChromeClient(new WebChromeClient() {
    @Override
    public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
        callback.invoke(origin, true, false);
    }
});

// Load the web app
webView.loadUrl("https://your-flood-guard-app.vercel.app");`}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-cyan-400">4. Add required permissions</h3>
                <p className="text-sm text-gray-300">Add these permissions to your AndroidManifest.xml:</p>
                <div className="bg-gray-800 p-3 rounded-md text-sm font-mono text-gray-200 overflow-x-auto">
                  {`<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_CO  />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.SEND_SMS" />`}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-cyan-400">5. Handle device back button</h3>
                <div className="bg-gray-800 p-3 rounded-md text-sm font-mono text-gray-200 overflow-x-auto">
                  {`@Override
public void onBackPressed() {
    if (webView.canGoBack()) {
        webView.goBack();
    } else {
        super.onBackPressed();
    }
}`}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-cyan-400">6. Add native functionality</h3>
                <p className="text-sm text-gray-300">
                  You can add JavaScript interfaces to enable communication between the web app and native Android code:
                </p>
                <div className="bg-gray-800 p-3 rounded-md text-sm font-mono text-gray-200 overflow-x-auto">
                  {`// In MainActivity.java
class WebAppInterface {
    Context mContext;

    WebAppInterface(Context c) {
        mContext = c;
    }

    @JavascriptInterface
    public void sendSMS(String phoneNumber, String message) {
        SmsManager smsManager = SmsManager.getDefault();
        smsManager.sendTextMessage(phoneNumber, null, message, null, null);
        Toast.makeText(mContext, "SOS SMS sent", Toast.LENGTH_SHORT).show();
    }
}

// Add the interface to the WebView
webView.addJavascriptInterface(new WebAppInterface(this), "Android");`}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-cyan-400">7. Build and deploy</h3>
                <p className="text-sm text-gray-300">
                  Build your Android app and deploy it to the Google Play Store or distribute it directly to users.
                </p>
              </div>

              <div className="mt-6 p-3 bg-cyan-900/30 border border-cyan-700 rounded-md text-cyan-200 text-sm">
                <p className="font-medium">Note:</p>
                <p className="mt-1">
                  For a production app, you should consider implementing offline functionality, push notifications, and
                  better integration with native device features.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AndroidLayout>
  )
}

