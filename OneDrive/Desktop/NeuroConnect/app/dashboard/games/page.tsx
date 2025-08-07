"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, Gamepad2, Trophy, Clock, Star, Play, RotateCcw, Zap, Target, Shuffle, Palette } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Game {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
  color: string
  estimatedTime: string
}

interface GameStats {
  gamesPlayed: number
  totalScore: number
  averageScore: number
  bestStreak: number
  timeSpent: number
}

const games: Game[] = [
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Match pairs of cards to improve your memory and concentration skills.",
    icon: Brain,
    difficulty: "Easy",
    category: "Memory",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    estimatedTime: "5-10 min",
  },
  {
    id: "pattern-match",
    title: "Pattern Recognition",
    description: "Identify and complete visual patterns to enhance cognitive flexibility.",
    icon: Target,
    difficulty: "Medium",
    category: "Logic",
    color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    estimatedTime: "10-15 min",
  },
  {
    id: "reaction-time",
    title: "Reaction Time Tester",
    description: "Test and improve your reaction speed with this engaging challenge.",
    icon: Zap,
    difficulty: "Easy",
    category: "Speed",
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
    estimatedTime: "3-5 min",
  },
  {
    id: "word-association",
    title: "Word Association",
    description: "Connect related words to boost language processing and creativity.",
    icon: Shuffle,
    difficulty: "Medium",
    category: "Language",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    estimatedTime: "8-12 min",
  },
  {
    id: "color-sorting",
    title: "Color Sorting",
    description: "Sort colors by hue, brightness, or pattern to improve visual processing.",
    icon: Palette,
    difficulty: "Easy",
    category: "Visual",
    color: "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",
    estimatedTime: "5-8 min",
  },
  {
    id: "puzzle-solver",
    title: "Puzzle Solver",
    description: "Solve increasingly complex puzzles to enhance problem-solving skills.",
    icon: Trophy,
    difficulty: "Hard",
    category: "Logic",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
    estimatedTime: "15-20 min",
  },
]

const MemoryMatchGame = ({ onGameEnd }: { onGameEnd: (score: number) => void }) => {
  const [cards, setCards] = useState<{ id: number; value: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  const cardValues = ["🎯", "🎨", "🎵", "🎪", "🎭", "🎲", "🎸", "🎺"]

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && matches < 8) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, matches])

  const initializeGame = () => {
    const shuffledCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        flipped: false,
        matched: false,
      }))
    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setTimeElapsed(0)
    setGameStarted(false)
  }

  const flipCard = (cardId: number) => {
    if (!gameStarted) setGameStarted(true)

    if (flippedCards.length === 2) return
    if (cards[cardId].flipped || cards[cardId].matched) return

    const newCards = [...cards]
    newCards[cardId].flipped = true
    setCards(newCards)

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1)

      setTimeout(() => {
        const [first, second] = newFlippedCards
        if (cards[first].value === cards[second].value) {
          // Match found
          const matchedCards = [...newCards]
          matchedCards[first].matched = true
          matchedCards[second].matched = true
          setCards(matchedCards)
          setMatches((prev) => {
            const newMatches = prev + 1
            if (newMatches === 8) {
              // Game completed
              const score = Math.max(1000 - moves * 10 - timeElapsed * 2, 100)
              onGameEnd(score)
            }
            return newMatches
          })
        } else {
          // No match
          const resetCards = [...newCards]
          resetCards[first].flipped = false
          resetCards[second].flipped = false
          setCards(resetCards)
        }
        setFlippedCards([])
      }, 1000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Moves: {moves}</Badge>
          <Badge variant="secondary">Matches: {matches}/8</Badge>
          <Badge variant="secondary">
            Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
          </Badge>
        </div>
        <Button onClick={initializeGame} variant="outline" size="sm">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => (
          <Button
            key={card.id}
            variant="outline"
            className={`aspect-square text-2xl ${
              card.flipped || card.matched
                ? card.matched
                  ? "bg-green-100 border-green-300 dark:bg-green-900"
                  : "bg-blue-100 border-blue-300 dark:bg-blue-900"
                : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => flipCard(card.id)}
            disabled={card.flipped || card.matched}
          >
            {card.flipped || card.matched ? card.value : "?"}
          </Button>
        ))}
      </div>

      {matches === 8 && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-green-600">Congratulations! 🎉</h3>
          <p className="text-muted-foreground">
            You completed the game in {moves} moves and {Math.floor(timeElapsed / 60)}:
            {(timeElapsed % 60).toString().padStart(2, "0")}!
          </p>
        </div>
      )}
    </div>
  )
}

const ReactionTimeGame = ({ onGameEnd }: { onGameEnd: (score: number) => void }) => {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "clicked" | "too-early">("waiting")
  const [startTime, setStartTime] = useState(0)
  const [reactionTime, setReactionTime] = useState(0)
  const [attempts, setAttempts] = useState<number[]>([])

  const startGame = () => {
    setGameState("ready")
    const delay = Math.random() * 3000 + 2000 // 2-5 seconds
    setTimeout(() => {
      setGameState("go")
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      setGameState("too-early")
      setTimeout(() => setGameState("waiting"), 2000)
      return
    }

    if (gameState === "go") {
      const time = Date.now() - startTime
      setReactionTime(time)
      setGameState("clicked")
      setAttempts((prev) => {
        const newAttempts = [...prev, time]
        if (newAttempts.length >= 5) {
          const avgTime = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length
          const score = Math.max(1000 - avgTime, 100)
          setTimeout(() => onGameEnd(score), 2000)
        }
        return newAttempts
      })

      setTimeout(() => setGameState("waiting"), 2000)
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    setAttempts([])
    setReactionTime(0)
  }

  const getBackgroundColor = () => {
    switch (gameState) {
      case "ready":
        return "bg-red-500"
      case "go":
        return "bg-green-500"
      case "too-early":
        return "bg-yellow-500"
      default:
        return "bg-muted"
    }
  }

  const getMessage = () => {
    switch (gameState) {
      case "waiting":
        return attempts.length === 0
          ? "Click 'Start' to begin"
          : `Attempt ${attempts.length + 1}/5 - Click 'Start' for next round`
      case "ready":
        return "Wait for green..."
      case "go":
        return "CLICK NOW!"
      case "clicked":
        return `${reactionTime}ms - Great job!`
      case "too-early":
        return "Too early! Wait for green."
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="secondary">Attempt: {attempts.length}/5</Badge>
          {attempts.length > 0 && (
            <Badge variant="secondary">
              Avg: {Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms
            </Badge>
          )}
        </div>
        <Button onClick={resetGame} variant="outline" size="sm">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>

      <div
        className={`h-64 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${getBackgroundColor()}`}
        onClick={handleClick}
      >
        <div className="text-center text-white">
          <h3 className="text-2xl font-bold mb-2">{getMessage()}</h3>
          {gameState === "waiting" && (
            <Button onClick={startGame} size="lg" variant="secondary">
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          )}
        </div>
      </div>

      {attempts.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold">Your Times:</h4>
          <div className="flex flex-wrap gap-2">
            {attempts.map((time, index) => (
              <Badge key={index} variant="outline">
                {time}ms
              </Badge>
            ))}
          </div>
        </div>
      )}

      {attempts.length >= 5 && (
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-green-600">Test Complete! 🎯</h3>
          <p className="text-muted-foreground">
            Average reaction time: {Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)}ms
          </p>
        </div>
      )}
    </div>
  )
}

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [gameStats, setGameStats] = useState<GameStats>({
    gamesPlayed: 12,
    totalScore: 8450,
    averageScore: 704,
    bestStreak: 5,
    timeSpent: 145, // minutes
  })
  const { toast } = useToast()

  const handleGameEnd = (score: number) => {
    setGameStats((prev) => ({
      gamesPlayed: prev.gamesPlayed + 1,
      totalScore: prev.totalScore + score,
      averageScore: Math.round((prev.totalScore + score) / (prev.gamesPlayed + 1)),
      bestStreak: Math.max(prev.bestStreak, 3), // Mock streak calculation
      timeSpent: prev.timeSpent + 10, // Mock time addition
    }))

    toast({
      title: "Game completed!",
      description: `Great job! You scored ${score} points.`,
    })

    setTimeout(() => {
      setSelectedGame(null)
    }, 3000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (selectedGame) {
    const game = games.find((g) => g.id === selectedGame)
    if (!game) return null

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{game.title}</h1>
            <p className="text-muted-foreground mt-2">{game.description}</p>
          </div>
          <Button onClick={() => setSelectedGame(null)} variant="outline">
            Back to Games
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            {selectedGame === "memory-match" && <MemoryMatchGame onGameEnd={handleGameEnd} />}
            {selectedGame === "reaction-time" && <ReactionTimeGame onGameEnd={handleGameEnd} />}
            {!["memory-match", "reaction-time"].includes(selectedGame) && (
              <div className="text-center py-12">
                <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Game Coming Soon!</h3>
                <p className="text-muted-foreground">This game is currently in development. Check back soon!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Game Zone</h1>
        <p className="text-muted-foreground mt-2">
          Enhance cognitive abilities with engaging, accessible games designed for neurodivergent users.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gameStats.gamesPlayed}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gameStats.totalScore.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+450</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gameStats.averageScore}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Played</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(gameStats.timeSpent / 60)}h {gameStats.timeSpent % 60}m
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+45m</span> this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Games Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Games</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedGame(game.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${game.color}`}>
                    <game.icon className="h-6 w-6" />
                  </div>
                  <Badge className={getDifficultyColor(game.difficulty)}>{game.difficulty}</Badge>
                </div>
                <CardTitle className="text-xl">{game.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{game.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Brain className="mr-1 h-4 w-4" />
                    {game.category}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {game.estimatedTime}
                  </div>
                </div>

                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Play Game
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Section */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Keep Building Your Skills! 🧠</h3>
              <p className="text-muted-foreground mb-4">
                You're making great progress! Regular brain training can help improve cognitive flexibility, memory, and
                problem-solving skills.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Weekly Goal Progress</span>
                  <span>7/10 games</span>
                </div>
                <Progress value={70} className="w-full" />
              </div>
            </div>
            <div className="hidden md:block">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Trophy className="h-4 w-4 mr-2" />
                Brain Trainer
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
