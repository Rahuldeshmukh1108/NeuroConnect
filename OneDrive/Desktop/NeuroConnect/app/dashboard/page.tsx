"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Briefcase, Users, Gamepad2, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"

const quickStats = [
  {
    title: "Tasks Completed",
    value: "24",
    change: "+12%",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Schemes Found",
    value: "8",
    change: "+3",
    icon: Search,
    color: "text-blue-600",
  },
  {
    title: "Job Applications",
    value: "5",
    change: "+2",
    icon: Briefcase,
    color: "text-purple-600",
  },
  {
    title: "Games Played",
    value: "15",
    change: "+8",
    icon: Gamepad2,
    color: "text-orange-600",
  },
]

const recentActivity = [
  {
    action: "Applied to Software Developer position",
    time: "2 hours ago",
    type: "job",
  },
  {
    action: "Completed Memory Match game",
    time: "4 hours ago",
    type: "game",
  },
  {
    action: "Found new disability scheme",
    time: "1 day ago",
    type: "scheme",
  },
  {
    action: "Joined Autism Support community",
    time: "2 days ago",
    type: "community",
  },
]

const quickActions = [
  {
    title: "Find Schemes",
    description: "Discover new opportunities",
    icon: Search,
    href: "/dashboard/schemes",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
  },
  {
    title: "Manage Tasks",
    description: "Organize your to-dos",
    icon: Calendar,
    href: "/dashboard/kanban",
    color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
  },
  {
    title: "Browse Jobs",
    description: "Find your next opportunity",
    icon: Briefcase,
    href: "/dashboard/jobs",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
  },
  {
    title: "Play Games",
    description: "Boost your cognitive skills",
    icon: Gamepad2,
    href: "/dashboard/games",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
  },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your account today.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Jump into your most used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${action.color}`}>
                            <action.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{action.title}</h3>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {activity.type === "job" && <Briefcase className="h-4 w-4 text-purple-600" />}
                      {activity.type === "game" && <Gamepad2 className="h-4 w-4 text-orange-600" />}
                      {activity.type === "scheme" && <Search className="h-4 w-4 text-blue-600" />}
                      {activity.type === "community" && <Users className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Motivational Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Keep up the great work! 🌟</h3>
              <p className="text-muted-foreground">
                You've been making excellent progress. Remember, every small step counts towards your goals.
              </p>
            </div>
            <div className="hidden md:block">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Level 5
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
