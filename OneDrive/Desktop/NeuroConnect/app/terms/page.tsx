import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, FileText, User, MessageSquare, Shield, Copyright, Settings, Scale, Mail } from "lucide-react"
import Link from "next/link"

export default function TermsOfServicePage() {
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
            <h1 className="text-4xl font-bold">Terms of Service</h1>
            <p className="text-xl text-muted-foreground">
              These terms govern your access to and use of our platform, services, and content.
            </p>
            <Badge variant="secondary" className="text-sm">
              Effective Date: January 1, 2024
            </Badge>
          </div>

          {/* Introduction */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed">
                Welcome to <strong>NeuroConnect</strong>! These Terms of Service ("Terms") govern your access to and use
                of our platform, services, and content. By accessing or using our website and services, you agree to
                comply with and be bound by these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 1: Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <FileText className="mr-3 h-6 w-6 text-primary" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By using our services, you agree to be legally bound by these Terms. If you do not agree with any part
                of these terms, please do not use our platform. Your continued use of the service constitutes acceptance
                of any updates to these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Use of Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <User className="mr-3 h-6 w-6 text-primary" />
                2. Use of Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To use our platform, you must:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Be at least 13 years old (or have parental consent)</li>
                <li>Provide accurate and complete information when creating an account</li>
                <li>Keep your account information up to date</li>
                <li>Be responsible for all activities that occur under your account</li>
                <li>Ensure your use complies with all applicable laws and regulations</li>
                <li>Respect the rights and dignity of other users</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3: User Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <MessageSquare className="mr-3 h-6 w-6 text-primary" />
                3. User Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Regarding content you post on our platform:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>You retain ownership of any content you post</li>
                <li>
                  You grant us a non-exclusive, royalty-free license to use, display, and distribute your content on our
                  platform
                </li>
                <li>You are solely responsible for your content and any consequences of posting it</li>
                <li>You represent that you have the right to post the content</li>
                <li>We may remove content that violates these Terms or our community guidelines</li>
              </ul>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> We respect your privacy and will never use your personal content for commercial
                  purposes without your explicit consent.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Prohibited Conduct */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Shield className="mr-3 h-6 w-6 text-primary" />
                4. Prohibited Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Use the service for any unlawful purpose or in violation of any laws</li>
                <li>Post or share harmful, harassing, discriminatory, or misleading content</li>
                <li>Interfere with the security or functionality of the platform</li>
                <li>Attempt to gain unauthorized access to other users' accounts</li>
                <li>Spam, solicit, or send unsolicited communications</li>
                <li>Impersonate others or provide false information</li>
                <li>Violate the intellectual property rights of others</li>
                <li>Engage in any form of harassment or bullying</li>
                <li>Share content that is inappropriate for our neurodivergent community</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5: Account Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Settings className="mr-3 h-6 w-6 text-primary" />
                5. Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Account termination may occur under the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>We reserve the right to suspend or terminate your account if you violate these Terms</li>
                <li>You may delete your account at any time through your account settings</li>
                <li>We may terminate accounts that remain inactive for extended periods</li>
                <li>Upon termination, your access to the service will cease immediately</li>
                <li>We will make reasonable efforts to provide notice before termination when possible</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 6: Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Copyright className="mr-3 h-6 w-6 text-primary" />
                6. Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                All content and materials on our platform, excluding user content, are protected by intellectual
                property laws:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Our platform design, features, and functionality are our property</li>
                <li>Trademarks, logos, and brand elements are protected</li>
                <li>You may not copy, modify, or distribute our proprietary content</li>
                <li>We respect the intellectual property rights of others and expect users to do the same</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 7: Modifications to the Service */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Settings className="mr-3 h-6 w-6 text-primary" />
                7. Modifications to the Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may modify, update, or discontinue any part of the platform at any time, with or without notice. We
                strive to provide advance notice of significant changes that may affect your use of the service. We are
                not liable for any modifications, suspensions, or discontinuations of the service.
              </p>
            </CardContent>
          </Card>

          {/* Section 8: Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Scale className="mr-3 h-6 w-6 text-primary" />
                8. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To the fullest extent permitted by law:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid for the service</li>
                <li>We provide the service "as is" without warranties of any kind</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>You use the service at your own risk</li>
              </ul>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> Some jurisdictions do not allow certain limitations of liability, so some
                  of the above may not apply to you.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 9: Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Scale className="mr-3 h-6 w-6 text-primary" />
                9. Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms are governed by and construed in accordance with the laws of the United States and the State
                of California, without regard to conflict of law principles. Any disputes arising from these Terms or
                your use of the service will be resolved in the courts of California.
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
              <p className="mb-4">If you have any questions about these Terms, please contact us:</p>
              <div className="space-y-2 text-muted-foreground">
                <p className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Email: legal@neuroconnect.com
                </p>
                <p className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Support: support@neuroconnect.com
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Navigation */}
          <div className="text-center pt-8 border-t">
            <p className="text-muted-foreground mb-4">Last updated: January 1, 2024</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
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
