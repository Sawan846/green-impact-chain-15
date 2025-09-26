import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Loader2, Save, RotateCcw, Zap, DollarSign, Info } from "lucide-react";
import { LCCInputs, submitLCCInputs, getLCCInputs, getLCCAIImputations } from "@/services/api";

export default function LCCInputData() {
  const [inputs, setInputs] = useState<LCCInputs>({
    state: "",
    energyPrice: 0,
    mineWorkerWage: 0,
    skilledLaborWage: 0,
    excavatorCost: 0,
    haulTruckCost: 0,
    crusherCost: 0,
    coalCost: 0,
    ironOreCost: 0,
    aluminumOreCost: 0,
    limestoneCost: 0,
    bauxiteCost: 0,
    marbleCost: 0,
    dieselTransportCost: 0,
    railTransportCost: 0,
    environmentalPenalty: 0,
    regulatoryComplianceCost: 0,
    mineWorkersCount: 0,
    skilledWorkersCount: 0,
    excavatorsCount: 0,
    haulTrucksCount: 0,
    crushersCount: 0,
    dataSources: {
      state: 'user',
      energyPrice: 'user',
      mineWorkerWage: 'user',
      skilledLaborWage: 'user',
      excavatorCost: 'user',
      haulTruckCost: 'user',
      crusherCost: 'user',
      coalCost: 'user',
      ironOreCost: 'user',
      aluminumOreCost: 'user',
      limestoneCost: 'user',
      bauxiteCost: 'user',
      marbleCost: 'user',
      dieselTransportCost: 'user',
      railTransportCost: 'user',
      environmentalPenalty: 'user',
      regulatoryComplianceCost: 'user',
      mineWorkersCount: 'user',
      skilledWorkersCount: 'user',
      excavatorsCount: 'user',
      haulTrucksCount: 'user',
      crushersCount: 'user',
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiImputing, setAiImputing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadInputs();
  }, []);

  const loadInputs = async () => {
    try {
      setLoading(true);
      const data = await getLCCInputs();
      setInputs(data);
      toast({
        title: "Data Loaded",
        description: "LCC input data loaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load LCC input data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await submitLCCInputs(inputs);
      toast({
        title: "Success",
        description: "LCC input data saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to save LCC input data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAIImputation = async () => {
    try {
      setAiImputing(true);
      const imputedData = await getLCCAIImputations(inputs);
      setInputs(imputedData);
      toast({
        title: "AI Imputation Complete",
        description: "Missing values have been predicted using AI models",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform AI imputation",
        variant: "destructive",
      });
    } finally {
      setAiImputing(false);
    }
  };

  const updateField = (field: keyof Omit<LCCInputs, 'dataSources'>, value: string | number) => {
    setInputs(prev => ({
      ...prev,
      [field]: value,
      dataSources: {
        ...prev.dataSources!,
        [field]: 'user'
      }
    }));
  };

  const resetForm = () => {
    const emptyInputs: LCCInputs = {
      state: "",
      energyPrice: 0,
      mineWorkerWage: 0,
      skilledLaborWage: 0,
      excavatorCost: 0,
      haulTruckCost: 0,
      crusherCost: 0,
      coalCost: 0,
      ironOreCost: 0,
      aluminumOreCost: 0,
      limestoneCost: 0,
      bauxiteCost: 0,
      marbleCost: 0,
      dieselTransportCost: 0,
      railTransportCost: 0,
      environmentalPenalty: 0,
      regulatoryComplianceCost: 0,
      mineWorkersCount: 0,
      skilledWorkersCount: 0,
      excavatorsCount: 0,
      haulTrucksCount: 0,
      crushersCount: 0,
      dataSources: {
        state: 'user',
        energyPrice: 'user',
        mineWorkerWage: 'user',
        skilledLaborWage: 'user',
        excavatorCost: 'user',
        haulTruckCost: 'user',
        crusherCost: 'user',
        coalCost: 'user',
        ironOreCost: 'user',
        aluminumOreCost: 'user',
        limestoneCost: 'user',
        bauxiteCost: 'user',
        marbleCost: 'user',
        dieselTransportCost: 'user',
        railTransportCost: 'user',
        environmentalPenalty: 'user',
        regulatoryComplianceCost: 'user',
        mineWorkersCount: 'user',
        skilledWorkersCount: 'user',
        excavatorsCount: 'user',
        haulTrucksCount: 'user',
        crushersCount: 'user',
      },
    };
    setInputs(emptyInputs);
    toast({
      title: "Form Reset",
      description: "All input fields have been cleared",
    });
  };

  const getDataSourceBadge = (field: keyof Omit<LCCInputs, 'dataSources'>) => {
    const source = inputs.dataSources?.[field];
    if (source === 'ai') {
      return <Badge variant="secondary" className="ml-2 text-xs">AI Predicted</Badge>;
    } else if (source === 'user') {
      return <Badge variant="default" className="ml-2 text-xs">User Input</Badge>;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading LCC input data...</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <DollarSign className="mr-3 h-8 w-8 text-primary" />
              Life Cycle Costing (LCC)
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter cost parameters for comprehensive financial analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm} disabled={saving || aiImputing}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button variant="secondary" onClick={handleAIImputation} disabled={saving || aiImputing}>
              {aiImputing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              AI Fill Missing
            </Button>
            <Button onClick={handleSubmit} disabled={saving || aiImputing}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Inputs
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Location & Energy */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Energy Costs</CardTitle>
              <CardDescription>Location-specific cost parameters</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state" className="flex items-center">
                  State/Region
                  {getDataSourceBadge('state')}
                </Label>
                <Select value={inputs.state} onValueChange={(value) => updateField('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state/region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Queensland">Queensland</SelectItem>
                    <SelectItem value="WesternAustralia">Western Australia</SelectItem>
                    <SelectItem value="NewSouthWales">New South Wales</SelectItem>
                    <SelectItem value="Victoria">Victoria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="energyPrice" className="flex items-center">
                  Energy Price (USD/kWh)
                  {getDataSourceBadge('energyPrice')}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-1 h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Average industrial electricity rate</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Input
                  id="energyPrice"
                  type="number"
                  step="0.01"
                  value={inputs.energyPrice}
                  onChange={(e) => updateField('energyPrice', parseFloat(e.target.value) || 0)}
                  placeholder="3.8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Labor Costs */}
          <Card>
            <CardHeader>
              <CardTitle>Labor Costs</CardTitle>
              <CardDescription>Workforce cost parameters</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mineWorkerWage" className="flex items-center">
                  Mine Worker Wage (USD/hour)
                  {getDataSourceBadge('mineWorkerWage')}
                </Label>
                <Input
                  id="mineWorkerWage"
                  type="number"
                  step="0.1"
                  value={inputs.mineWorkerWage}
                  onChange={(e) => updateField('mineWorkerWage', parseFloat(e.target.value) || 0)}
                  placeholder="22.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skilledLaborWage" className="flex items-center">
                  Skilled Labor Wage (USD/hour)
                  {getDataSourceBadge('skilledLaborWage')}
                </Label>
                <Input
                  id="skilledLaborWage"
                  type="number"
                  step="0.1"
                  value={inputs.skilledLaborWage}
                  onChange={(e) => updateField('skilledLaborWage', parseFloat(e.target.value) || 0)}
                  placeholder="35.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mineWorkersCount" className="flex items-center">
                  Mine Workers Count
                  {getDataSourceBadge('mineWorkersCount')}
                </Label>
                <Input
                  id="mineWorkersCount"
                  type="number"
                  value={inputs.mineWorkersCount}
                  onChange={(e) => updateField('mineWorkersCount', parseInt(e.target.value) || 0)}
                  placeholder="15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skilledWorkersCount" className="flex items-center">
                  Skilled Workers Count
                  {getDataSourceBadge('skilledWorkersCount')}
                </Label>
                <Input
                  id="skilledWorkersCount"
                  type="number"
                  value={inputs.skilledWorkersCount}
                  onChange={(e) => updateField('skilledWorkersCount', parseInt(e.target.value) || 0)}
                  placeholder="8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipment Costs */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Costs</CardTitle>
              <CardDescription>Machinery and equipment costs</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="excavatorCost" className="flex items-center">
                  Excavator Cost (USD)
                  {getDataSourceBadge('excavatorCost')}
                </Label>
                <Input
                  id="excavatorCost"
                  type="number"
                  value={inputs.excavatorCost}
                  onChange={(e) => updateField('excavatorCost', parseFloat(e.target.value) || 0)}
                  placeholder="450000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="haulTruckCost" className="flex items-center">
                  Haul Truck Cost (USD)
                  {getDataSourceBadge('haulTruckCost')}
                </Label>
                <Input
                  id="haulTruckCost"
                  type="number"
                  value={inputs.haulTruckCost}
                  onChange={(e) => updateField('haulTruckCost', parseFloat(e.target.value) || 0)}
                  placeholder="320000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crusherCost" className="flex items-center">
                  Crusher Cost (USD)
                  {getDataSourceBadge('crusherCost')}
                </Label>
                <Input
                  id="crusherCost"
                  type="number"
                  value={inputs.crusherCost}
                  onChange={(e) => updateField('crusherCost', parseFloat(e.target.value) || 0)}
                  placeholder="180000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excavatorsCount" className="flex items-center">
                  Excavators Count
                  {getDataSourceBadge('excavatorsCount')}
                </Label>
                <Input
                  id="excavatorsCount"
                  type="number"
                  value={inputs.excavatorsCount}
                  onChange={(e) => updateField('excavatorsCount', parseInt(e.target.value) || 0)}
                  placeholder="3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="haulTrucksCount" className="flex items-center">
                  Haul Trucks Count
                  {getDataSourceBadge('haulTrucksCount')}
                </Label>
                <Input
                  id="haulTrucksCount"
                  type="number"
                  value={inputs.haulTrucksCount}
                  onChange={(e) => updateField('haulTrucksCount', parseInt(e.target.value) || 0)}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crushersCount" className="flex items-center">
                  Crushers Count
                  {getDataSourceBadge('crushersCount')}
                </Label>
                <Input
                  id="crushersCount"
                  type="number"
                  value={inputs.crushersCount}
                  onChange={(e) => updateField('crushersCount', parseInt(e.target.value) || 0)}
                  placeholder="2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Material Costs */}
          <Card>
            <CardHeader>
              <CardTitle>Material Costs</CardTitle>
              <CardDescription>Raw material costs (USD/tonne)</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="coalCost" className="flex items-center">
                  Coal Cost {getDataSourceBadge('coalCost')}
                </Label>
                <Input
                  id="coalCost"
                  type="number"
                  value={inputs.coalCost}
                  onChange={(e) => updateField('coalCost', parseFloat(e.target.value) || 0)}
                  placeholder="85"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ironOreCost" className="flex items-center">
                  Iron Ore Cost {getDataSourceBadge('ironOreCost')}
                </Label>
                <Input
                  id="ironOreCost"
                  type="number"
                  value={inputs.ironOreCost}
                  onChange={(e) => updateField('ironOreCost', parseFloat(e.target.value) || 0)}
                  placeholder="120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aluminumOreCost" className="flex items-center">
                  Aluminum Ore Cost {getDataSourceBadge('aluminumOreCost')}
                </Label>
                <Input
                  id="aluminumOreCost"
                  type="number"
                  value={inputs.aluminumOreCost}
                  onChange={(e) => updateField('aluminumOreCost', parseFloat(e.target.value) || 0)}
                  placeholder="240"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limestoneCost" className="flex items-center">
                  Limestone Cost {getDataSourceBadge('limestoneCost')}
                </Label>
                <Input
                  id="limestoneCost"
                  type="number"
                  value={inputs.limestoneCost}
                  onChange={(e) => updateField('limestoneCost', parseFloat(e.target.value) || 0)}
                  placeholder="45"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bauxiteCost" className="flex items-center">
                  Bauxite Cost {getDataSourceBadge('bauxiteCost')}
                </Label>
                <Input
                  id="bauxiteCost"
                  type="number"
                  value={inputs.bauxiteCost}
                  onChange={(e) => updateField('bauxiteCost', parseFloat(e.target.value) || 0)}
                  placeholder="180"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marbleCost" className="flex items-center">
                  Marble Cost {getDataSourceBadge('marbleCost')}
                </Label>
                <Input
                  id="marbleCost"
                  type="number"
                  value={inputs.marbleCost}
                  onChange={(e) => updateField('marbleCost', parseFloat(e.target.value) || 0)}
                  placeholder="75"
                />
              </div>
            </CardContent>
          </Card>

          {/* Transport & Environmental */}
          <Card>
            <CardHeader>
              <CardTitle>Transport & Environmental Costs</CardTitle>
              <CardDescription>Transportation and compliance costs</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dieselTransportCost" className="flex items-center">
                  Diesel Transport Cost (USD/km/tonne)
                  {getDataSourceBadge('dieselTransportCost')}
                </Label>
                <Input
                  id="dieselTransportCost"
                  type="number"
                  step="0.01"
                  value={inputs.dieselTransportCost}
                  onChange={(e) => updateField('dieselTransportCost', parseFloat(e.target.value) || 0)}
                  placeholder="1.2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="railTransportCost" className="flex items-center">
                  Rail Transport Cost (USD/km/tonne)
                  {getDataSourceBadge('railTransportCost')}
                </Label>
                <Input
                  id="railTransportCost"
                  type="number"
                  step="0.01"
                  value={inputs.railTransportCost}
                  onChange={(e) => updateField('railTransportCost', parseFloat(e.target.value) || 0)}
                  placeholder="0.8"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environmentalPenalty" className="flex items-center">
                  Environmental Penalty (USD)
                  {getDataSourceBadge('environmentalPenalty')}
                </Label>
                <Input
                  id="environmentalPenalty"
                  type="number"
                  value={inputs.environmentalPenalty}
                  onChange={(e) => updateField('environmentalPenalty', parseFloat(e.target.value) || 0)}
                  placeholder="25000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regulatoryComplianceCost" className="flex items-center">
                  Regulatory Compliance Cost (USD)
                  {getDataSourceBadge('regulatoryComplianceCost')}
                </Label>
                <Input
                  id="regulatoryComplianceCost"
                  type="number"
                  value={inputs.regulatoryComplianceCost}
                  onChange={(e) => updateField('regulatoryComplianceCost', parseFloat(e.target.value) || 0)}
                  placeholder="45000"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}