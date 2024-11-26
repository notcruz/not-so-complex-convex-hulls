import { Algorithm, AlgorithmStep, Edge, Point } from "@/types";

export class TestAlgorithm implements Algorithm {
  counter: number = 0;

  // nest step will generate a random point on the board
  runNextStep(points: Readonly<Point[]>, edges: Readonly<Edge[]>): AlgorithmStep {
    const newPoint: Point = {
      id: points.length + 1,
      x: Math.random() * 1280,
      y: Math.random() * 930
    }

    const newEdge: Edge = {
      id: edges.length + 1,
      start: points[points.length - 1],
      end: newPoint
    }

    this.counter++;

    return {
      points: [...points, newPoint],
      edges: [...edges, newEdge],
      highlightLines: "",
      highlightPoints: [newPoint.id],
      highlightEdges: [newEdge.id]
    }
  }

  hasNextStep(): boolean {
    return this.counter < 10
  }
}
