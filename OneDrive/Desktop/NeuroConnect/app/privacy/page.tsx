import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, Users, Lock, Globe, Cookie, UserCheck, RefreshCw, Mail } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">NeuroConnect</span>
            </div>
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground">
              Your privacy is extremely important to us. This policy outlines how we collect, use, and protect your
              information.
            </p>
            <Badge variant="secondary" className="text-sm">
              Effective Date: January 1, 2024
            </Badge>
          </div>

          {/* Introduction */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">
                Welcome to <strong>NeuroConnect</strong>, a platform designed to empower neurodivergent individuals
                through personalized tools, inclusive communities, and accessible experiences. Your privacy is extremely
                important to us. This Privacy Policy outlines how we collect, use, disclose, and safeguard your
                information.
              </p>
            </CardContent>
          </Card>

          {/* Section 1: Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Brain className="mr-3 h-6 w-6 text-primary" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">a. Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Name and email address</li>
                  <li>Age or date of birth</li>
                  <li>Profile image (if uploaded)</li>
                  <li>Language and accessibility preferences</li>
                  <li>Location information (for scheme matching)</li>
                  <li>Skills and professional information (for job matching)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">b. Usage Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Pages visited and features used</li>
                  <li>Time spent on the app</li>
                  <li>Interaction with communities, games, and tools</li>
                  <li>Search queries and preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">c. Device & Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Approximate location (for relevant content)</li>
                  <li>Accessibility settings and preferences</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="mr-3 h-6 w-6 text-primary" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We use the collected information to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide personalized content and experiences</li>
                <li>Improve accessibility and sensory-friendly options</li>
                <li>Match users with relevant jobs, communities, or schemes</li>
                <li>Enable safe communication and interaction</li>
                <li>Monitor and improve app performance</li>
                <li>Send important updates and notifications (with your consent)</li>
                <li>Provide customer support and respond to inquiries</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3: How We Share Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="mr-3 h-6 w-6 text-primary" />
                3. How We Share Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="font-semibold text-green-800 dark:text-green-200">
                  We do not sell your personal data to third parties.
                </p>
              </div>

              <p>We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Service providers (e.g., hosting providers, analytics services)</li>
                <li>Law enforcement if required by law</li>
                <li>Community moderators to ensure safe and respectful communication</li>
                <li>Job recruiters (only with your explicit consent and control)</li>
                <li>Other users in communities (only information you choose to share)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4: Your Control & Choices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <UserCheck className="mr-3 h-6 w-6 text-primary" />
                4. Your Control & Choices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">You have full control over your data. You can:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Update your profile and preferences at any time</li>
                <li>Change language, theme, and font settings</li>
                <li>Delete your account and data permanently</li>
                <li>Choose who can interact with you (personal vs. public chat)</li>
                <li>Opt out of non-essential communications</li>
                <li>Download a copy of your data</li>
                <li>Control your visibility in job searches and communities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5: Data Protection and Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Lock className="mr-3 h-6 w-6 text-primary" />
                5. Data Protection and Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We take comprehensive steps to protect your data using:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>End-to-end encryption for private messages</li>
                <li>Secure authentication methods and password protection</li>
                <li>Regular security audits and monitoring</li>
                <li>Data minimization practices</li>
                <li>Secure data storage with reputable cloud providers</li>
                <li>Employee training on data protection</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: International Data Transfer */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="mr-3 h-6 w-6 text-primary" />
                6. International Data Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your data may be stored on servers located outside your country. We ensure that all transfers meet
                international data protection standards, including GDPR and other applicable regulations. We use
                appropriate safeguards such as standard contractual clauses and adequacy decisions.
              </p>
            </CardContent>
          </Card>

          {/* Section 7: Cookies and Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Cookie className="mr-3 h-6 w-6 text-primary" />
                7. Cookies and Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We use cookies and analytics tools to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                <li>Remember your preferences and settings</li>
                <li>Improve your user experience</li>
                <li>Analyze usage patterns and performance</li>
                <li>Provide personalized content</li>
              </ul>
              <p className="text-muted-foreground">
                You can manage or disable cookies in your browser settings. However, some features may not work properly
                without cookies.
              </p>
            </CardContent>
          </Card>

          {/* Section 8: Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <UserCheck className="mr-3 h-6 w-6 text-primary" />
                8. Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We do not knowingly collect personal information from users under the age of 13 without verifiable
                parental consent. If we become aware that we have collected personal information from a child under 13,
                we will take steps to delete such information promptly.
              </p>
            </CardContent>
          </Card>

          {/* Section 9: Updates to This Policy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <RefreshCw className="mr-3 h-6 w-6 text-primary" />
                9. Updates to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy occasionally to reflect changes in our practices or legal
                requirements. We'll notify you about significant changes through the app, via email, or by posting a
                notice on our website. The "Last updated" date at the top of this policy indicates when it was last
                revised.
              </p>
            </CardContent>
          </Card>

          {/* Section 10: Contact Us */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Mail className="mr-3 h-6 w-6 text-primary" />
                10. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have any questions or concerns regarding this Privacy Policy, please reach out to us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email: privacy@neuroconnect.com
                </p>
                <p className="flex items-center">
                  <Globe className="mr-2 h-4 w-4" />
                  Website: https://neuroconnect.com
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Navigation */}
          <div className="text-center pt-8 border-t">
            <p className="text-muted-foreground mb-4">Last updated: January 1, 2024</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-primary hover:underline">
                Accessibility Statement
              </Link>
              <Link href="/learn-more" className="text-primary hover:underline">
                Learn More
              </Link>
              <Link href="/" className="text-primary hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
