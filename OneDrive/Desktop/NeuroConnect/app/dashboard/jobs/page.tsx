"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Heart,
  Briefcase,
  Plus,
  Upload,
  User,
  Building,
  Mail,
  Phone,
  Link,
  MessageSquare,
  CalendarDays,
  UserCheck,
  UserX,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ChatDialog from "@/components/chat-dialog"
import InterviewScheduler from "@/components/interview-scheduler"

// --- Interfaces ---
interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  type: "full-time" | "part-time" | "contract" | "remote"
  description: string
  requirements: string[]
  tags: string[]
  postedDate: Date
  isRemote: boolean
  postedByUserId: string // To link job to a recruiter
}

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  location: string
  skills: string[]
  bio: string
  portfolio?: string
  resumeUrl?: string
  role?: UserRole // Added role to user profile
}

interface Application {
  id: string
  jobId: string
  seekerId: string
  status: "Pending" | "Reviewed" | "Shortlisted" | "Rejected" | "Interview Scheduled"
  appliedDate: Date
  coverLetter?: string
  interviewDetails?: {
    date: Date
    time: string
    link?: string
  }
}

type UserRole = "jobSeeker" | "recruiter"

// --- Mock Data (Replace with Firebase/API calls later) ---
const MOCK_CURRENT_USER_ID = "user-123" // Simulate a logged-in user ID

// Function to get initial mock data, parsing dates
const getInitialMockData = () => {
  if (typeof window === "undefined") {
    // Server-side rendering, return default mocks
    return {
      users: [
        {
          id: MOCK_CURRENT_USER_ID,
          name: "Jane Doe",
          email: "jane.doe@example.com",
          phone: "123-456-7890",
          location: "San Francisco, CA",
          skills: ["React", "TypeScript", "CSS", "Accessibility"],
          bio: "Passionate frontend developer with a focus on inclusive design.",
          portfolio: "https://janedoe.dev",
          resumeUrl: "/placeholder-resume.pdf",
          role: undefined, // Role will be set on first visit
        },
        {
          id: "seeker-456",
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "987-654-3210",
          location: "Remote",
          skills: ["Python", "SQL", "Data Analysis"],
          bio: "Experienced data analyst seeking flexible opportunities.",
          portfolio: "",
          resumeUrl: "/placeholder-resume-john.pdf",
          role: "jobSeeker",
        },
        {
          id: "recruiter-789",
          name: "Alice Johnson",
          email: "alice.johnson@example.com",
          phone: "555-111-2222",
          location: "New York, NY",
          skills: [],
          bio: "Hiring Manager at TechInclusive Corp.",
          portfolio: "",
          resumeUrl: "",
          role: "recruiter",
        },
      ],
      jobs: [
        {
          id: "job-1",
          title: "Frontend Developer (Neurodiversity Friendly)",
          company: "TechInclusive Corp",
          location: "San Francisco, CA",
          salary: "$70,000 - $90,000",
          type: "full-time",
          description:
            "We're looking for a passionate frontend developer to join our inclusive team. We provide accommodations and support for neurodivergent employees.",
          requirements: ["React", "TypeScript", "CSS", "Accessibility knowledge"],
          tags: ["React", "TypeScript", "Remote-friendly", "Inclusive"],
          postedDate: new Date("2024-01-15"),
          isRemote: true,
          postedByUserId: "recruiter-789",
        },
        {
          id: "job-2",
          title: "UX Designer - Accessibility Focus",
          company: "Design for All",
          location: "Remote",
          salary: "$60,000 - $80,000",
          type: "full-time",
          description:
            "Join our mission to create accessible digital experiences. Perfect for someone passionate about inclusive design.",
          requirements: ["Figma", "User Research", "Accessibility Guidelines", "Prototyping"],
          tags: ["UX", "Accessibility", "Remote", "Design"],
          postedDate: new Date("2024-01-20"),
          isRemote: true,
          postedByUserId: "recruiter-789",
        },
        {
          id: "job-3",
          title: "Data Analyst (Flexible Schedule)",
          company: "DataMind Solutions",
          location: "Austin, TX",
          salary: "$55,000 - $70,000",
          type: "part-time",
          description:
            "Flexible part-time position with accommodations for different working styles. Great for detail-oriented individuals.",
          requirements: ["Python", "SQL", "Excel", "Data Visualization"],
          tags: ["Data", "Python", "Flexible", "Part-time"],
          postedDate: new Date("2024-01-18"),
          isRemote: false,
          postedByUserId: "recruiter-789",
        },
        {
          id: "job-4",
          title: "Content Writer - Autism Advocacy",
          company: "Neurodiversity Network",
          location: "Remote",
          salary: "$40,000 - $55,000",
          type: "contract",
          description:
            "Write compelling content about neurodiversity and autism advocacy. Perfect for someone with lived experience.",
          requirements: ["Writing", "Research", "SEO", "Content Strategy"],
          tags: ["Writing", "Advocacy", "Remote", "Contract"],
          postedDate: new Date("2024-01-22"),
          isRemote: true,
          postedByUserId: "recruiter-789",
        },
      ],
      applications: [
        {
          id: "app-1",
          jobId: "job-1",
          seekerId: MOCK_CURRENT_USER_ID,
          status: "Pending",
          appliedDate: new Date("2024-01-25"),
          coverLetter: "I am very interested in this role...",
        },
        {
          id: "app-2",
          jobId: "job-2",
          seekerId: MOCK_CURRENT_USER_ID,
          status: "Reviewed",
          appliedDate: new Date("2024-01-26"),
          coverLetter: "My design philosophy aligns with your mission...",
        },
        {
          id: "app-3",
          jobId: "job-1",
          seekerId: "seeker-456",
          status: "Shortlisted",
          appliedDate: new Date("2024-01-27"),
          coverLetter: "I have extensive experience in frontend development...",
        },
      ],
      bookmarkedJobs: [],
    }
  }

  const parseDateObjects = (key: string, value: any) => {
    if (key === "postedDate" || key === "appliedDate" || key === "date") {
      return new Date(value)
    }
    return value
  }

  const storedUsers = localStorage.getItem("mockUsers")
  const storedJobs = localStorage.getItem("mockJobs")
  const storedApplications = localStorage.getItem("mockApplications")
  const storedBookmarkedJobs = localStorage.getItem("bookmarkedJobs")

  return {
    users: storedUsers ? JSON.parse(storedUsers) : [],
    jobs: storedJobs ? JSON.parse(storedJobs, parseDateObjects) : [],
    applications: storedApplications ? JSON.parse(storedApplications, parseDateObjects) : [],
    bookmarkedJobs: storedBookmarkedJobs ? JSON.parse(storedBookmarkedJobs) : [],
  }
}

export default function JobsPage() {
  // State for all mock data, now managed reactively
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => getInitialMockData().users)
  const [allJobs, setAllJobs] = useState<Job[]>(() => getInitialMockData().jobs)
  const [allApplications, setAllApplications] = useState<Application[]>(() => getInitialMockData().applications)
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>(() => getInitialMockData().bookmarkedJobs)

  // UI states
  const [isEditJobOpen, setIsEditJobOpen] = useState(false)
  const [jobToEdit, setJobToEdit] = useState<Job | null>(null)
  const [isViewApplicationOpen, setIsViewApplicationOpen] = useState(false)
  const [applicationToView, setApplicationToView] = useState<Application | null>(null)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [activeTab, setActiveTab] = useState("browse")
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]) // Derived from allApplications
  const [userProfile, setUserProfile] = useState<UserProfile>(
    allUsers.find((u) => u.id === MOCK_CURRENT_USER_ID) || {
      id: MOCK_CURRENT_USER_ID,
      name: "",
      email: "",
      phone: "",
      location: "",
      skills: [],
      bio: "",
      portfolio: "",
      resumeUrl: "",
      role: undefined,
    },
  )
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "full-time" as const,
    description: "",
    requirements: "",
    tags: "",
    isRemote: false,
  })
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isApplicantsDialogOpen, setIsApplicantsDialogOpen] = useState(false)
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<Job | null>(null)

  // Chat states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null)
  const [chatJob, setChatJob] = useState<Job | null>(null)

  // Interview Scheduler states
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false)
  const [schedulerJob, setSchedulerJob] = useState<Job | null>(null)
  const [schedulerApplicant, setSchedulerApplicant] = useState<UserProfile | null>(null)

  const { toast } = useToast()

  // Initialize user role and profile from localStorage on mount
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null
    const storedProfile = localStorage.getItem("userProfile")
    if (storedRole) {
      setUserRole(storedRole)
    }
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    } else {
      // If no profile, set a default one for the mock user
      const defaultProfile = allUsers.find((u) => u.id === MOCK_CURRENT_USER_ID)
      if (defaultProfile) {
        setUserProfile(defaultProfile)
        localStorage.setItem("userProfile", JSON.stringify(defaultProfile))
      }
    }
  }, [allUsers]) // Depend on allUsers to ensure profile is consistent

  // Update appliedJobs based on allApplications and current user
  useEffect(() => {
    setAppliedJobs(allApplications.filter((app) => app.seekerId === MOCK_CURRENT_USER_ID).map((app) => app.jobId))
  }, [allApplications])

  // Persist mock data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mockUsers", JSON.stringify(allUsers))
    localStorage.setItem("mockJobs", JSON.stringify(allJobs))
    localStorage.setItem("mockApplications", JSON.stringify(allApplications))
    localStorage.setItem("bookmarkedJobs", JSON.stringify(bookmarkedJobs))
  }, [allUsers, allJobs, allApplications, bookmarkedJobs])

  // Filter jobs for browsing
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation =
      locationFilter === "all" ||
      (locationFilter === "remote" && job.isRemote) ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase())

    const matchesType = typeFilter === "all" || job.type === typeFilter

    return matchesSearch && matchesLocation && matchesType
  })

  // Toggle bookmark functionality
  const toggleBookmarkJob = (jobId: string) => {
    setBookmarkedJobs((prev) => {
      const newBookmarks = prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
      toast({
        title: prev.includes(jobId) ? "Job removed from bookmarks" : "Job bookmarked",
        description: prev.includes(jobId)
          ? "Job removed from your bookmarked list"
          : "Job added to your bookmarked list",
      })
      return newBookmarks
    })
  }

  // Apply to job functionality
  const applyToJob = (jobId: string) => {
    if (!userProfile.name || !userProfile.email) {
      toast({
        title: "Complete your profile",
        description: "Please complete your profile before applying to jobs.",
        variant: "destructive",
      })
      setIsProfileOpen(true)
      return
    }

    // Simulate API call to save application
    setTimeout(() => {
      const newApplication: Application = {
        id: `app-${Date.now()}`,
        jobId,
        seekerId: MOCK_CURRENT_USER_ID,
        status: "Pending",
        appliedDate: new Date(),
      }
      setAllApplications((prev) => [...prev, newApplication]) // Update state
      toast({
        title: "Application submitted",
        description: "Your job application has been submitted successfully!",
      })
    }, 500)
  }

  // Post job functionality (Recruiter)
  const postJob = () => {
    if (!newJob.title || !newJob.company || !newJob.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call to save job
    setTimeout(() => {
      const jobToPost: Job = {
        id: `job-${Date.now()}`,
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        salary: newJob.salary,
        type: newJob.type,
        description: newJob.description,
        requirements: newJob.requirements
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: newJob.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        postedDate: new Date(),
        isRemote: newJob.isRemote,
        postedByUserId: MOCK_CURRENT_USER_ID, // Associate with current recruiter
      }
      setAllJobs((prev) => [...prev, jobToPost]) // Update state
      toast({
        title: "Job posted successfully",
        description: "Your job listing has been published and is now visible to candidates.",
      })

      setNewJob({
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "full-time",
        description: "",
        requirements: "",
        tags: "",
        isRemote: false,
      })
      setActiveTab("my-jobs") // Switch to my jobs tab after posting
    }, 500)
  }

  // Handle opening edit job dialog
  const handleEditJob = (job: Job) => {
    setJobToEdit(job)
    setNewJob({
      // Pre-fill the form with existing job data
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      description: job.description,
      requirements: job.requirements.join(", "),
      tags: job.tags.join(", "),
      isRemote: job.isRemote,
    })
    setIsEditJobOpen(true)
  }

  // Update job functionality (Recruiter)
  const updateJob = () => {
    if (!jobToEdit || !newJob.title || !newJob.company || !newJob.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Simulate API call to update job
    setTimeout(() => {
      setAllJobs((prev) =>
        prev.map((j) =>
          j.id === jobToEdit.id
            ? {
                ...j,
                title: newJob.title,
                company: newJob.company,
                location: newJob.location,
                salary: newJob.salary,
                type: newJob.type,
                description: newJob.description,
                requirements: newJob.requirements
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                tags: newJob.tags
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                isRemote: newJob.isRemote,
              }
            : j,
        ),
      )
      toast({
        title: "Job updated successfully",
        description: "Your job listing has been updated.",
      })
      setIsEditJobOpen(false)
      setJobToEdit(null)
      setNewJob({
        // Reset newJob state
        title: "",
        company: "",
        location: "",
        salary: "",
        type: "full-time",
        description: "",
        requirements: "",
        tags: "",
        isRemote: false,
      })
    }, 500)
  }

  // Update profile functionality
  const updateProfile = () => {
    // Simulate API call to update profile
    setTimeout(() => {
      setAllUsers((prev) => prev.map((u) => (u.id === MOCK_CURRENT_USER_ID ? { ...userProfile, role: u.role } : u))) // Update state
      localStorage.setItem("userProfile", JSON.stringify(userProfile)) // Persist profile
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
      setIsProfileOpen(false)
    }, 500)
  }

  // Handle opening view application dialog
  const handleViewApplication = (application: Application) => {
    setApplicationToView(application)
    setIsViewApplicationOpen(true)
  }

  // Recruiter actions on applicants
  const handleApplicantAction = (
    applicationId: string,
    action: "Shortlist" | "Reject" | "Message" | "Schedule Interview",
    job: Job,
    applicant: UserProfile,
  ) => {
    setAllApplications((prev) =>
      prev.map((app) => {
        if (app.id === applicationId) {
          let newStatus = app.status
          let toastMessage = ""

          switch (action) {
            case "Shortlist":
              newStatus = "Shortlisted"
              toastMessage = `Applicant ${applicant.name} shortlisted!`
              break
            case "Reject":
              newStatus = "Rejected"
              toastMessage = `Applicant ${applicant.name} rejected.`
              break
            case "Message":
              setChatPartner(applicant)
              setChatJob(job)
              setIsChatOpen(true)
              toastMessage = `Opening chat with ${applicant.name}...`
              break
            case "Schedule Interview":
              setSchedulerJob(job)
              setSchedulerApplicant(applicant)
              setIsSchedulerOpen(true)
              toastMessage = `Scheduling interview for ${applicant.name}...`
              break
          }
          toast({ title: toastMessage })
          return { ...app, status: newStatus }
        }
        return app
      }),
    )
    // Force re-render of applicants dialog if needed, though state update should handle it
    setSelectedJobForApplicants((prev) => (prev ? { ...prev } : null))
  }

  const handleInterviewScheduled = (applicationId: string, date: Date, time: string, link?: string) => {
    setAllApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: "Interview Scheduled",
              interviewDetails: { date, time, link },
            }
          : app,
      ),
    )
    toast({
      title: "Interview Scheduled!",
      description: `Interview set for ${date.toLocaleDateString()} at ${time}.`,
    })
    setIsSchedulerOpen(false)
    // Force re-render of applicants dialog if needed
    setSelectedJobForApplicants((prev) => (prev ? { ...prev } : null))
  }

  // Set user role and persist to localStorage
  const selectRole = (role: UserRole) => {
    setUserRole(role)
    localStorage.setItem("userRole", role)
    setUserProfile((prev) => {
      const updatedProfile = { ...prev, role }
      localStorage.setItem("userProfile", JSON.stringify(updatedProfile))
      return updatedProfile
    })
  }

  // Render role selection if no role is set
  if (userRole === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to the Job Portal</CardTitle>
            <CardDescription className="text-muted-foreground">Please select your role to continue.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={() => selectRole("jobSeeker")} className="h-12 text-lg">
              <User className="mr-2 h-5 w-5" /> I'm a Job Seeker
            </Button>
            <Button onClick={() => selectRole("recruiter")} className="h-12 text-lg" variant="outline">
              <Briefcase className="mr-2 h-5 w-5" /> I'm a Recruiter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Job Portal</h1>
        <p className="text-muted-foreground mt-2">
          {userRole === "jobSeeker"
            ? "Find inclusive job opportunities and manage your applications."
            : "Post positions and manage applicants for your neurodiversity-friendly company."}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList
          className="grid w-full"
          style={{ gridTemplateColumns: userRole === "jobSeeker" ? "repeat(3, 1fr)" : "repeat(2, 1fr)" }}
        >
          {userRole === "jobSeeker" && (
            <>
              <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
              <TabsTrigger value="bookmarked">Bookmarked Jobs ({bookmarkedJobs.length})</TabsTrigger>
              <TabsTrigger value="applications">
                My Applications ({allApplications.filter((app) => app.seekerId === MOCK_CURRENT_USER_ID).length})
              </TabsTrigger>
            </>
          )}
          {userRole === "recruiter" && (
            <>
              <TabsTrigger value="my-jobs">
                My Posted Jobs ({allJobs.filter((job) => job.postedByUserId === MOCK_CURRENT_USER_ID).length})
              </TabsTrigger>
              <TabsTrigger value="post">Post a New Job</TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Job Seeker Tabs */}
        {userRole === "jobSeeker" && (
          <>
            <TabsContent value="browse" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Find Your Perfect Job</CardTitle>
                  <CardDescription>Search through neurodiversity-friendly job opportunities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="search">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Job title, company, or skills..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="san francisco">San Francisco</SelectItem>
                          <SelectItem value="austin">Austin</SelectItem>
                          <SelectItem value="new york">New York</SelectItem>
                          <SelectItem value="london">London</SelectItem>
                          <SelectItem value="berlin">Berlin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Job Type</Label>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Listings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Found {filteredJobs.length} jobs</h2>
                  <Button onClick={() => setIsProfileOpen(true)} variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Update Profile
                  </Button>
                </div>

                <div className="grid gap-6">
                  {filteredJobs.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12 text-muted-foreground">
                        <Search className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                        <p>Try adjusting your search filters.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredJobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <CardTitle className="text-xl">{job.title}</CardTitle>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Building className="mr-1 h-4 w-4" />
                                  {job.company}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="mr-1 h-4 w-4" />
                                  {job.location}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="mr-1 h-4 w-4" />
                                  {job.salary}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-4 w-4" />
                                  {job.type}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant={bookmarkedJobs.includes(job.id) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleBookmarkJob(job.id)}
                            >
                              <Heart
                                className={`mr-2 h-4 w-4 ${bookmarkedJobs.includes(job.id) ? "fill-current" : ""}`}
                              />
                              {bookmarkedJobs.includes(job.id) ? "Bookmarked" : "Bookmark"}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <CardDescription className="text-base leading-relaxed">{job.description}</CardDescription>

                          <div>
                            <h4 className="font-semibold mb-2">Requirements</h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req) => (
                                <Badge key={req} variant="secondary">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {job.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex space-x-2 pt-4">
                            <Button
                              className="flex-1"
                              onClick={() => applyToJob(job.id)}
                              disabled={appliedJobs.includes(job.id)}
                            >
                              <Briefcase className="mr-2 h-4 w-4" />
                              {appliedJobs.includes(job.id) ? "Applied" : "Apply Now"}
                            </Button>
                            <Button variant="outline">Learn More</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookmarked" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Bookmarked Jobs ({bookmarkedJobs.length})</h2>

                {bookmarkedJobs.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No bookmarked jobs yet</h3>
                      <p className="text-muted-foreground">
                        Start browsing jobs and bookmark the ones you're interested in.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {allJobs
                      .filter((job) => bookmarkedJobs.includes(job.id))
                      .map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <CardTitle className="text-xl">{job.title}</CardTitle>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Building className="mr-1 h-4 w-4" />
                                    {job.company}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    {job.location}
                                  </div>
                                  <div className="flex items-center">
                                    <DollarSign className="mr-1 h-4 w-4" />
                                    {job.salary}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" onClick={() => toggleBookmarkJob(job.id)}>
                                <Heart className="mr-2 h-4 w-4 fill-current" />
                                Remove Bookmark
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CardDescription className="text-base leading-relaxed">{job.description}</CardDescription>
                            <div className="flex space-x-2">
                              <Button
                                className="flex-1"
                                onClick={() => applyToJob(job.id)}
                                disabled={appliedJobs.includes(job.id)}
                              >
                                <Briefcase className="mr-2 h-4 w-4" />
                                {appliedJobs.includes(job.id) ? "Applied" : "Apply Now"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Your Applications ({allApplications.filter((app) => app.seekerId === MOCK_CURRENT_USER_ID).length})
                </h2>

                {allApplications.filter((app) => app.seekerId === MOCK_CURRENT_USER_ID).length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No applications submitted yet</h3>
                      <p className="text-muted-foreground">Browse jobs and apply to get started!</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {allApplications
                      .filter((app) => app.seekerId === MOCK_CURRENT_USER_ID)
                      .map((app) => {
                        const job = allJobs.find((j) => j.id === app.jobId)
                        if (!job) return null // Should not happen with consistent data

                        return (
                          <Card key={app.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <CardTitle className="text-xl">{job.title}</CardTitle>
                                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                      <Building className="mr-1 h-4 w-4" />
                                      {job.company}
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="mr-1 h-4 w-4" />
                                      {job.location}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="mr-1 h-4 w-4" />
                                      Applied on {app.appliedDate.toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  className={`px-3 py-1 text-sm font-semibold ${
                                    app.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : app.status === "Reviewed"
                                        ? "bg-blue-100 text-blue-800"
                                        : app.status === "Shortlisted" || app.status === "Interview Scheduled"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {app.status}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <CardDescription className="text-base leading-relaxed">{job.description}</CardDescription>
                              <div className="flex space-x-2">
                                <Button variant="outline" onClick={() => handleViewApplication(app)}>
                                  View Application
                                </Button>
                                {app.status === "Shortlisted" && (
                                  <Button
                                    onClick={() =>
                                      handleApplicantAction(
                                        app.id,
                                        "Message",
                                        job,
                                        allUsers.find((u) => u.id === MOCK_CURRENT_USER_ID)!,
                                      )
                                    }
                                  >
                                    <MessageSquare className="mr-2 h-4 w-4" /> Message Recruiter
                                  </Button>
                                )}
                                {app.status === "Interview Scheduled" && app.interviewDetails && (
                                  <Button
                                    onClick={() =>
                                      toast({
                                        title: "Interview Details",
                                        description: `Your interview for ${job.title} is on ${app.interviewDetails?.date.toLocaleDateString()} at ${app.interviewDetails?.time}. ${app.interviewDetails?.link ? `Link: ${app.interviewDetails.link}` : ""}`,
                                      })
                                    }
                                  >
                                    <CalendarDays className="mr-2 h-4 w-4" /> View Interview Details
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                  </div>
                )}
              </div>
            </TabsContent>
          </>
        )}

        {/* Recruiter Tabs */}
        {userRole === "recruiter" && (
          <>
            <TabsContent value="my-jobs" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Your Posted Jobs ({allJobs.filter((job) => job.postedByUserId === MOCK_CURRENT_USER_ID).length})
                </h2>

                {allJobs.filter((job) => job.postedByUserId === MOCK_CURRENT_USER_ID).length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Plus className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                      <p className="text-muted-foreground">
                        Go to the "Post a New Job" tab to create your first listing!
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {allJobs
                      .filter((job) => job.postedByUserId === MOCK_CURRENT_USER_ID)
                      .map((job) => (
                        <Card key={job.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <CardTitle className="text-xl">{job.title}</CardTitle>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center">
                                    <Building className="mr-1 h-4 w-4" />
                                    {job.company}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="mr-1 h-4 w-4" />
                                    {job.location}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="mr-1 h-4 w-4" />
                                    Posted on {job.postedDate.toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary" className="px-3 py-1 text-sm font-semibold">
                                {allApplications.filter((app) => app.jobId === job.id).length} Applicants
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <CardDescription className="text-base leading-relaxed">{job.description}</CardDescription>
                            <div className="flex space-x-2 pt-4">
                              <Button
                                className="flex-1"
                                onClick={() => {
                                  setSelectedJobForApplicants(job)
                                  setIsApplicantsDialogOpen(true)
                                }}
                              >
                                <User className="mr-2 h-4 w-4" />
                                View Applicants
                              </Button>
                              <Button variant="outline" onClick={() => handleEditJob(job)}>
                                Edit Job
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="post" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post a New Job</CardTitle>
                  <CardDescription>Create a job listing to find talented neurodivergent candidates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title *</Label>
                      <Input
                        id="job-title"
                        placeholder="e.g. Frontend Developer"
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        value={newJob.company}
                        onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g. San Francisco, CA or Remote"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        placeholder="e.g. $70,000 - $90,000"
                        value={newJob.salary}
                        onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Job Type</Label>
                      <Select value={newJob.type} onValueChange={(value: any) => setNewJob({ ...newJob, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g. React, TypeScript, Remote-friendly"
                        value={newJob.tags}
                        onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the role, responsibilities, and what makes your company neurodiversity-friendly..."
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                    <Textarea
                      id="requirements"
                      placeholder="e.g. React, 2+ years experience, Strong communication skills"
                      value={newJob.requirements}
                      onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button onClick={postJob} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Post Job
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Profile Dialog (for Job Seeker) */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Your Profile</DialogTitle>
            <DialogDescription>Keep your profile updated to apply for jobs and get better matches.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            {" "}
            {/* Added pr-4 for scrollbar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name *</Label>
                <Input
                  id="profile-name"
                  placeholder="Your full name"
                  value={userProfile.name}
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email *</Label>
                <Input
                  id="profile-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={userProfile.email}
                  onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone</Label>
                <Input
                  id="profile-phone"
                  placeholder="Your phone number"
                  value={userProfile.phone}
                  onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-location">Location</Label>
                <Input
                  id="profile-location"
                  placeholder="City, State"
                  value={userProfile.location}
                  onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-skills">Skills (comma-separated)</Label>
              <Input
                id="profile-skills"
                placeholder="e.g. JavaScript, React, Python, Design"
                value={userProfile.skills.join(", ")}
                onChange={(e) =>
                  setUserProfile({
                    ...userProfile,
                    skills: e.target.value
                      .split(", ")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-bio">Bio</Label>
              <Textarea
                id="profile-bio"
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                value={userProfile.bio}
                onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-portfolio">Portfolio URL (Optional)</Label>
              <Input
                id="profile-portfolio"
                placeholder="https://yourportfolio.com"
                value={userProfile.portfolio}
                onChange={(e) => setUserProfile({ ...userProfile, portfolio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Resume</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload your resume (PDF or DOC)</p>
                <Input
                  id="resume-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0]
                      // Simulate upload
                      toast({ title: `Uploading ${file.name}...` })
                      setTimeout(() => {
                        setUserProfile({ ...userProfile, resumeUrl: `/mock-resumes/${file.name}` })
                        toast({ title: "Resume uploaded successfully!" })
                      }, 1000)
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("resume-upload")?.click()}>
                  Choose File
                </Button>
                {userProfile.resumeUrl && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Current:{" "}
                    <a href={userProfile.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">
                      {userProfile.resumeUrl.split("/").pop()}
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={updateProfile} className="w-full">
              Update Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Applicants Dialog (for Recruiter) */}
      <Dialog open={isApplicantsDialogOpen} onOpenChange={setIsApplicantsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Applicants for "{selectedJobForApplicants?.title}"</DialogTitle>
            <DialogDescription>Review candidates who applied for this position.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            {selectedJobForApplicants &&
            allApplications.filter((app) => app.jobId === selectedJobForApplicants.id).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <User className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applicants yet</h3>
                <p>Share your job listing to attract candidates!</p>
              </div>
            ) : (
              selectedJobForApplicants &&
              allApplications
                .filter((app) => app.jobId === selectedJobForApplicants.id)
                .map((app) => {
                  const seeker = allUsers.find((u) => u.id === app.seekerId)
                  if (!seeker) return null // Should not happen

                  const job = allJobs.find((j) => j.id === app.jobId)!

                  return (
                    <Card key={app.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{seeker.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4" /> {seeker.email}
                              {seeker.phone && (
                                <>
                                  <Phone className="h-4 w-4 ml-4" /> {seeker.phone}
                                </>
                              )}
                            </CardDescription>
                            {seeker.location && (
                              <CardDescription className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4" /> {seeker.location}
                              </CardDescription>
                            )}
                          </div>
                          <Badge
                            className={`px-3 py-1 text-sm font-semibold ${
                              app.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : app.status === "Reviewed"
                                  ? "bg-blue-100 text-blue-800"
                                  : app.status === "Shortlisted" || app.status === "Interview Scheduled"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {app.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          Applied on {app.appliedDate.toLocaleDateString()}
                        </p>
                        {seeker.bio && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Bio</h4>
                            <p className="text-sm">{seeker.bio}</p>
                          </div>
                        )}
                        {seeker.skills.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {seeker.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {seeker.portfolio && (
                          <div className="flex items-center gap-2 text-sm">
                            <Link className="h-4 w-4" />
                            <a href={seeker.portfolio} target="_blank" rel="noopener noreferrer" className="underline">
                              Portfolio
                            </a>
                          </div>
                        )}
                        {seeker.resumeUrl && (
                          <div className="flex items-center gap-2 text-sm">
                            <Upload className="h-4 w-4" />
                            <a href={seeker.resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">
                              View Resume
                            </a>
                          </div>
                        )}
                        <div className="flex gap-2 pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplicantAction(app.id, "Shortlist", job, seeker)}
                            disabled={app.status === "Shortlisted" || app.status === "Interview Scheduled"}
                          >
                            <UserCheck className="mr-2 h-4 w-4" /> Shortlist
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplicantAction(app.id, "Reject", job, seeker)}
                            disabled={app.status === "Rejected"}
                          >
                            <UserX className="mr-2 h-4 w-4" /> Reject
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplicantAction(app.id, "Message", job, seeker)}
                          >
                            <MessageSquare className="mr-2 h-4 w-4" /> Message
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApplicantAction(app.id, "Schedule Interview", job, seeker)}
                            disabled={app.status === "Interview Scheduled"}
                          >
                            <CalendarDays className="mr-2 h-4 w-4" /> Schedule Interview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplicantsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog (for Recruiter) */}
      <Dialog open={isEditJobOpen} onOpenChange={setIsEditJobOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Job: "{jobToEdit?.title}"</DialogTitle>
            <DialogDescription>Update the details of your job listing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-job-title">Job Title *</Label>
                <Input
                  id="edit-job-title"
                  placeholder="e.g. Frontend Developer"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-company">Company *</Label>
                <Input
                  id="edit-company"
                  placeholder="Your company name"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary Range</Label>
                <Input
                  id="edit-salary"
                  placeholder="e.g. $70,000 - $90,000"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={newJob.type} onValueChange={(value: any) => setNewJob({ ...newJob, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  placeholder="e.g. React, TypeScript, Remote-friendly"
                  value={newJob.tags}
                  onChange={(e) => setNewJob({ ...newJob, tags: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Job Description *</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe the role, responsibilities, and what makes your company neurodiversity-friendly..."
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-requirements">Requirements (comma-separated)</Label>
              <Textarea
                id="edit-requirements"
                placeholder="e.g. React, 2+ years experience, Strong communication skills"
                value={newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditJobOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateJob}>Update Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog (for Job Seeker) */}
      <Dialog open={isViewApplicationOpen} onOpenChange={setIsViewApplicationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Application Details</DialogTitle>
            <DialogDescription>Review the details of your application.</DialogDescription>
          </DialogHeader>
          {applicationToView && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
              <Card>
                <CardHeader>
                  <CardTitle>{allJobs.find((j) => j.id === applicationToView.jobId)?.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4" /> {allJobs.find((j) => j.id === applicationToView.jobId)?.company}
                    <MapPin className="h-4 w-4 ml-4" />{" "}
                    {allJobs.find((j) => j.id === applicationToView.jobId)?.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Applied on: {applicationToView.appliedDate.toLocaleDateString()}
                  </p>
                  <Badge
                    className={`px-3 py-1 text-sm font-semibold ${
                      applicationToView.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : applicationToView.status === "Reviewed"
                          ? "bg-blue-100 text-blue-800"
                          : applicationToView.status === "Shortlisted" ||
                              applicationToView.status === "Interview Scheduled"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    Status: {applicationToView.status}
                  </Badge>
                  {applicationToView.coverLetter && (
                    <div>
                      <h4 className="font-semibold text-sm mt-4 mb-1">Your Cover Letter</h4>
                      <p className="text-sm whitespace-pre-wrap">{applicationToView.coverLetter}</p>
                    </div>
                  )}
                  {applicationToView.status === "Interview Scheduled" && applicationToView.interviewDetails && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-sm">Interview Details</h4>
                      <p className="text-sm">
                        <CalendarDays className="inline-block mr-2 h-4 w-4" />
                        Date: {applicationToView.interviewDetails.date.toLocaleDateString()}
                      </p>
                      <p className="text-sm">
                        <Clock className="inline-block mr-2 h-4 w-4" />
                        Time: {applicationToView.interviewDetails.time}
                      </p>
                      {applicationToView.interviewDetails.link && (
                        <p className="text-sm">
                          <Link className="inline-block mr-2 h-4 w-4" />
                          Link:{" "}
                          <a
                            href={applicationToView.interviewDetails.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {applicationToView.interviewDetails.link}
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewApplicationOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      {isChatOpen && chatPartner && chatJob && (
        <ChatDialog
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          currentUser={userProfile}
          otherUser={chatPartner}
          job={chatJob}
        />
      )}

      {/* Interview Scheduler Dialog */}
      {isSchedulerOpen && schedulerJob && schedulerApplicant && (
        <InterviewScheduler
          isOpen={isSchedulerOpen}
          onClose={() => setIsSchedulerOpen(false)}
          job={schedulerJob}
          applicant={schedulerApplicant}
          onScheduleConfirm={(date, time, link) =>
            handleInterviewScheduled(
              allApplications.find((app) => app.jobId === schedulerJob.id && app.seekerId === schedulerApplicant.id)!
                .id,
              date,
              time,
              link,
            )
          }
        />
      )}
    </div>
  )
}
