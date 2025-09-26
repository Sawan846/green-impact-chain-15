import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, DollarSign, TrendingUp, TrendingDown, Clock, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type LCCResults, getLCCResults } from "@/services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export default function LCCResults() {
  const [results, setResults] = useState<LCCResults | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const data = await getLCCResults();
      setResults(data);
      toast({
        title: "Results Loaded",
        description: "LCC calculation results loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load LCC results",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, suffix = '') => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value) + suffix;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Calculating LCC results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Results Available</h2>
        <p className="text-muted-foreground">Please input data first to see LCC calculations.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <DollarSign className="mr-3 h-8 w-8 text-primary" />
            Life Cycle Costing Results
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive financial analysis and cost breakdown
          </p>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operating Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(results.totalOperatingCost)}</div>
            <p className="text-xs text-muted-foreground">
              Combined operational expenses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Difference</CardTitle>
            {results.npvDifference > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(Math.abs(results.npvDifference))}</div>
            <p className="text-xs text-muted-foreground">
              {results.npvDifference > 0 ? "Recycled saves" : "Virgin saves"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Difference</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(Math.abs(results.roiDifference), '%')}</div>
            <p className="text-xs text-muted-foreground">
              {results.roiDifference > 0 ? "Recycled advantage" : "Virgin advantage"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payback Difference</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(Math.abs(results.paybackDifference), ' yrs')}</div>
            <p className="text-xs text-muted-foreground">
              {results.paybackDifference < 0 ? "Recycled faster" : "Virgin faster"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Distribution of operational costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={results.chartData.costBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {results.chartData.costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Virgin vs Recycled Comparison</CardTitle>
            <CardDescription>Financial metrics comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.chartData.virginVsRecycled}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => {
                  if (typeof value === 'number') {
                    return value > 100 ? formatCurrency(value) : formatNumber(value, value < 50 ? '%' : '');
                  }
                  return value;
                }} />
                <Bar dataKey="virgin" fill="#ef4444" name="Virgin" />
                <Bar dataKey="recycled" fill="#10b981" name="Recycled" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Financial Metrics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Virgin Material Process</CardTitle>
            <CardDescription>Financial metrics for virgin material approach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Cost</span>
              <span className="font-bold">{formatCurrency(results.totalCostVirgin)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Net Present Value</span>
              <span className="font-bold">{formatCurrency(results.npvVirgin)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Return on Investment</span>
              <span className="font-bold">{formatNumber(results.roiVirgin, '%')}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>ROI Progress</span>
                <span>{formatNumber(results.roiVirgin, '%')}</span>
              </div>
              <Progress value={Math.min(results.roiVirgin * 5, 100)} className="h-2" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payback Period</span>
              <span className="font-bold">{formatNumber(results.paybackPeriodVirgin, ' years')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recycled Material Process</CardTitle>
            <CardDescription>Financial metrics for recycled material approach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Cost</span>
              <span className="font-bold">{formatCurrency(results.totalCostRecycled)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Net Present Value</span>
              <span className="font-bold">{formatCurrency(results.npvRecycled)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Return on Investment</span>
              <span className="font-bold">{formatNumber(results.roiRecycled, '%')}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>ROI Progress</span>
                <span>{formatNumber(results.roiRecycled, '%')}</span>
              </div>
              <Progress value={Math.min(results.roiRecycled * 5, 100)} className="h-2" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payback Period</span>
              <span className="font-bold">{formatNumber(results.paybackPeriodRecycled, ' years')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Component Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Component Analysis</CardTitle>
          <CardDescription>Detailed breakdown of cost components</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Labor Costs</div>
            <div className="text-xl font-bold">{formatCurrency(results.totalLaborCost)}</div>
            <div className="text-xs text-muted-foreground">
              {((results.totalLaborCost / results.totalOperatingCost) * 100).toFixed(1)}% of total
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Equipment Costs</div>
            <div className="text-xl font-bold">{formatCurrency(results.totalEquipmentCost)}</div>
            <div className="text-xs text-muted-foreground">
              {((results.totalEquipmentCost / results.totalOperatingCost) * 100).toFixed(1)}% of total
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Material Costs</div>
            <div className="text-xl font-bold">{formatCurrency(results.totalMaterialCost)}</div>
            <div className="text-xs text-muted-foreground">
              {((results.totalMaterialCost / results.totalOperatingCost) * 100).toFixed(1)}% of total
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Environmental Costs</div>
            <div className="text-xl font-bold">{formatCurrency(results.totalEnvironmentalRegulatoryCost)}</div>
            <div className="text-xs text-muted-foreground">
              {((results.totalEnvironmentalRegulatoryCost / results.totalOperatingCost) * 100).toFixed(1)}% of total
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Trends</CardTitle>
          <CardDescription>Monthly cost and performance trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={results.chartData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalCost" stroke="#ef4444" name="Total Cost" />
              <Line type="monotone" dataKey="npv" stroke="#10b981" name="NPV" />
              <Line type="monotone" dataKey="roi" stroke="#3b82f6" name="ROI" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}