import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Search, Shield, Link, Clock, MapPin, Package } from "lucide-react";
import { BlockchainRecord, getBlockchainLog } from "@/services/api";

export default function Blockchain() {
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BlockchainRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadBlockchainLog();
  }, []);

  useEffect(() => {
    // Filter records based on search term
    if (searchTerm) {
      const filtered = records.filter(record =>
        record.step.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.hash.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRecords(filtered);
    } else {
      setFilteredRecords(records);
    }
  }, [searchTerm, records]);

  const loadBlockchainLog = async () => {
    try {
      setLoading(true);
      const data = await getBlockchainLog();
      setRecords(data);
      setFilteredRecords(data);
    } catch (error) {
      toast({
        title: "Error loading blockchain log",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBlockchainLog();
    setRefreshing(false);
    toast({
      title: "Log updated",
      description: "Latest blockchain records have been loaded.",
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const getStepIcon = (step: string) => {
    if (step.toLowerCase().includes('mining')) return <Package className="h-4 w-4" />;
    if (step.toLowerCase().includes('refining')) return <Shield className="h-4 w-4" />;
    if (step.toLowerCase().includes('production')) return <Link className="h-4 w-4" />;
    if (step.toLowerCase().includes('electrolysis')) return <Link className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  const getStepColor = (step: string) => {
    if (step.toLowerCase().includes('mining')) return 'bg-primary/10 text-primary border-primary/20';
    if (step.toLowerCase().includes('refining')) return 'bg-accent/10 text-accent border-accent/20';
    if (step.toLowerCase().includes('production')) return 'bg-success/10 text-success border-success/20';
    if (step.toLowerCase().includes('electrolysis')) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-muted/10 text-muted-foreground border-muted/20';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading blockchain records...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blockchain Traceability</h1>
          <p className="text-muted-foreground mt-1">
            Immutable record of all LCA process steps ensuring complete transparency and verification.
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                <p className="text-2xl font-bold text-primary">{records.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Link className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-success">
                  {records.filter(r => r.verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Locations</p>
                <p className="text-2xl font-bold text-accent">
                  {new Set(records.map(r => r.location)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Latest Entry</p>
                <p className="text-sm font-bold text-warning">
                  {records.length > 0 ? formatTimestamp(records[records.length - 1].timestamp) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Records</CardTitle>
          <CardDescription>Filter blockchain records by process step, location, or hash</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by step, location, or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Records */}
      <Card>
        <CardHeader>
          <CardTitle>Process Trail</CardTitle>
          <CardDescription>
            Chronological record of all verified process steps ({filteredRecords.length} records)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <div
                key={`${record.hash}-${index}`}
                className="relative flex items-start space-x-4 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                {/* Timeline connector */}
                {index < filteredRecords.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
                )}

                {/* Step icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${getStepColor(record.step)}`}>
                  {getStepIcon(record.step)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{record.step}</h3>
                      {record.verified && (
                        <Badge className="bg-success/10 text-success border-success/20">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(record.timestamp)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Blockchain Hash</p>
                      <p className="font-mono text-primary">{formatHash(record.hash)}</p>
                    </div>
                    
                    {record.location && (
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {record.location}
                        </p>
                      </div>
                    )}
                    
                    {record.quantity && (
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {record.quantity}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Full hash on hover/click */}
                  <details className="mt-2">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-primary">
                      View full hash
                    </summary>
                    <p className="mt-1 font-mono text-xs bg-muted/50 p-2 rounded break-all">
                      {record.hash}
                    </p>
                  </details>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No records found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "No blockchain records available"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Blockchain Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Blockchain Security</span>
          </CardTitle>
          <CardDescription>How blockchain ensures data integrity and traceability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Immutable Records</h4>
              <p className="text-sm text-muted-foreground">
                Each process step is cryptographically secured and cannot be altered or deleted.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Link className="h-6 w-6 text-accent" />
              </div>
              <h4 className="font-semibold mb-2">Full Traceability</h4>
              <p className="text-sm text-muted-foreground">
                Complete chain of custody from raw materials to final product.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <h4 className="font-semibold mb-2">Real-time Verification</h4>
              <p className="text-sm text-muted-foreground">
                Instant verification of process authenticity and data integrity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}