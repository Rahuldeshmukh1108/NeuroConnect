import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Eye,
  Hand,
  Type,
  Palette,
  Volume2,
  Keyboard,
  Monitor,
  Users,
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  Settings,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function AccessibilityPage() {
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
            <h1 className="text-4xl font-bold">Accessibility Statement</h1>
            <p className="text-xl text-muted-foreground">
              We are committed to ensuring digital accessibility for people of all abilities, including neurodivergent
              individuals.
            </p>
            <Badge variant="secondary" className="text-sm">
              Effective Date: January 1, 2024
            </Badge>
          </div>

          {/* Our Commitment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Eye className="mr-3 h-6 w-6 text-primary" />
                Our Commitment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg leading-relaxed">
                At <strong>NeuroConnect</strong>, we believe that everyone should be able to access, navigate, and
                engage with our content and features in a way that best suits their needs. We are committed to making
                our website and services inclusive for people with visual, auditory, motor, cognitive disabilities, and
                neurodivergent individuals.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Universal Design</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    We design with accessibility in mind from the start, not as an afterthought.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Inclusive Community</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">
                    Our platform celebrates neurodiversity and provides tools for everyone to thrive.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accessibility Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Settings className="mr-3 h-6 w-6 text-primary" />
                Accessibility Features
              </CardTitle>
              <CardDescription>
                We strive to make our website and services inclusive by implementing the following features:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="flex items-center font-semibold">
                    <Palette className="mr-2 h-5 w-5 text-primary" />
                    Visual Accessibility
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>High contrast color schemes</li>
                    <li>Adjustable font sizes (small, medium, large)</li>
                    <li>Dark and light mode options</li>
                    <li>Clear, readable fonts and layouts</li>
                    <li>Proper color contrast ratios (WCAG AA compliant)</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center font-semibold">
                    <Keyboard className="mr-2 h-5 w-5 text-primary" />
                    Navigation & Interaction
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Full keyboard navigation support</li>
                    <li>Skip links for main content</li>
                    <li>Focus indicators for interactive elements</li>
                    <li>Consistent navigation patterns</li>
                    <li>Logical tab order throughout the site</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center font-semibold">
                    <Monitor className="mr-2 h-5 w-5 text-primary" />
                    Screen Reader Support
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Semantic HTML structure</li>
                    <li>Proper ARIA labels and attributes</li>
                    <li>Descriptive alt text for images</li>
                    <li>Screen reader friendly forms</li>
                    <li>Meaningful heading hierarchy</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center font-semibold">
                    <Volume2 className="mr-2 h-5 w-5 text-primary" />
                    Audio & Motion
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Option to reduce motion and animations</li>
                    <li>No auto-playing audio or video</li>
                    <li>Captions for video content</li>
                    <li>Audio descriptions when available</li>
                    <li>Customizable sound settings</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features for Neurodivergent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Brain className="mr-3 h-6 w-6 text-primary" />
                Features for Neurodivergent Users
              </CardTitle>
              <CardDescription>
                To create a sensory-friendly and inclusive experience, we offer specialized features:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="flex items-center font-semibold">
                    <Eye className="mr-2 h-5 w-5 text-primary" />
                    Sensory-Friendly Design
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Minimalist, distraction-free modes</li>
                    <li>Reduced visual clutter and noise</li>
                    <li>Calming color palettes</li>
                    <li>Consistent, predictable layouts</li>
                    <li>Optional simplified interfaces</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center font-semibold">
                    <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                    Communication Options
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Personal chat for one-on-one conversations</li>
                    <li>Anonymous chat for privacy and comfort</li>
                    <li>Group chat for community interaction</li>
                    <li>Customizable notification settings</li>
                    <li>Text-based communication preferences</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center font-semibold">
                    <Type className="mr-2 h-5 w-5 text-primary" />
                    Cognitive Support
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Clear, simple language and instructions</li>
                    <li>Visual cues and icons for navigation</li>
                    <li>Progress indicators for multi-step processes</li>
                    <li>Customizable task organization tools</li>
                    <li>Memory aids and reminders</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="flex items-center font-semibold">
                    <Globe className="mr-2 h-5 w-5 text-primary" />
                    Personalization
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Multiple language support</li>
                    <li>Customizable interface preferences</li>
                    <li>Adaptive content based on user needs</li>
                    <li>Flexible interaction methods</li>
                    <li>Personal accessibility profiles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Standards Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Monitor className="mr-3 h-6 w-6 text-primary" />
                Standards Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We follow established accessibility guidelines and standards:</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200">WCAG 2.1</h3>
                  <p className="text-purple-700 dark:text-purple-300 text-sm">Level AA Compliance</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">Section 508</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">Federal Standards</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                  <h3 className="font-semibold text-green-800 dark:text-green-200">ADA</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm">Compliance Ready</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ongoing Improvements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <RefreshCw className="mr-3 h-6 w-6 text-primary" />
                Ongoing Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We are committed to continuous improvement of our accessibility features:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Regular testing with real users, including those with disabilities</li>
                <li>Automated accessibility testing integrated into our development process</li>
                <li>Quarterly accessibility audits by third-party experts</li>
                <li>User feedback integration for accessibility improvements</li>
                <li>Staff training on accessibility best practices</li>
                <li>Collaboration with disability advocacy organizations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Assistive Technology Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Hand className="mr-3 h-6 w-6 text-primary" />
                Assistive Technology Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Our platform is designed to work with various assistive technologies:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Screen Readers</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>JAWS (Windows)</li>
                    <li>NVDA (Windows)</li>
                    <li>VoiceOver (macOS/iOS)</li>
                    <li>TalkBack (Android)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Other Tools</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                    <li>Voice recognition software</li>
                    <li>Switch navigation devices</li>
                    <li>Eye-tracking systems</li>
                    <li>Alternative keyboards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Users className="mr-3 h-6 w-6 text-primary" />
                Your Feedback Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                If you experience any accessibility issues or have suggestions for improvement, please reach out to us.
                We value your feedback and will work to address any barriers you encounter.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Contact Methods</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      accessibility@neuroconnect.com
                    </p>
                    <p className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      1-800-NEURO-HELP
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Response Time</h3>
                  <p className="text-muted-foreground text-sm">
                    We aim to respond to accessibility inquiries within 2 business days and will work with you to find
                    solutions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <Link href="mailto:accessibility@neuroconnect.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Report an Issue
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Accessibility Settings
                  </Link>
                </Button>
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
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
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
