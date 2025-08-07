"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, MapPin, ExternalLink, Filter, Heart, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Google Custom Search configuration
const SEARCH_ENGINE_ID = "3736f3d45519d48b7"
const API_KEY = "AIzaSyAnycFGiIFRb1yhyPDjO5qOzKP3REVwXsU"

interface SearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  formattedUrl: string
}

interface SchemeResult {
  id: string
  title: string
  description: string
  url: string
  source: string
  category: string
  location: string
  relevanceScore: number
}

const neuroConditions = [
  { value: "all", label: "All Conditions" },
  { value: "autism", label: "Autism Spectrum Disorder (ASD)" },
  { value: "adhd", label: "ADHD" },
  { value: "dyslexia", label: "Dyslexia" },
  { value: "dyspraxia", label: "Dyspraxia" },
  { value: "tourettes", label: "Tourette's Syndrome" },
  { value: "ocd", label: "OCD" },
  { value: "sensory", label: "Sensory Processing Disorder" },
  { value: "intellectual", label: "Intellectual Disability" },
  { value: "learning", label: "Learning Disabilities" },
  { value: "cerebral-palsy", label: "Cerebral Palsy" },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "employment", label: "Employment & Jobs" },
  { value: "education", label: "Education & Training" },
  { value: "healthcare", label: "Healthcare & Therapy" },
  { value: "financial", label: "Financial Support" },
  { value: "housing", label: "Housing & Accommodation" },
  { value: "technology", label: "Assistive Technology" },
  { value: "transport", label: "Transportation" },
  { value: "social", label: "Social Services" },
  { value: "legal", label: "Legal Support" },
  { value: "family", label: "Family Support" },
]

const locations = [
  { value: "all", label: "All Locations" },
  { value: "national", label: "National (USA)" },
  { value: "california", label: "California" },
  { value: "texas", label: "Texas" },
  { value: "florida", label: "Florida" },
  { value: "new-york", label: "New York" },
  { value: "illinois", label: "Illinois" },
  { value: "pennsylvania", label: "Pennsylvania" },
  { value: "ohio", label: "Ohio" },
  { value: "georgia", label: "Georgia" },
  { value: "north-carolina", label: "North Carolina" },
  // India locations
  { value: "india", label: "India (National)" },
  { value: "delhi", label: "Delhi" },
  { value: "mumbai", label: "Mumbai/Maharashtra" },
  { value: "bangalore", label: "Bangalore/Karnataka" },
  { value: "chennai", label: "Chennai/Tamil Nadu" },
  { value: "kolkata", label: "Kolkata/West Bengal" },
  { value: "hyderabad", label: "Hyderabad/Telangana" },
  { value: "pune", label: "Pune/Maharashtra" },
  { value: "ahmedabad", label: "Ahmedabad/Gujarat" },
  { value: "jaipur", label: "Jaipur/Rajasthan" },
  { value: "lucknow", label: "Lucknow/Uttar Pradesh" },
]

export default function SchemesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [customQuery, setCustomQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SchemeResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [bookmarkedSchemes, setBookmarkedSchemes] = useState<SchemeResult[]>([])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [selectedSchemeDetails, setSelectedSchemeDetails] = useState<SchemeResult | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  // Build search query based on user preferences
  const buildSearchQuery = () => {
    let query = ""

    // Base search terms
    const baseTerms = ["scheme", "program", "grant", "funding", "support", "assistance", "benefit"]

    // Add user's custom search term
    if (searchTerm.trim()) {
      query += `${searchTerm.trim()} `
    }

    // Add neurodivergent condition specific terms
    if (selectedCondition !== "all") {
      const conditionTerms = {
        autism: "autism autistic ASD spectrum",
        adhd: "ADHD attention deficit hyperactivity",
        dyslexia: "dyslexia reading learning disability",
        dyspraxia: "dyspraxia coordination motor skills",
        tourettes: "tourette syndrome tics",
        ocd: "OCD obsessive compulsive",
        sensory: "sensory processing disorder SPD",
        intellectual: "intellectual disability developmental",
        learning: "learning disability special needs",
        "cerebral-palsy": "cerebral palsy mobility physical",
      }
      query += `${conditionTerms[selectedCondition as keyof typeof conditionTerms]} `
    } else {
      query += "neurodivergent neurodiversity disability special needs "
    }

    // Add category specific terms
    if (selectedCategory !== "all") {
      const categoryTerms = {
        employment: "employment job vocational rehabilitation work",
        education: "education scholarship tuition school college",
        healthcare: "healthcare medical therapy treatment",
        financial: "financial assistance money cash benefit",
        housing: "housing accommodation residential living",
        technology: "assistive technology equipment device",
        transport: "transportation travel mobility",
        social: "social services community support",
        legal: "legal aid advocacy rights",
        family: "family caregiver respite support",
      }
      query += `${categoryTerms[selectedCategory as keyof typeof categoryTerms]} `
    }

    // Add location
    if (selectedLocation !== "all") {
      if (selectedLocation === "national") {
        query += "USA United States federal national "
      } else if (selectedLocation === "india") {
        query += "India Indian central government national "
      } else if (
        [
          "delhi",
          "mumbai",
          "bangalore",
          "chennai",
          "kolkata",
          "hyderabad",
          "pune",
          "ahmedabad",
          "jaipur",
          "lucknow",
        ].includes(selectedLocation)
      ) {
        query += `${selectedLocation.replace("-", " ")} India Indian state government `
      } else {
        query += `${selectedLocation.replace("-", " ")} `
      }
    }

    // Add base terms
    query += baseTerms.join(" OR ")

    // Add custom query if provided
    if (customQuery.trim()) {
      query += ` ${customQuery.trim()}`
    }

    // Add exclusion terms to filter out irrelevant results
    query += ' -"what is" -definition -symptoms -diagnosis -causes -treatment -medication'

    return query.trim()
  }

  // Perform Google Custom Search
  const performSearch = async () => {
    if (!searchTerm.trim() && selectedCondition === "all" && selectedCategory === "all") {
      toast({
        title: "Search criteria required",
        description: "Please enter a search term or select specific criteria.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const query = buildSearchQuery()
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=10`

      const response = await fetch(searchUrl)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message || "Search failed")
      }

      if (data.items && data.items.length > 0) {
        const processedResults: SchemeResult[] = data.items.map((item: SearchResult, index: number) => ({
          id: `search-${index}`,
          title: item.title,
          description: item.snippet,
          url: item.link,
          source: item.displayLink,
          category: categorizeResult(item.title + " " + item.snippet),
          location: extractLocation(item.title + " " + item.snippet),
          relevanceScore: calculateRelevance(item.title + " " + item.snippet),
        }))

        // Sort by relevance score
        processedResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
        setSearchResults(processedResults)

        toast({
          title: "Search completed",
          description: `Found ${processedResults.length} relevant schemes and programs.`,
        })
      } else {
        setSearchResults([])
        toast({
          title: "No results found",
          description: "Try adjusting your search criteria or terms.",
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      setError(error instanceof Error ? error.message : "Search failed")
      toast({
        title: "Search failed",
        description: "There was an error performing the search. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Categorize search results based on content
  const categorizeResult = (content: string): string => {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes("job") || lowerContent.includes("employment") || lowerContent.includes("work")) {
      return "Employment"
    } else if (
      lowerContent.includes("education") ||
      lowerContent.includes("school") ||
      lowerContent.includes("scholarship")
    ) {
      return "Education"
    } else if (
      lowerContent.includes("health") ||
      lowerContent.includes("medical") ||
      lowerContent.includes("therapy")
    ) {
      return "Healthcare"
    } else if (lowerContent.includes("housing") || lowerContent.includes("residential")) {
      return "Housing"
    } else if (
      lowerContent.includes("technology") ||
      lowerContent.includes("assistive") ||
      lowerContent.includes("equipment")
    ) {
      return "Technology"
    } else if (
      lowerContent.includes("financial") ||
      lowerContent.includes("grant") ||
      lowerContent.includes("funding")
    ) {
      return "Financial"
    } else {
      return "General Support"
    }
  }

  // Extract location information from content
  const extractLocation = (content: string): string => {
    const lowerContent = content.toLowerCase()

    // USA locations
    if (lowerContent.includes("california") || lowerContent.includes("ca")) return "California"
    if (lowerContent.includes("texas") || lowerContent.includes("tx")) return "Texas"
    if (lowerContent.includes("florida") || lowerContent.includes("fl")) return "Florida"
    if (lowerContent.includes("new york") || lowerContent.includes("ny")) return "New York"
    if (lowerContent.includes("federal") || lowerContent.includes("national") || lowerContent.includes("usa"))
      return "National (USA)"

    // India locations
    if (lowerContent.includes("india") || lowerContent.includes("indian")) {
      if (lowerContent.includes("delhi")) return "Delhi"
      if (lowerContent.includes("mumbai") || lowerContent.includes("maharashtra")) return "Mumbai/Maharashtra"
      if (
        lowerContent.includes("bangalore") ||
        lowerContent.includes("bengaluru") ||
        lowerContent.includes("karnataka")
      )
        return "Bangalore/Karnataka"
      if (lowerContent.includes("chennai") || lowerContent.includes("tamil nadu")) return "Chennai/Tamil Nadu"
      if (lowerContent.includes("kolkata") || lowerContent.includes("west bengal")) return "Kolkata/West Bengal"
      if (lowerContent.includes("hyderabad") || lowerContent.includes("telangana")) return "Hyderabad/Telangana"
      if (lowerContent.includes("pune")) return "Pune/Maharashtra"
      if (lowerContent.includes("ahmedabad") || lowerContent.includes("gujarat")) return "Ahmedabad/Gujarat"
      if (lowerContent.includes("jaipur") || lowerContent.includes("rajasthan")) return "Jaipur/Rajasthan"
      if (lowerContent.includes("lucknow") || lowerContent.includes("uttar pradesh")) return "Lucknow/Uttar Pradesh"
      return "India (National)"
    }

    return "Various"
  }

  // Calculate relevance score based on search criteria
  const calculateRelevance = (content: string): number => {
    let score = 0
    const lowerContent = content.toLowerCase()

    // Higher score for scheme-related terms
    const schemeTerms = ["scheme", "program", "grant", "funding", "support", "assistance", "benefit"]
    schemeTerms.forEach((term) => {
      if (lowerContent.includes(term)) score += 10
    })

    // Higher score for condition-specific terms
    if (selectedCondition !== "all") {
      const conditionName = neuroConditions.find((c) => c.value === selectedCondition)?.label.toLowerCase()
      if (conditionName && lowerContent.includes(conditionName.split(" ")[0])) {
        score += 20
      }
    }

    // Higher score for category match
    if (selectedCategory !== "all") {
      const categoryName = categories.find((c) => c.value === selectedCategory)?.label.toLowerCase()
      if (categoryName && lowerContent.includes(categoryName.split(" ")[0])) {
        score += 15
      }
    }

    return score
  }

  const toggleBookmarkScheme = (scheme: SchemeResult) => {
    setBookmarkedSchemes((prev) => {
      const isBookmarked = prev.some((s) => s.id === scheme.id)
      if (isBookmarked) {
        return prev.filter((s) => s.id !== scheme.id)
      } else {
        return [...prev, scheme]
      }
    })

    const isCurrentlyBookmarked = bookmarkedSchemes.some((s) => s.id === scheme.id)
    toast({
      title: isCurrentlyBookmarked ? "Bookmark removed" : "Scheme bookmarked",
      description: isCurrentlyBookmarked ? "Scheme removed from your bookmarks" : "Scheme added to your bookmarks",
    })
  }

  const showSchemeDetails = (scheme: SchemeResult) => {
    setSelectedSchemeDetails(scheme)
    setIsDetailsModalOpen(true)
  }

  // Auto-search when filters change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasSearched && (searchTerm || selectedCondition !== "all" || selectedCategory !== "all")) {
        performSearch()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [selectedCondition, selectedCategory, selectedLocation])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Scheme Finder</h1>
        <p className="text-muted-foreground mt-2">
          Discover personalized government and private schemes tailored to your specific neurodivergent needs.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Smart Search & Filters
          </CardTitle>
          <CardDescription>Search for schemes specific to your condition, location, and needs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Primary Search */}
          <div className="space-y-2">
            <Label htmlFor="search">What are you looking for?</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="e.g., employment support, education funding, housing assistance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === "Enter" && performSearch()}
              />
            </div>
          </div>

          {/* Condition Selection */}
          <div className="space-y-2">
            <Label>Specific Neurodivergent Condition</Label>
            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
              <SelectTrigger>
                <SelectValue placeholder="Select your condition for targeted results" />
              </SelectTrigger>
              <SelectContent>
                {neuroConditions.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Search */}
          <div className="space-y-2">
            <Label htmlFor="custom-query">Additional Keywords (Optional)</Label>
            <Textarea
              id="custom-query"
              placeholder="Add any specific keywords or requirements..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <Button onClick={performSearch} disabled={isLoading} className="flex-1 mr-4">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search Schemes
                </>
              )}
            </Button>
            <Button variant={showBookmarks ? "default" : "outline"} onClick={() => setShowBookmarks(!showBookmarks)}>
              <Heart className={`mr-2 h-4 w-4 ${showBookmarks ? "fill-current" : ""}`} />
              Bookmarks ({bookmarkedSchemes.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Search Error: {error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {(hasSearched || showBookmarks) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {showBookmarks
                ? `Your Bookmarked Schemes (${bookmarkedSchemes.length})`
                : isLoading
                  ? "Searching..."
                  : `Found ${searchResults.length} schemes`}
            </h2>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{bookmarkedSchemes.length} bookmarked</Badge>
            </div>
          </div>

          {showBookmarks ? (
            // Show bookmarked schemes
            bookmarkedSchemes.length > 0 ? (
              <div className="grid gap-6">
                {bookmarkedSchemes.map((scheme) => (
                  <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <CardTitle className="text-xl leading-tight">{scheme.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {scheme.location}
                            </div>
                            <Badge variant="outline">{scheme.category}</Badge>
                            <span className="text-xs">Source: {scheme.source}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toggleBookmarkScheme(scheme)}>
                            <Heart className="mr-2 h-4 w-4 fill-current" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-base leading-relaxed">{scheme.description}</CardDescription>

                      <div className="flex space-x-2 pt-4">
                        <Button asChild className="flex-1">
                          <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Official Site
                          </a>
                        </Button>
                        <Button variant="outline" onClick={() => showSchemeDetails(scheme)}>
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookmarked schemes yet</h3>
                  <p className="text-muted-foreground">
                    Start searching and bookmark schemes you're interested in for easy access later.
                  </p>
                </CardContent>
              </Card>
            )
          ) : // Show search results (existing code)
          searchResults.length > 0 ? (
            <div className="grid gap-6">
              {searchResults.map((scheme) => (
                <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <CardTitle className="text-xl leading-tight">{scheme.title}</CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            {scheme.location}
                          </div>
                          <Badge variant="outline">{scheme.category}</Badge>
                          <span className="text-xs">Source: {scheme.source}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant={bookmarkedSchemes.some((s) => s.id === scheme.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleBookmarkScheme(scheme)}
                        >
                          <Heart
                            className={`mr-2 h-4 w-4 ${bookmarkedSchemes.some((s) => s.id === scheme.id) ? "fill-current" : ""}`}
                          />
                          {bookmarkedSchemes.some((s) => s.id === scheme.id) ? "Bookmarked" : "Bookmark"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base leading-relaxed">{scheme.description}</CardDescription>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        Relevance: {scheme.relevanceScore}%
                      </Badge>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button asChild className="flex-1">
                        <a href={scheme.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit Official Site
                        </a>
                      </Button>
                      <Button variant="outline" onClick={() => showSchemeDetails(scheme)}>
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : hasSearched && !isLoading ? (
            // No results found card (existing code)
            <Card>
              <CardContent className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No schemes found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or using different keywords.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Tips for better results:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Try broader search terms</li>
                    <li>Select "All Locations" for wider coverage</li>
                    <li>Use different category combinations</li>
                    <li>Include synonyms in additional keywords</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && (
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardContent className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Find Your Perfect Scheme?</h3>
            <p className="text-muted-foreground mb-4">
              Use our smart search to discover schemes tailored to your specific neurodivergent condition and needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">🎯 Targeted Results</h4>
                <p className="text-muted-foreground">Results specific to your neurodivergent condition</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">📍 Location-Based</h4>
                <p className="text-muted-foreground">Find schemes available in your area</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🔍 Smart Filtering</h4>
                <p className="text-muted-foreground">Advanced filters for precise results</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheme Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl leading-tight">{selectedSchemeDetails?.title}</DialogTitle>
            <DialogDescription className="flex items-center space-x-4 text-base">
              <div className="flex items-center">
                <MapPin className="mr-1 h-4 w-4" />
                {selectedSchemeDetails?.location}
              </div>
              <Badge variant="outline">{selectedSchemeDetails?.category}</Badge>
              <span className="text-sm">Source: {selectedSchemeDetails?.source}</span>
            </DialogDescription>
          </DialogHeader>

          {selectedSchemeDetails && (
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{selectedSchemeDetails.description}</p>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Location Coverage</h3>
                  <p className="text-muted-foreground">{selectedSchemeDetails.location}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Category</h3>
                  <Badge variant="outline" className="text-sm">
                    {selectedSchemeDetails.category}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Relevance Score</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${selectedSchemeDetails.relevanceScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{selectedSchemeDetails.relevanceScore}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Official Source</h3>
                  <p className="text-muted-foreground">{selectedSchemeDetails.source}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4 border-t">
                <Button asChild className="flex-1">
                  <a href={selectedSchemeDetails.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Official Website
                  </a>
                </Button>

                <Button variant="outline" onClick={() => toggleBookmarkScheme(selectedSchemeDetails)}>
                  <Heart
                    className={`mr-2 h-4 w-4 ${bookmarkedSchemes.some((s) => s.id === selectedSchemeDetails.id) ? "fill-current" : ""}`}
                  />
                  {bookmarkedSchemes.some((s) => s.id === selectedSchemeDetails.id) ? "Remove Bookmark" : "Bookmark"}
                </Button>
              </div>

              {/* Additional Tips */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">💡 Application Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check eligibility criteria carefully before applying</li>
                  <li>• Gather all required documents in advance</li>
                  <li>• Note application deadlines and submission requirements</li>
                  <li>• Contact the organization directly for specific questions</li>
                  <li>• Keep copies of all submitted applications</li>
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
