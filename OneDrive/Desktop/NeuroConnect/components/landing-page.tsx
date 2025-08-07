"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Users,
  Briefcase,
  Calendar,
  Gamepad2,
  Search,
  Star,
  ArrowRight,
  Heart,
  Shield,
  Zap,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

const features = [
  {
    icon: Search,
    title: "Scheme Finder",
    description: "Discover personalized government and private schemes tailored to your needs and location.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    icon: Calendar,
    title: "Kanban Productivity",
    description: "Organize your tasks with an intuitive drag-and-drop kanban board designed for neurodivergent minds.",
    color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
  },
  {
    icon: Briefcase,
    title: "Job Portal",
    description: "Find inclusive job opportunities or post positions with neurodiversity-friendly employers.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Connect with like-minded individuals in supportive communities with real-time chat.",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
  },
  {
    icon: Gamepad2,
    title: "Brain Games",
    description: "Enhance cognitive abilities with engaging, accessible games designed for neurodivergent users.",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Developer",
    content:
      "NeuroConnect helped me find the perfect remote job that accommodates my ADHD. The community support is incredible!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Graphic Designer",
    content:
      "The kanban board is exactly what I needed to manage my projects. The sensory-friendly design makes all the difference.",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Student",
    content:
      "I discovered several scholarships through the scheme finder that I never knew existed. This platform is life-changing!",
    rating: 5,
  },
]

const faqs = [
  {
    question: "Is NeuroConnect free to use?",
    answer:
      "Yes! NeuroConnect is completely free for all users. We believe in making accessibility tools available to everyone.",
  },
  {
    question: "How do you ensure the platform is accessible?",
    answer:
      "We follow WCAG 2.1 AA guidelines, offer multiple font sizes, dark/light modes, keyboard navigation, screen reader support, and sensory-friendly design elements.",
  },
  {
    question: "Can I use NeuroConnect if I'm not neurodivergent?",
    answer:
      "While designed with neurodivergent individuals in mind, our platform benefits anyone looking for accessible, user-friendly productivity and community tools.",
  },
  {
    question: "How do you protect my privacy?",
    answer:
      "We use industry-standard encryption, never sell your data, and give you full control over your privacy settings. Your information is always secure.",
  },
  {
    question: "What types of jobs are available on the platform?",
    answer:
      "We feature a wide range of opportunities from neurodiversity-friendly employers, including remote work, flexible schedules, and positions across various industries.",
  },
]

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">NeuroConnect</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Stories
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <AccessibilityControls />
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <AccessibilityControls />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Stories
                </Link>
                <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Heart className="h-4 w-4 mr-2" />
                  Empowering Every Mind
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Your Journey to <span className="text-primary">Success</span> Starts Here
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  A comprehensive platform designed specifically for neurodivergent individuals, offering personalized
                  schemes, productivity tools, job opportunities, and a supportive community—all in an accessible,
                  sensory-friendly environment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Explore Features
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Job Placements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-3xl p-8 backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Tasks Completed</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">24</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Schemes Found</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">12</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Jobs Applied</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">8</div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Games Played</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">15</div>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Zap className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">Everything You Need in One Place</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of tools is designed to support your unique journey, providing accessibility,
              functionality, and community in perfect harmony.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="w-fit mx-auto">
              <Users className="h-4 w-4 mr-2" />
              User Stories
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">Real Stories, Real Impact</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Hear from our community members about how NeuroConnect has transformed their lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-base leading-relaxed">"{testimonial.content}"</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-3xl lg:text-5xl font-bold">Ready to Start Your Journey?</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Join thousands of neurodivergent individuals who have found their path to success. Your unique mind
                deserves the right tools and community.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/learn-more">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  Learn More
                </Button>
              </Link>
            </motion.div>

            <div className="flex items-center justify-center space-x-8 pt-8 opacity-80">
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
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Got questions? We've got answers. Find everything you need to know about NeuroConnect.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">NeuroConnect</span>
              </div>
              <p className="text-muted-foreground">
                Empowering neurodivergent individuals with accessible tools, supportive communities, and opportunities
                for growth.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Platform</h3>
              <div className="space-y-2">
                <Link href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <Link
                  href="/auth/signup"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/signin"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/learn-more"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2">
                <Link href="#faq" className="block text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
                <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
                <Link href="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link
                  href="/accessibility"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Accessibility
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 NeuroConnect. All rights reserved. Made with ❤️ for the neurodivergent community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
