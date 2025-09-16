"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SliderPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Slider Management</h1>
        <p className="text-muted-foreground">
          Manage homepage slider content and images
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Slider Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain slider management functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}