"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { algorithms } from "@/lib/config";
import { cn } from "@/lib/utils";
import { Coordinates, Mafs, Plot, Point, Theme, useStopwatch } from "mafs";
import { useEffect, useState } from "react";

const rate = 0.75;

export default function Home() {
  const [type, setType] = useState<string>();
  const { time, start } = useStopwatch();

  useEffect(() => start(), [start]);

  const algorithm = algorithms.find((algorithm) => algorithm.type === type);

  return (
    <div className={"flex flex-col gap-y-9 justify-center mx-64 mt-16"}>
      <div className="flex flex-col gap-y-3 text-center">
        <h1 className="font-bold text-2xl">Not-So-Complex Convex Hulls</h1>
        <p>
          An interactive learning tool that walks users through the Naive
          Algorithm, Graham&#39;s Scan, Jarvis March, and Chan&#39;s Algorithm, for generating
          convex hulls. It provides step-by-step visualizations on different
          point sets, helping users understand how each algorithm makes
          decisions and approaches the problem of convex hull construction in
          computational geometry.
        </p>
      </div>
      <div className="flex flex-col gap-y-9 mb-24">
        <div className="grid grid-cols-4 gap-x-6">
          {algorithms.map((algorithm) => {
            return (
              <Card key={algorithm.name}>
                <CardHeader className="items-center">
                  <CardTitle>{algorithm.name}</CardTitle>
                </CardHeader>
                <CardFooter className="gap-x-3 justify-center">
                  <Button
                    disabled={type === algorithm.type}
                    variant={"secondary"}
                    onClick={() => setType(algorithm.type)}
                  >
                    View Details
                  </Button>
                  <Button asChild>
                    <a href={`/visualizer?type=${algorithm.type}`}>
                      Test Algorithm
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="grid grid-flow-row-dense grid-cols-8">
          <Card className="col-span-5 rounded-r-none">
            {type && <CardHeader></CardHeader>}
            <CardContent
              className={cn(
                "flex flex-col",
                type ? "" : "min-h-full items-center justify-center",
              )}
            >
              {!type ? (
                <div className="text-xl">
                  Select '<span className="font-bold">View Details</span>' on an
                  Algorithm
                </div>
              ) : (
                <div></div>
              )}
            </CardContent>
          </Card>
          <Mafs
            viewBox={{
              y: [0, Math.min(Math.max(time * rate * 4, 5), 25)],
              x: [0, Math.min(Math.max((time * rate) / 2, 5), 15)],
            }}
            preserveAspectRatio="contain"
          >
            <Coordinates.Cartesian
              xAxis={{
                labels: (n) => (n % 5 == 0 ? n : ""),
              }}
              yAxis={{
                labels: (n) => (n % 5 == 0 ? n : ""),
              }}
            />
            <Plot.OfX domain={[0, 500]} y={(x) => x} />
            <Point x={time * rate} y={time * rate} color={Theme.green} />
            <Plot.OfX
              domain={[0, 500]}
              y={(x) => x * Math.log2(x)}
              color={Theme.pink}
            />
            <Point
              x={time * rate}
              y={time * rate * Math.log2(time * rate)}
              color={Theme.green}
            />
            <Plot.OfX domain={[0, 500]} y={(x) => x ** 3} color={Theme.blue} />
            <Point x={time * rate} y={(time * rate) ** 3} color={Theme.green} />
          </Mafs>
        </div>
      </div>
    </div>
  );
}
