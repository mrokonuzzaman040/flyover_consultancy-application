"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WhyChooseUsFeaturesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Why Choose Us Features</h1>
        <p className="text-muted-foreground">
          Manage features that highlight why students should choose your services
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Features Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This page will contain why choose us features management functionality.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}