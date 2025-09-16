"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InsightCategoriesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Insight Categories</h1>
        <p className="text-muted-foreground">
          Manage categories for insights and articles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Categories Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain insight categories management functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}