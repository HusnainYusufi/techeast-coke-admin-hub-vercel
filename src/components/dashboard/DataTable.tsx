import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface DataRow {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: "completed" | "pending" | "cancelled";
  date: string;
}

const mockData: DataRow[] = [
  { id: "1", customer: "John Doe", product: "Coca-Cola Classic 24pk", amount: "$48.99", status: "completed", date: "2025-01-15" },
  { id: "2", customer: "Jane Smith", product: "Diet Coke 12pk", amount: "$24.50", status: "completed", date: "2025-01-15" },
  { id: "3", customer: "Bob Johnson", product: "Sprite Zero 6pk", amount: "$12.99", status: "pending", date: "2025-01-14" },
  { id: "4", customer: "Alice Brown", product: "Fanta Orange 12pk", amount: "$22.99", status: "completed", date: "2025-01-14" },
  { id: "5", customer: "Charlie Wilson", product: "Coca-Cola Zero 24pk", amount: "$46.99", status: "cancelled", date: "2025-01-13" },
  { id: "6", customer: "Eva Martinez", product: "Powerade Mountain Berry", amount: "$34.99", status: "completed", date: "2025-01-13" },
  { id: "7", customer: "David Lee", product: "Minute Maid Orange", amount: "$28.50", status: "pending", date: "2025-01-12" },
  { id: "8", customer: "Sarah Chen", product: "Dasani Water 24pk", amount: "$18.99", status: "completed", date: "2025-01-12" },
];

export const DataTable = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = mockData.filter(
    (row) =>
      row.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: DataRow["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by customer or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Product</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">#{row.id}</TableCell>
                <TableCell>{row.customer}</TableCell>
                <TableCell>{row.product}</TableCell>
                <TableCell className="font-semibold">{row.amount}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(row.status)} variant="secondary">
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
