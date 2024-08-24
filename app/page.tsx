"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supabaseUrl = "https://udcxfnwvimtwajcfzkee.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkY3hmbnd2aW10d2FqY2Z6a2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ0MTYxOTMsImV4cCI6MjAzOTk5MjE5M30.jcTvmeg4UhrV7oX1oRY3KhzMm4cJzLHOT4zBUG1DpiE";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Country {
  id: number;
  name: string;
  capital: string;
  population: number;
  flag: string;
}

const AdPlaceholder: React.FC = () => (
  <Card className="mb-4 bg-gray-100">
    <CardHeader>
      <CardTitle>Advertisement</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-32 flex items-center justify-center text-gray-500">sabaidukashvili50@gmail.com</div>
    </CardContent>
  </Card>
);

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCountries() {
      try {
        const { data, error } = await supabase.from("countries").select("*").order("population", { ascending: false });

        if (error) throw error;
        setCountries(data);
      } catch (err) {
        setError("Failed to fetch countries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">MPOX Data By Country</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <Card>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Flag</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Cases</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCountries.map((country) => (
                      <TableRow key={country.id}>
                        <TableCell>
                          <img src={country.flag} alt={`${country.name} flag`} className="w-10 h-5 object-cover" />
                        </TableCell>
                        <TableCell>{country.name}</TableCell>
                        <TableCell>{country.population.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <AdPlaceholder />
          <AdPlaceholder />
        </div>
      </div>
    </div>
  );
}
