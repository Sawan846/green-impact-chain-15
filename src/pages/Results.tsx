import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, TrendingUp, TrendingDown, AlertTriangle, User, Bot } from "lucide-react";
import { LCAResults, LCAInputs, getResults, getEnvironmentalMetrics, getInputs } from "@/services/api";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Results() {
  const [results, setResults] = useState<LCAResults | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [inputs, setInputs] = useState<LCAInputs | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      const [resultsData, metricsData, inputsData] = await Promise.all([
        getResults(),
        getEnvironmentalMetrics(),
        getInputs(),
      ]);
      setResults(resultsData);
      setMetrics(metricsData);
      setInputs(inputsData);
    } catch (error) {
      toast({
        title: "Error loading results",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadResults();
    setRefreshing(false);
    toast({
      title: "Results updated",
      description: "Latest analysis data has been loaded.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Analyzing environmental impact...</span>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Results Available</h2>
        <p className="text-muted-foreground mb-4">Please complete the input form first.</p>
        <Button asChild>
          <a href="/">Go to Inputs</a>
        </Button>
      </div>
    );
  }

  const formatNumber = (num: number, decimals = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const getStatusColor = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio <= 1) return "text-success";
    if (ratio <= 1.2) return "text-warning";
    return "text-destructive";
  };

  const getStatusIcon = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio <= 1) return <TrendingDown className="h-4 w-4" />;
    return <TrendingUp className="h-4 w-4" />;
  };

  const getDataSourceBadge = (source: 'user' | 'ai') => {
    if (source === 'user') {
      return (
        <Badge variant="outline" className="ml-2 text-xs">
          <User className="h-3 w-3 mr-1" />
          User Input
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="ml-2 text-xs">
        <Bot className="h-3 w-3 mr-1" />
        AI Predicted
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Environmental Impact Results</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive analysis of your aluminum production lifecycle assessment.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total CO₂ Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatNumber(results.emissions.CO2_kg_total)} kg</div>
            {metrics && (
              <div className={`flex items-center text-sm mt-1 ${getStatusColor(results.emissions.CO2_kg_total, metrics.carbonIntensity.target * 1000)}`}>
                {getStatusIcon(results.emissions.CO2_kg_total, metrics.carbonIntensity.target * 1000)}
                <span className="ml-1">vs {formatNumber(metrics.carbonIntensity.target * 1000)} kg target</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">NOₓ Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{formatNumber(results.emissions.NOx_kg)} kg</div>
            <div className="text-sm text-muted-foreground mt-1">Nitrogen Oxides</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SO₂ Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatNumber(results.emissions.SO2_kg)} kg</div>
            <div className="text-sm text-muted-foreground mt-1">Sulfur Dioxide</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Waste Heat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatNumber(results.energy.WasteHeat_MJ)} MJ</div>
            <div className="text-sm text-muted-foreground mt-1">Recoverable Energy</div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Performance */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance vs Targets</CardTitle>
              <CardDescription>Environmental metrics compared to industry targets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Carbon Intensity</span>
                  <span className={getStatusColor(metrics.carbonIntensity.current, metrics.carbonIntensity.target)}>
                    {formatNumber(metrics.carbonIntensity.current)} / {formatNumber(metrics.carbonIntensity.target)} kg CO₂/kg Al
                  </span>
                </div>
                <Progress value={(metrics.carbonIntensity.target / metrics.carbonIntensity.current) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Water Usage</span>
                  <span className={getStatusColor(metrics.waterUsage.current, metrics.waterUsage.target)}>
                    {formatNumber(metrics.waterUsage.current)} / {formatNumber(metrics.waterUsage.target)} m³/tonne
                  </span>
                </div>
                <Progress value={(metrics.waterUsage.target / metrics.waterUsage.current) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energy Efficiency</span>
                  <span className={getStatusColor(metrics.energyEfficiency.current, metrics.energyEfficiency.target)}>
                    {formatNumber(metrics.energyEfficiency.current)} / {formatNumber(metrics.energyEfficiency.target)} MWh/tonne
                  </span>
                </div>
                <Progress value={(metrics.energyEfficiency.target / metrics.energyEfficiency.current) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Waste Recycling</span>
                  <span className="text-success">
                    {formatNumber(metrics.wasteReduction.current)}% / {formatNumber(metrics.wasteReduction.target)}%
                  </span>
                </div>
                <Progress value={(metrics.wasteReduction.current / metrics.wasteReduction.target) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Industry Comparison</CardTitle>
              <CardDescription>Your performance vs industry averages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Carbon Intensity", current: metrics.carbonIntensity.current, industry: metrics.carbonIntensity.industry_average, unit: "kg CO₂/kg Al" },
                  { label: "Water Usage", current: metrics.waterUsage.current, industry: metrics.waterUsage.industry_average, unit: "m³/tonne" },
                  { label: "Energy Efficiency", current: metrics.energyEfficiency.current, industry: metrics.energyEfficiency.industry_average, unit: "MWh/tonne" },
                  { label: "Waste Recycling", current: metrics.wasteReduction.current, industry: metrics.wasteReduction.industry_average, unit: "%" },
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium text-sm">{metric.label}</div>
                      <div className="text-xs text-muted-foreground">{metric.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">
                        {formatNumber(metric.current)}
                      </div>
                      <div className={`text-xs ${metric.current < metric.industry ? 'text-success' : 'text-warning'}`}>
                        Industry: {formatNumber(metric.industry)}
                      </div>
                    </div>
                    {metric.current < metric.industry && (
                      <Badge variant="outline" className="text-success border-success">
                        Better
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CO2 by Process */}
        <Card>
          <CardHeader>
            <CardTitle>CO₂ Emissions by Process</CardTitle>
            <CardDescription>Breakdown of carbon emissions across production stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={results.chartData?.emissionsByProcess || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value} kg`}
                >
                  {(results.chartData?.emissionsByProcess || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Emission Trends</CardTitle>
            <CardDescription>Historical emissions data over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.chartData?.monthlyTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="CO2" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="NOx" stroke="hsl(var(--accent))" strokeWidth={2} />
                <Line type="monotone" dataKey="SO2" stroke="hsl(var(--warning))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Emissions */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Emissions Inventory</CardTitle>
          <CardDescription>Complete breakdown of all measured emissions and waste products with data sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-primary mb-3">Greenhouse Gases</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CO₂ Total</span>
                  <span className="font-medium">{formatNumber(results.emissions.CO2_kg_total)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CF₄</span>
                  <span className="font-medium">{formatNumber(results.emissions.CF4_kg)} kg</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-accent mb-3">Air Pollutants</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">NOₓ</span>
                  <span className="font-medium">{formatNumber(results.emissions.NOx_kg)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">SO₂</span>
                  <span className="font-medium">{formatNumber(results.emissions.SO2_kg)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">PAH</span>
                  <span className="font-medium">{formatNumber(results.emissions.PAH_g)} g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">NMVOC</span>
                  <span className="font-medium">{formatNumber(results.emissions.NMVOC_kg)} kg</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-success mb-3">Solid Waste</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bauxite Residue</span>
                  <span className="font-medium">{formatNumber(results.waste.SolidWaste_BauxiteResidue_kg)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Alumina Waste</span>
                  <span className="font-medium">{formatNumber(results.waste.AluminaWaste_kg)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Red Mud</span>
                  <span className="font-medium">{formatNumber(results.waste.RedMud_kg)} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input Parameters with Data Sources */}
          {inputs?.dataSources && (
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-semibold text-foreground mb-4">Input Parameters & Data Sources</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-medium text-primary mb-3">Materials (kg)</h5>
                  <div className="space-y-2">
                    {Object.entries(inputs.materials).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm">{key.replace('_kg', '').replace(/([A-Z])/g, ' $1').trim()}</span>
                          {getDataSourceBadge(inputs.dataSources!.materials[key])}
                        </div>
                        <span className="font-medium">{formatNumber(value as number)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-accent mb-3">Energy (MJ)</h5>
                  <div className="space-y-2">
                    {Object.entries(inputs.energy).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm">{key.replace('_MJ', '').replace('_total', ' (Total)').replace(/([A-Z])/g, ' $1').trim()}</span>
                          {getDataSourceBadge(inputs.dataSources!.energy[key])}
                        </div>
                        <span className="font-medium">{formatNumber(value as number)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-success mb-3">Resources</h5>
                  <div className="space-y-2">
                    {Object.entries(inputs.resources).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-sm">
                            {key.replace(/_kg|_m3/g, '').replace(/([A-Z])/g, ' $1').trim()}
                            {key.includes('_m3') ? ' (m³)' : key.includes('_kg') ? ' (kg)' : ''}
                          </span>
                          {getDataSourceBadge(inputs.dataSources!.resources[key])}
                        </div>
                        <span className="font-medium">{formatNumber(value as number)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}