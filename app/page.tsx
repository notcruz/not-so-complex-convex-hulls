import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { algorithms } from "@/lib/config";

export default function Home() {
  return (
    <div className={"flex flex-col gap-y-24 justify-center mx-64 mt-16"}>
      <div className="flex flex-col gap-y-3 text-center">
        <h1 className="font-bold text-2xl">Not So Complex Convex Hulls</h1>
        <p>
          An interactive learning tool that walks users through the Naive
          Algorithm, Jarvis March, and Chan&#39;s Algorithm for generating
          convex hulls. It provides step-by-step visualizations on different
          point sets, helping users understand how each algorithm makes
          decisions and approaches the problem of convex hull construction in
          computational geometry.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-x-6">
        {algorithms.map((algorithm) => {
          return (
            <Card key={algorithm.name}>
              <CardHeader className="items-center">
                <CardTitle>{algorithm.name}</CardTitle>
              </CardHeader>
              <CardFooter className="gap-x-3">
                <Button variant={"secondary"}>View Details</Button>
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
    </div>
  );
}
