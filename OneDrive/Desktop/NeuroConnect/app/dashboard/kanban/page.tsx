"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "react-beautiful-dnd"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Task {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high"
  reminder?: string
  createdAt: Date
}

// Map icon names to actual Lucide React components
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  AlertCircle: AlertCircle,
  Clock: Clock,
  CheckCircle: CheckCircle,
}

interface Column {
  id: string
  title: string
  tasks: Task[]
  iconName: string // Changed to store icon name as string
  color: string
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "1",
        title: "Complete job application",
        description: "Apply for the software developer position at TechCorp",
        priority: "high",
        reminder: "2024-02-15T10:00",
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "Practice memory game",
        description: "Play the memory matching game for 15 minutes",
        priority: "low",
        createdAt: new Date(),
      },
    ],
    iconName: "AlertCircle", // Storing icon name
    color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
  },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [
      {
        id: "3",
        title: "Update resume",
        description: "Add recent project experience and skills",
        priority: "medium",
        createdAt: new Date(),
      },
    ],
    iconName: "Clock", // Storing icon name
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "4",
        title: "Join autism support community",
        description: "Successfully joined the local autism support group",
        priority: "medium",
        createdAt: new Date(),
      },
    ],
    iconName: "CheckCircle", // Storing icon name
    color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
  },
]

export default function KanbanPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as const,
    reminder: "",
    columnId: "todo",
  })
  const { toast } = useToast()

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedColumns = localStorage.getItem("kanban-columns")
    if (savedColumns) {
      // When loading from localStorage, ensure Date objects are re-instantiated
      const parsedColumns = JSON.parse(savedColumns).map((col: Column) => ({
        ...col,
        tasks: col.tasks.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        })),
      }))
      setColumns(parsedColumns)
    }
  }, [])

  // Save tasks to localStorage whenever columns change
  useEffect(() => {
    localStorage.setItem("kanban-columns", JSON.stringify(columns))
  }, [columns])

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      // Moving between columns
      const sourceColumn = columns.find((col) => col.id === source.droppableId)!
      const destColumn = columns.find((col) => col.id === destination.droppableId)!
      const sourceItems = [...sourceColumn.tasks]
      const destItems = [...destColumn.tasks]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)

      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, tasks: sourceItems }
          }
          if (col.id === destination.droppableId) {
            return { ...col, tasks: destItems }
          }
          return col
        }),
      )

      toast({
        title: "Task moved",
        description: `Task moved to ${destColumn.title}`,
      })
    } else {
      // Reordering within the same column
      const column = columns.find((col) => col.id === source.droppableId)!
      const copiedItems = [...column.tasks]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)

      setColumns(columns.map((col) => (col.id === source.droppableId ? { ...col, tasks: copiedItems } : col)))
    }
  }

  const addTask = () => {
    if (!newTask.title.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      reminder: newTask.reminder || undefined,
      createdAt: new Date(),
    }

    setColumns(columns.map((col) => (col.id === newTask.columnId ? { ...col, tasks: [...col.tasks, task] } : col)))

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      reminder: "",
      columnId: "todo",
    })
    setIsAddTaskOpen(false)

    toast({
      title: "Task added",
      description: "Your new task has been created successfully.",
    })
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      reminder: task.reminder || "",
      columnId: columns.find((col) => col.tasks.some((t) => t.id === task.id))?.id || "todo",
    })
  }

  const updateTask = () => {
    if (!editingTask || !newTask.title.trim()) return

    const updatedTask: Task = {
      ...editingTask,
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      reminder: newTask.reminder || undefined,
    }

    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) => (task.id === editingTask.id ? updatedTask : task)),
      })),
    )

    setEditingTask(null)
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      reminder: "",
      columnId: "todo",
    })

    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    })
  }

  const deleteTask = (taskId: string) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      })),
    )

    toast({
      title: "Task deleted",
      description: "The task has been removed from your board.",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground mt-2">
            Organize your tasks with drag-and-drop functionality designed for neurodivergent minds.
          </p>
        </div>

        <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>Create a new task to add to your kanban board.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Column</Label>
                  <Select
                    value={newTask.columnId}
                    onValueChange={(value) => setNewTask({ ...newTask, columnId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((column) => (
                        <SelectItem key={column.id} value={column.id}>
                          {column.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder">Reminder (Optional)</Label>
                <Input
                  id="reminder"
                  type="datetime-local"
                  value={newTask.reminder}
                  onChange={(e) => setNewTask({ ...newTask, reminder: e.target.value })}
                />
              </div>

              <Button onClick={addTask} className="w-full">
                Add Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const IconComponent = iconMap[column.iconName] // Get the component from the map
            return (
              <div key={column.id} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${column.color}`}>
                    {IconComponent && <IconComponent className="h-5 w-5" />} {/* Render the component */}
                  </div>
                  <h2 className="text-xl font-semibold">{column.title}</h2>
                  <Badge variant="secondary">{column.tasks.length}</Badge>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[400px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                        snapshot.isDraggingOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                      }`}
                    >
                      <div className="space-y-3">
                        {column.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`cursor-move transition-shadow ${
                                  snapshot.isDragging ? "shadow-lg rotate-2" : "hover:shadow-md"
                                }`}
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex items-start justify-between">
                                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => editTask(task)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-destructive"
                                        onClick={() => deleteTask(task.id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  {task.description && (
                                    <CardDescription className="text-xs mb-3">{task.description}</CardDescription>
                                  )}
                                  <div className="flex items-center justify-between">
                                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                      {task.priority}
                                    </Badge>
                                    {task.reminder && (
                                      <div className="flex items-center text-xs text-muted-foreground">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        {new Date(task.reminder).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update your task details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Task Title</Label>
              <Input
                id="edit-title"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-reminder">Reminder (Optional)</Label>
              <Input
                id="edit-reminder"
                type="datetime-local"
                value={newTask.reminder}
                onChange={(e) => setNewTask({ ...newTask, reminder: e.target.value })}
              />
            </div>

            <Button onClick={updateTask} className="w-full">
              Update Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
