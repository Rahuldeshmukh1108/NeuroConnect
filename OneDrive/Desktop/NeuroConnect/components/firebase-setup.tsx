"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function FirebaseSetup() {
  const { toast } = useToast();

  // Check if all required env vars are set
  const firebaseEnvReady =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET &&
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Environment variable copied to clipboard",
    });
  };

  // Use your actual Firebase config from .env.local
  const envTemplate = `# Your Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your_api_key_here"}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your_auth_domain"}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your_project_id"}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your_storage_bucket"}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your_sender_id"}
NEXT_PUBLIC_FIREBASE_APP_ID=${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your_app_id"}
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || ""}
`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {firebaseEnvReady ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <span>Firebase Configured Successfully</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  <span>Firebase Configuration Required</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {firebaseEnvReady
                ? "Your Firebase environment variables are properly configured."
                : "Your Firebase configuration is missing or invalid. Please follow these steps to set it up."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!firebaseEnvReady && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Firebase environment variables are not properly configured. The authentication system cannot function
                  without these.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 1: Get Firebase Configuration</h3>
              <p className="text-sm text-muted-foreground">
                You need to get your Firebase web app configuration from the Firebase Console.
              </p>

              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    "https://console.firebase.google.com/project/neurodivergent-fdc88/settings/general",
                    "_blank"
                  )
                }
                className="bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Firebase Console
              </Button>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  1. Go to your Firebase project: <strong>neurodivergent-fdc88</strong>
                </p>
                <p>2. Click on "Project Settings" (gear icon)</p>
                <p>3. Scroll down to "Your apps" section</p>
                <p>4. Find your web app or create one if it doesn't exist</p>
                <p>5. Copy the configuration values</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Add Environment Variables</h3>
              <p className="text-sm text-muted-foreground">
                Create or update your <code className="bg-muted px-1 rounded">.env.local</code> file with these
                variables:
              </p>

              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">{envTemplate}</pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-background"
                  onClick={() => copyToClipboard(envTemplate)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Restart Development Server</h3>
              <p className="text-sm text-muted-foreground">
                After adding the environment variables, restart your development server:
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <code className="text-sm">npm run dev</code> or <code className="text-sm">yarn dev</code>
              </div>
            </div>

            {!firebaseEnvReady && (
              <Button onClick={() => window.location.reload()} className="w-full">
                I've Added the Environment Variables - Reload Page
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
