import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, GitBranch, TrendingUp, TrendingDown, Zap, Leaf, DollarSign } from "lucide-react";
import { Scenario, getScenarios, compareScenarios } from "@/services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

export default function Scenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState<{
    bar?: any[];
    radar?: any[];
    scenarios?: Scenario[];
  }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const data = await getScenarios();
      setScenarios(data);
      // Auto-select first two scenarios
      if (data.length >= 2) {
        setSelectedScenarios([data[0].id, data[1].id]);
      }
    } catch (error) {
      toast({
        title: "Error loading scenarios",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (selectedScenarios.length < 2) {
      toast({
        title: "Select scenarios",
        description: "Please select at least 2 scenarios to compare.",
        variant: "destructive",
      });
      return;
    }

    try {
      setComparing(true);
      const data = await compareScenarios(selectedScenarios);
      
      // Prepare comparison data for charts
      const chartData = data.map(scenario => ({
        name: scenario.name,
        CO2: scenario.metrics.CO2_kg,
        Cost: scenario.metrics.cost_usd,
        Efficiency: scenario.metrics.efficiency * 100,
        Renewable: scenario.metrics.renewable_percent,
      }));
      
      const radarData = [
        {
          metric: 'CO2 Reduction',
          ...data.reduce((acc, scenario) => {
            acc[scenario.name] = Math.max(0, 100 - (scenario.metrics.CO2_kg / 2000 * 100));
            return acc;
          }, {} as any)
        },
        {
          metric: 'Cost Efficiency',
          ...data.reduce((acc, scenario) => {
            acc[scenario.name] = Math.max(0, 100 - (scenario.metrics.cost_usd / 2000 * 100));
            return acc;
          }, {} as any)
        },
        {
          metric: 'Process Efficiency',
          ...data.reduce((acc, scenario) => {
            acc[scenario.name] = scenario.metrics.efficiency * 100;
            return acc;
          }, {} as any)
        },
        {
          metric: 'Renewable Energy',
          ...data.reduce((acc, scenario) => {
            acc[scenario.name] = scenario.metrics.renewable_percent;
            return acc;
          }, {} as any)
        }
      ];

      setComparisonData({ bar: chartData, radar: radarData, scenarios: data });
      
      toast({
        title: "Comparison complete",
        description: `Successfully compared ${data.length} scenarios.`,
      });
    } catch (error) {
      toast({
        title: "Comparison failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setComparing(false);
    }
  };

  const toggleScenario = (scenarioId: string) => {
    setSelectedScenarios(prev => 
      prev.includes(scenarioId)
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  const getScenarioIcon = (scenarioId: string) => {
    switch (scenarioId) {
      case 'baseline': return <Zap className="h-5 w-5" />;
      case 'renewable': return <Leaf className="h-5 w-5" />;
      case 'optimized': return <TrendingUp className="h-5 w-5" />;
      default: return <GitBranch className="h-5 w-5" />;
    }
  };

  const getScenarioColor = (scenarioId: string) => {
    switch (scenarioId) {
      case 'baseline': return 'bg-muted';
      case 'renewable': return 'bg-primary/10 border-primary/20';
      case 'optimized': return 'bg-success/10 border-success/20';
      default: return 'bg-muted';
    }
  };

  const formatNumber = (num: number, decimals = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading scenarios...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scenario Comparison</h1>
          <p className="text-muted-foreground mt-1">
            Compare different production scenarios to optimize environmental and economic outcomes.
          </p>
        </div>
        <Button
          onClick={handleCompare}
          disabled={comparing || selectedScenarios.length < 2}
          className="bg-gradient-primary hover:opacity-90"
        >
          {comparing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Comparing...
            </>
          ) : (
            <>
              <GitBranch className="h-4 w-4 mr-2" />
              Compare Selected
            </>
          )}
        </Button>
      </div>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Available Scenarios</CardTitle>
          <CardDescription>
            Select scenarios to compare their environmental and economic performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedScenarios.includes(scenario.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${getScenarioColor(scenario.id)}`}
                onClick={() => toggleScenario(scenario.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getScenarioIcon(scenario.id)}
                    <div>
                      <h3 className="font-semibold">{scenario.name}</h3>
                      <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    </div>
                  </div>
                  <Checkbox
                    checked={selectedScenarios.includes(scenario.id)}
                    onChange={() => toggleScenario(scenario.id)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">CO₂:</span>
                    <span className="font-medium">{formatNumber(scenario.metrics.CO2_kg)} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="font-medium">${formatNumber(scenario.metrics.cost_usd)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Efficiency:</span>
                    <span className="font-medium">{formatNumber(scenario.metrics.efficiency * 100)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Renewable:</span>
                    <span className="font-medium">{formatNumber(scenario.metrics.renewable_percent)}%</span>
                  </div>
                </div>

                {scenario.id === 'optimized' && (
                  <Badge className="mt-2 bg-success text-success-foreground">
                    Recommended
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Results */}
      {comparisonData.scenarios && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comparisonData.scenarios.map((scenario: Scenario) => (
              <Card key={scenario.id} className={getScenarioColor(scenario.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    {getScenarioIcon(scenario.id)}
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  </div>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-4 w-4 text-primary" />
                        <span className="text-sm">CO₂ Emissions</span>
                      </div>
                      <span className="font-bold text-primary">{formatNumber(scenario.metrics.CO2_kg)} kg</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-accent" />
                        <span className="text-sm">Production Cost</span>
                      </div>
                      <span className="font-bold text-accent">${formatNumber(scenario.metrics.cost_usd)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-success" />
                        <span className="text-sm">Process Efficiency</span>
                      </div>
                      <span className="font-bold text-success">{formatNumber(scenario.metrics.efficiency * 100)}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Leaf className="h-4 w-4 text-warning" />
                        <span className="text-sm">Renewable Energy</span>
                      </div>
                      <span className="font-bold text-warning">{formatNumber(scenario.metrics.renewable_percent)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Metric Comparison</CardTitle>
                <CardDescription>Side-by-side comparison of key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData.bar}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="CO2" fill="hsl(var(--primary))" name="CO₂ (kg)" />
                    <Bar dataKey="Cost" fill="hsl(var(--accent))" name="Cost ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>Comprehensive performance profile across all scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={comparisonData.radar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    {comparisonData.scenarios.map((scenario: Scenario, index: number) => (
                      <Radar
                        key={scenario.id}
                        name={scenario.name}
                        dataKey={scenario.name}
                        stroke={index === 0 ? "hsl(var(--primary))" : index === 1 ? "hsl(var(--accent))" : "hsl(var(--success))"}
                        fill={index === 0 ? "hsl(var(--primary))" : index === 1 ? "hsl(var(--accent))" : "hsl(var(--success))"}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Best Practices Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions based on scenario analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Leaf className="h-5 w-5 text-success" />
                    <h4 className="font-semibold text-success">Environmental Optimization</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Transitioning to the Renewable scenario could reduce CO₂ emissions by{' '}
                    {Math.round(((comparisonData.scenarios[0].metrics.CO2_kg - comparisonData.scenarios[1].metrics.CO2_kg) / comparisonData.scenarios[0].metrics.CO2_kg) * 100)}%
                    {' '}while maintaining operational efficiency.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <h4 className="font-semibold text-accent">Economic Considerations</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The optimized scenario has higher upfront costs but offers 
                    {' '}{formatNumber((comparisonData.scenarios[2]?.metrics.efficiency - comparisonData.scenarios[0]?.metrics.efficiency) * 100)}%
                    {' '}better efficiency, leading to long-term savings.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-primary">Implementation Strategy</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider phased implementation: Start with renewable energy integration, 
                    then optimize process efficiency, and finally implement full circular economy practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}