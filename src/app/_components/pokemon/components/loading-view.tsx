import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"

export function LoadingView() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Loading Pokémon...</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </CardContent>
    </Card>
  );
}
