import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LogOut, Wrench, Package, BarChart3, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCokeAdminOverview } from "@/services/dashboard";
import { logout } from "@/services/authService";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [overview, setOverview] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await getCokeAdminOverview(page, 20);
      if (res.status === 200) {
        setOverview(res.data);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "Successfully signed out." });
    navigate("/auth");
  };

  const stats = overview?.stats?.totals || {};
  const monthlyData = overview?.stats?.maintenanceByMonth || [];
  const byNature = overview?.stats?.maintenanceByNature || {};
  const tableItems = overview?.maintenanceTable?.items || [];

  // Prepare pie chart data
  const pieData = Object.keys(byNature).map((key) => ({
    name: key,
    value: byNature[key],
  }));
  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">Coke Admin Dashboard</h1>
            {overview?.site?.name && (
              <span className="ml-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary animate-pulse">
                {overview.site.name}
              </span>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout} size="sm">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto space-y-10 p-6">
        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Sites" value={stats.sites || 0} icon={Package} />
          <StatsCard title="Lifters" value={stats.lifters || 0} icon={BarChart3} />
          <StatsCard title="Maintenance" value={stats.maintenance || 0} icon={Wrench} />
          <StatsCard title="Breakdowns" value={stats.breakdowns || 0} icon={Clock} />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Maintenance Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[340px]">
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} name="Total Maintenances" />
                    <Line
                      type="monotone"
                      dataKey={() => parseFloat(overview.stats.avgDowntimeHrs)}
                      name="Avg Downtime (hrs)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Maintenance by Nature</CardTitle>
            </CardHeader>
            <CardContent className="h-[340px] flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name} (${value})`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Maintenance Table */}
        <Card className="border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Maintenance Records</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {tableItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No maintenance records found.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full border-collapse bg-white text-sm">
                  <thead className="sticky top-0 bg-gray-100 text-gray-700 text-left">
                    <tr>
                      <th className="px-3 py-2 border">#</th>
                      <th className="px-3 py-2 border">Lifter</th>
                      <th className="px-3 py-2 border">Nature</th>
                      <th className="px-3 py-2 border">Work Description</th>
                      <th className="px-3 py-2 border">Mechanic</th>
                      <th className="px-3 py-2 border">In Date</th>
                      <th className="px-3 py-2 border">Out Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableItems.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`transition-colors hover:bg-gray-50 ${
                          index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                        }`}
                      >
                        <td className="px-3 py-2 border font-medium text-gray-900">
                          {item.srNumber}
                        </td>
                        <td className="px-3 py-2 border">
                          {item.liftId?.lifterNumber || "N/A"}
                        </td>
                        <td className="px-3 py-2 border">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item.natureOfRepair === "Repair"
                                ? "bg-blue-100 text-blue-800"
                                : item.natureOfRepair === "General Checkup"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {item.natureOfRepair}
                          </span>
                        </td>
                        <td className="px-3 py-2 border text-gray-700">
                          {item.descriptionOfWork}
                        </td>
                        <td className="px-3 py-2 border text-gray-700">
                          {item.mechanicName}
                        </td>
                        <td className="px-3 py-2 border">
                          {new Date(item.inDate).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 border">
                          {new Date(item.outDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {overview?.maintenanceTable?.meta?.page || 1}
              </span>
              <Button onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
