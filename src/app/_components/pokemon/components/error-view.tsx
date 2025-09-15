import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card"

export function ErrorView({ message }: { message: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-destructive">{message}</p>
      </CardContent>
    </Card>
  );
}
