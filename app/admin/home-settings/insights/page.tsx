"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InsightsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Insights Management</h1>
        <p className="text-muted-foreground">
          Manage insights and educational content
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain insights management functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}