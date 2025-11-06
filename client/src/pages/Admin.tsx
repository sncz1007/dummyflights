import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lock, DollarSign, Download, Calendar, LogOut } from "lucide-react";
import { format } from "date-fns";

type Booking = {
  id: string;
  bookingNumber: string;
  fullName: string;
  email: string;
  passengers: number;
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  paymentStatus: string;
  paymentMethod: string | null;
  totalPaid: string | null;
  bookingPdfDownloaded: boolean;
  receiptPdfDownloaded: boolean;
  bookingPdfDownloadedAt: string | null;
  receiptPdfDownloadedAt: string | null;
  createdAt: string;
};

type AdminStats = {
  totalPayments: number;
  totalRevenue: number;
  successfulPayments: number;
  pdfDownloads: number;
};

const ADMIN_PASSWORD = "Fenix1010@*";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<"all" | "month" | "day">("all");
  const [selectedDate, setSelectedDate] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Contraseña incorrecta");
    }
  };

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/admin/bookings", filterType, selectedDate],
    queryFn: async () => {
      const params = new URLSearchParams({ filterType });
      if (selectedDate) {
        params.append('selectedDate', selectedDate);
      }
      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const { data: stats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats", filterType, selectedDate],
    queryFn: async () => {
      const params = new URLSearchParams({ filterType });
      if (selectedDate) {
        params.append('selectedDate', selectedDate);
      }
      const response = await fetch(`/api/admin/stats?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground mt-2">
              Ingresa tu contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                data-testid="input-admin-password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600" data-testid="text-error">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" data-testid="button-login">
              Ingresar
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const filteredBookings = bookings?.filter(
    (b) => b.paymentStatus === "completed"
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Panel de Administración
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gestión de pagos y descargas
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
              }}
              data-testid="button-logout"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagos Totales</p>
                <p className="text-2xl font-bold" data-testid="text-total-payments">
                  {stats?.totalPayments ?? 0}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600" data-testid="text-total-revenue">
                  ${(stats?.totalRevenue ?? 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagos Exitosos</p>
                <p className="text-2xl font-bold" data-testid="text-successful-payments">
                  {stats?.successfulPayments ?? 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PDFs Descargados</p>
                <p className="text-2xl font-bold" data-testid="text-pdf-downloads">
                  {stats?.pdfDownloads ?? 0}
                </p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="filter-type">Filtrar por periodo</Label>
              <Select
                value={filterType}
                onValueChange={(value: any) => setFilterType(value)}
              >
                <SelectTrigger id="filter-type" data-testid="select-filter-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tiempos</SelectItem>
                  <SelectItem value="month">Por mes</SelectItem>
                  <SelectItem value="day">Por día</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(filterType === "month" || filterType === "day") && (
              <div className="flex-1">
                <Label htmlFor="date-filter">
                  {filterType === "month" ? "Seleccionar mes" : "Seleccionar día"}
                </Label>
                <Input
                  id="date-filter"
                  type={filterType === "month" ? "month" : "date"}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  data-testid="input-date-filter"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Bookings Table */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Historial de Pagos ({filteredBookings.length})
          </h2>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando datos...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay pagos registrados para este periodo
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Booking #</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Pasajeros</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>PDFs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="text-sm">
                        {format(new Date(booking.createdAt), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {booking.bookingNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{booking.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {booking.fromAirport} → {booking.toAirport}
                      </TableCell>
                      <TableCell className="text-center">
                        {booking.passengers}
                      </TableCell>
                      <TableCell>
                        <Badge variant={booking.paymentMethod === "stripe" ? "default" : "secondary"}>
                          {booking.paymentMethod === "stripe" ? "Stripe" : "PayPal"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ${booking.totalPaid || "0.00"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {booking.bookingPdfDownloaded && (
                            <Badge variant="outline" className="text-xs">
                              📄 Booking
                            </Badge>
                          )}
                          {booking.receiptPdfDownloaded && (
                            <Badge variant="outline" className="text-xs">
                              🧾 Receipt
                            </Badge>
                          )}
                          {!booking.bookingPdfDownloaded && !booking.receiptPdfDownloaded && (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
