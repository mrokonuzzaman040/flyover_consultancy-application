"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudyAbroadStepsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Study Abroad Steps</h1>
        <p className="text-muted-foreground">
          Manage the step-by-step process for studying abroad
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Steps Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain study abroad steps management functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}