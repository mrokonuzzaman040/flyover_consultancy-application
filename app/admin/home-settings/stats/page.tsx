"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StatsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Statistics Management</h1>
        <p className="text-muted-foreground">
          Manage company statistics and achievements
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistics Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain statistics management functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}