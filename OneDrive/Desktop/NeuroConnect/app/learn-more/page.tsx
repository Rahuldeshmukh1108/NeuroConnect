import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Search,
  Calendar,
  Briefcase,
  Users,
  Gamepad2,
  Settings,
  Heart,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="h-10 w-10 text-primary" />
              <span className="text-3xl font-bold">NeuroConnect</span>
            </div>
            <h1 className="text-5xl font-bold">Why Join NeuroConnect?</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're building a safe, empowering space where neurodivergent individuals can thrive, connect, and achieve
              their goals with the right tools and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Key Benefits */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Built for Your Success</h2>
                <p className="text-lg text-muted-foreground">
                  Every feature is designed with neurodivergent minds in mind, creating an inclusive environment where
                  you can be your authentic self.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Inclusive by Design</h3>
                  <p className="text-muted-foreground">
                    Every feature considers different cognitive styles, sensory needs, and communication preferences.
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Safe & Supportive</h3>
                  <p className="text-muted-foreground">
                    A judgment-free environment with moderated communities and privacy controls you can trust.
                  </p>
                </div>

                <div className="text-center space-y-3">
                  <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Empowering Tools</h3>
                  <p className="text-muted-foreground">
                    Practical tools that help you organize, connect, learn, and achieve your personal and professional
                    goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Features */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Everything You Need in One Place</h2>
              <p className="text-lg text-muted-foreground">
                Discover how each feature is designed to support your unique journey
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Scheme Finder */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 p-3 rounded-lg">
                      <Search className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Scheme Finder</CardTitle>
                      <CardDescription>Discover personalized opportunities</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Find government and private schemes tailored to your specific neurodivergent condition, location,
                    and needs. Our smart search filters through thousands of opportunities to match you with relevant
                    support.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Location-based filtering
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Condition-specific results
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Bookmark and track applications
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Kanban Productivity */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 p-3 rounded-lg">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Kanban Productivity</CardTitle>
                      <CardDescription>Organize tasks your way</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Visual task management with drag-and-drop functionality. Break down complex projects into manageable
                    steps with priority levels, reminders, and progress tracking.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Visual task organization
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Priority and reminder system
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Customizable workflows
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Portal */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 p-3 rounded-lg">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Job Portal</CardTitle>
                      <CardDescription>Find inclusive opportunities</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect with neurodiversity-friendly employers. Whether you're seeking opportunities or posting
                    positions, our platform facilitates meaningful connections in inclusive workplaces.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Neurodiversity-friendly employers
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Skills-based matching
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Interview scheduling tools
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Community Hub */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 p-3 rounded-lg">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Community Hub</CardTitle>
                      <CardDescription>Connect and belong</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Join supportive communities with real-time chat. Choose from personal conversations, anonymous
                    discussions, or group chats based on your comfort level and interests.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Multiple communication options
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Anonymous posting available
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Moderated safe spaces
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Brain Games */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300 p-3 rounded-lg">
                      <Gamepad2 className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Brain Games</CardTitle>
                      <CardDescription>Enhance cognitive abilities</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Engaging, accessible games designed to boost cognitive skills. Track your progress and enjoy fun
                    challenges that adapt to your learning style and preferences.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Cognitive skill development
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Progress tracking
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Sensory-friendly design
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Accessibility Features */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300 p-3 rounded-lg">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Accessibility Features</CardTitle>
                      <CardDescription>Customize your experience</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Comprehensive accessibility options including font size adjustment, language switching, dark/light
                    mode, reduced motion, and high contrast settings.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Multiple font sizes and themes
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Language support
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      Screen reader compatibility
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Success Stories */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Real Stories, Real Impact</h2>
                <p className="text-lg text-muted-foreground">
                  See how NeuroConnect is making a difference in people's lives
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "NeuroConnect helped me find the perfect remote job that accommodates my ADHD. The community support
                    is incredible!"
                  </p>
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">Software Developer</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "The kanban board is exactly what I needed to manage my projects. The sensory-friendly design makes
                    all the difference."
                  </p>
                  <div className="font-semibold">Marcus Johnson</div>
                  <div className="text-sm text-muted-foreground">Graphic Designer</div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "I discovered several scholarships through the scheme finder that I never knew existed. This
                    platform is life-changing!"
                  </p>
                  <div className="font-semibold">Emma Rodriguez</div>
                  <div className="text-sm text-muted-foreground">Student</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Growing Community</h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of neurodivergent individuals on their journey to success
                </p>
              </div>

              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-muted-foreground">Active Users</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">Job Placements</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">1,200+</div>
                  <div className="text-muted-foreground">Schemes Found</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-muted-foreground">Satisfaction Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose NeuroConnect */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Why Choose NeuroConnect?</h2>
                <p className="text-lg text-muted-foreground">
                  We understand the unique challenges and strengths of neurodivergent individuals
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Designed for You</h3>
                      <p className="text-muted-foreground">
                        Every feature considers different cognitive styles, sensory preferences, and communication
                        needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Safe & Private</h3>
                      <p className="text-muted-foreground">
                        Your data is protected, communities are moderated, and you control your privacy settings.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Always Free</h3>
                      <p className="text-muted-foreground">
                        Core features are completely free because we believe accessibility tools should be available to
                        everyone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Supportive Community</h3>
                      <p className="text-muted-foreground">
                        Connect with others who understand your journey and celebrate your unique strengths.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Practical Tools</h3>
                      <p className="text-muted-foreground">
                        Real solutions for real challenges - from job searching to daily organization and skill
                        building.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Built with Love</h3>
                      <p className="text-muted-foreground">
                        Created by and for the neurodivergent community with genuine care and understanding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of neurodivergent individuals who have found their path to success. Your unique mind
                deserves the right tools and community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                  asChild
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 opacity-80">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <span>Always Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Supportive Community</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Navigation */}
          <div className="text-center pt-8 border-t">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="text-primary hover:underline">
                Accessibility Statement
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
