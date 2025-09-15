import Link from "next/link"
import { Button } from "~/app/_components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Pokémon Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">The Pokémon you're looking for doesn't exist or couldn't be found.</p>
            <Button asChild>
              <Link href="/">Return to Pokédex</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
