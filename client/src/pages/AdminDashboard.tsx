import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Quote } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Users, FileText, TrendingUp, LogOut, Home } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'wouter';

export default function AdminDashboard() {
  const { user, logoutMutation } = useAuth();

  const { data: quotes = [], isLoading } = useQuery<Quote[]>({
    queryKey: ['/api/quotes'],
  });

  const stats = {
    total: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    processed: quotes.filter(q => q.processed).length,
    recent: quotes.filter(q => {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return new Date(q.createdAt!) > dayAgo;
    }).length,
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-full p-2">
                <Plane className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">SkyBudgetFly Admin</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button variant="outline" size="sm" data-testid="button-home">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout} data-testid="button-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-stat-total">
            <CardHeader className="pb-3">
              <CardDescription>Total Quotes</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="h-4 w-4 mr-2" />
                All time
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-pending">
            <CardHeader className="pb-3">
              <CardDescription>Pending Quotes</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                Awaiting response
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-processed">
            <CardHeader className="pb-3">
              <CardDescription>Processed</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.processed}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-2" />
                Completed
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-recent">
            <CardHeader className="pb-3">
              <CardDescription>Recent (24h)</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.recent}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 mr-2" />
                New requests
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Requests</CardTitle>
            <CardDescription>Manage all customer flight quote requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all-quotes">All</TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending-quotes">Pending</TabsTrigger>
                <TabsTrigger value="processed" data-testid="tab-processed-quotes">Processed</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <QuotesTable quotes={quotes} />
              </TabsContent>

              <TabsContent value="pending" className="mt-4">
                <QuotesTable quotes={quotes.filter(q => q.status === 'pending')} />
              </TabsContent>

              <TabsContent value="processed" className="mt-4">
                <QuotesTable quotes={quotes.filter(q => q.processed)} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function QuotesTable({ quotes }: { quotes: Quote[] }) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid="text-no-quotes">
        No quotes found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Quote #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Passengers</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow key={quote.id} data-testid={`row-quote-${quote.id}`}>
              <TableCell className="font-medium" data-testid={`cell-quote-number-${quote.id}`}>
                {quote.quoteNumber}
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{quote.fullName}</div>
                  <div className="text-sm text-muted-foreground">{quote.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{quote.fromAirport} → {quote.toAirport}</div>
                  <div className="text-muted-foreground capitalize">{quote.tripType}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(new Date(quote.departureDate), 'MMM dd, yyyy')}
                </div>
              </TableCell>
              <TableCell>{quote.passengers}</TableCell>
              <TableCell>
                <Badge variant={quote.processed ? 'default' : 'secondary'}>
                  {quote.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(quote.createdAt!), 'MMM dd, yyyy HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
