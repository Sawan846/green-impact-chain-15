import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, RotateCcw, Zap } from "lucide-react";
import { LCAInputs, submitInputs, getInputs, getAIImputations } from "@/services/api";

export default function InputData() {
  const [inputs, setInputs] = useState<LCAInputs>({
    year: "2025",
    scenarioId: "baseline",
    processBoundary: "cradle-to-gate",
    materials: {
      Bauxite_kg: 0,
      CausticSoda_kg: 0,
      CalcinedLime_kg: 0,
      Alumina_kg: 0,
      CalcinedCoke_kg: 0,
      PetrolCoke_kg: 0,
      Anode_kg: 0,
      AlF3_kg: 0,
      Scrap_kg: 0,
    },
    energy: {
      Electricity_MJ_total: 0,
      Alumina_MJ: 0,
      Anode_MJ: 0,
      Electrolysis_MJ: 0,
    },
    resources: {
      FreshWater_m3: 0,
      Refractory_kg: 0,
      Steel_kg: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiImputing, setAiImputing] = useState(false);
  const { toast } = useToast();

  // Load existing inputs on mount
  useEffect(() => {
    loadInputs();
  }, []);

  const loadInputs = async () => {
    try {
      setLoading(true);
      const data = await getInputs();
      setInputs(data);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Using default values instead.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await submitInputs(inputs);
      toast({
        title: "Success",
        description: "LCA inputs saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save inputs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAIImputation = async () => {
    try {
      setAiImputing(true);
      const imputedData = await getAIImputations(inputs);
      setInputs(imputedData);
      toast({
        title: "AI Imputation Complete",
        description: "Missing values have been estimated using Random Forest model.",
      });
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to impute missing values.",
        variant: "destructive",
      });
    } finally {
      setAiImputing(false);
    }
  };

  const updateMaterial = (key: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        [key]: parseFloat(value) || 0,
      },
    }));
  };

  const updateEnergy = (key: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      energy: {
        ...prev.energy,
        [key]: parseFloat(value) || 0,
      },
    }));
  };

  const updateResource = (key: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        [key]: parseFloat(value) || 0,
      },
    }));
  };

  const resetForm = () => {
    setInputs(prev => ({
      ...prev,
      materials: Object.keys(prev.materials).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      energy: Object.keys(prev.energy).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
      resources: Object.keys(prev.resources).reduce((acc, key) => ({ ...acc, [key]: 0 }), {}),
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading inputs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">LCA Input Parameters</h1>
          <p className="text-muted-foreground mt-1">
            Enter material quantities, energy consumption, and process parameters for life cycle assessment.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetForm} disabled={saving}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleAIImputation} 
            disabled={aiImputing || saving}
          >
            {aiImputing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            AI Fill Missing
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Process Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded bg-primary" />
              </div>
              <span>Process Configuration</span>
            </CardTitle>
            <CardDescription>
              Define the scope and boundaries of your LCA analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Analysis Year</Label>
              <Select value={inputs.year} onValueChange={(value) => setInputs(prev => ({ ...prev, year: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scenarioId">Scenario</Label>
              <Select value={inputs.scenarioId} onValueChange={(value) => setInputs(prev => ({ ...prev, scenarioId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select scenario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baseline">Baseline</SelectItem>
                  <SelectItem value="optimized">Optimized</SelectItem>
                  <SelectItem value="renewable">Renewable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="processBoundary">Process Boundary</Label>
              <Select value={inputs.processBoundary} onValueChange={(value) => setInputs(prev => ({ ...prev, processBoundary: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select boundary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cradle-to-gate">Cradle-to-Gate</SelectItem>
                  <SelectItem value="cradle-to-grave">Cradle-to-Grave</SelectItem>
                  <SelectItem value="gate-to-gate">Gate-to-Gate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Materials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Raw Materials (kg)</CardTitle>
            <CardDescription>
              Input quantities of primary materials used in aluminum production.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(inputs.materials).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>
                  {key.replace('_kg', '').replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Input
                  id={key}
                  type="number"
                  step="0.1"
                  min="0"
                  value={value}
                  onChange={(e) => updateMaterial(key, e.target.value)}
                  onFocus={(e) => {
                    if (e.target.value === '0') {
                      e.target.select();
                    }
                  }}
                  className="bg-background"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Energy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Energy Consumption (MJ)</CardTitle>
            <CardDescription>
              Specify energy requirements for each process stage.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(inputs.energy).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>
                  {key.replace('_MJ', '').replace('_total', ' (Total)').replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Input
                  id={key}
                  type="number"
                  step="0.1"
                  min="0"
                  value={value}
                  onChange={(e) => updateEnergy(key, e.target.value)}
                  onFocus={(e) => {
                    if (e.target.value === '0') {
                      e.target.select();
                    }
                  }}
                  className="bg-background"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-success">Additional Resources</CardTitle>
            <CardDescription>
              Other resource requirements and auxiliary materials.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(inputs.resources).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>
                  {key.replace(/_kg|_m3/g, '').replace(/([A-Z])/g, ' $1').trim()}
                  {key.includes('_m3') ? ' (m³)' : key.includes('_kg') ? ' (kg)' : ''}
                </Label>
                <Input
                  id={key}
                  type="number"
                  step="0.1"
                  min="0"
                  value={value}
                  onChange={(e) => updateResource(key, e.target.value)}
                  onFocus={(e) => {
                    if (e.target.value === '0') {
                      e.target.select();
                    }
                  }}
                  className="bg-background"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-primary hover:opacity-90 min-w-[140px]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Inputs
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}