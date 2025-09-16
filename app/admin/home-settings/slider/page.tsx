"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface Slide {
  id?: string
  image: string
  headline: string
  sub: string
  primary: {
    label: string
    isModal?: boolean
    href?: string
  }
  secondary: {
    label: string
    href?: string
    isModal?: boolean
  }
}

export default function SliderPage() {
  const router = useRouter()
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch slides
  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/slides')
      if (response.ok) {
        const data = await response.json()
        setSlides(data.slides || [])
      } else {
        toast.error('Failed to fetch slides')
      }
    } catch {
      toast.error('Error fetching slides')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlides()
  }, [])



  // Handle delete
  const handleDelete = async (slideId: string) => {
    try {
      const response = await fetch(`/api/admin/slides?id=${slideId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Slide deleted successfully')
        fetchSlides()
      } else {
        toast.error('Failed to delete slide')
      }
    } catch {
      toast.error('Error deleting slide')
    }
  }

  // Handle edit
  const handleEdit = (slide: Slide) => {
    router.push(`/admin/home-settings/slider/edit/${slide.id}`)
  }

  // Handle new slide
  const handleNew = () => {
    router.push('/admin/home-settings/slider/create')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Slider Management</h1>
          <p className="text-muted-foreground">
            Manage homepage slider content and images
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Slide
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Slides ({slides.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading slides...</p>
            </div>
          ) : slides.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No slides found</p>
              <Button onClick={handleNew}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Slide
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Headline</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Primary Button</TableHead>
                  <TableHead>Secondary Button</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide, index) => (
                  <TableRow key={slide.id || index}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs">
                          IMG
                        </div>
                        <span className="text-sm text-muted-foreground font-mono">
                          {slide.image}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {slide.headline}
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate text-muted-foreground">
                      {slide.sub}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{slide.primary.label}</span>
                        {slide.primary.isModal ? (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Modal</span>
                        ) : (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{slide.secondary.label}</span>
                        {slide.secondary.isModal ? (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Modal</span>
                        ) : (
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(slide)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Slide</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this slide? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(slide.id || index.toString())}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}