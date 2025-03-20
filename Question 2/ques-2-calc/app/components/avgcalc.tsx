"use client";

import { useState, useEffect } from "react";

const API_ENDPOINTS = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand",
};

const WINDOW_SIZE = 10;

export default function AvgCalculator() {
  const [selectedType, setSelectedType] = useState("e");
  const [windowPrevState, setWindowPrevState] = useState<number[]>([]);
  const [windowCurrState, setWindowCurrState] = useState<number[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNumbers = async () => {
    setLoading(true);
    const endpoint = API_ENDPOINTS[selectedType as keyof typeof API_ENDPOINTS];

    if (!endpoint) {
      console.error("Invalid endpoint:", selectedType);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNDc3NjEyLCJpYXQiOjE3NDI0NzczMTIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImVmYTMxZGFhLTNhNTAtNGFiYS1iYTRkLWM4MjE1YTg3MWMyZSIsInN1YiI6InNnOTg5MUBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiU1JNSVNUIiwiY2xpZW50SUQiOiJlZmEzMWRhYS0zYTUwLTRhYmEtYmE0ZC1jODIxNWE4NzFjMmUiLCJjbGllbnRTZWNyZXQiOiJETklsT3VWZlpaTXNIZnVpIiwib3duZXJOYW1lIjoiU2FoaWwgR3VwdGEiLCJvd25lckVtYWlsIjoic2c5ODkxQHNybWlzdC5lZHUuaW4iLCJyb2xsTm8iOiJSQTIyMTEwMDMwMTE4MDkifQ.FzOMrApDt6R8OJvgTK9-Sbw-844oCbe4to1BADQUbvw",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const numbers = data.numbers.slice(0, WINDOW_SIZE);

      setWindowPrevState([...windowCurrState]);
      setWindowCurrState(numbers);
      setAvg(numbers.reduce((a, b) => a + b, 0) / numbers.length);
    } catch (error) {
      console.error("Error fetching numbers:", error);
      alert("Failed to fetch numbers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchNumbers();
    };
    fetchData();
  }, [selectedType]);

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Average Calculator</h1>

      <label className="block mb-2"> Select Number Type:</label>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="border p-2 mb-4 w-full"
      >
        <option key="p" value="p">
          Prime Numbers
        </option>
        <option key="f" value="f">
          Fibonacci Numbers
        </option>
        <option key="e" value="e">
          Even Numbers
        </option>
        <option key="r" value="r">
          Random Numbers
        </option>
      </select>

      <button
        onClick={fetchNumbers}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Loading..." : "Fetch Numbers"}
      </button>

      <div className="mt-4 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold">Response: </h2>
        <pre className="bg-white p-2 rounded text-sm">
          {JSON.stringify(
            {
              windowPrevState,
              windowCurrState,
              avg: avg?.toFixed(2),
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
