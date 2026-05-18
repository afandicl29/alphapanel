'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HostingPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hosting Management</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Create, suspend, and manage hosting accounts with package limits and reseller support via AlphaPanel API.
        </p>
      </CardContent>
    </Card>
  );
}
