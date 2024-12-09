import { LinkedQueue } from "@/lib/queue";

export type AlgorithmDetails = {
  type: string;
  name: string;
  description: string;
  complexity: {
    time: string;
    reasoning: string;
  };
  code: string;
  resources: string[];
  steps: { [step: string]: string };
};

export abstract class Algorithm {
  abstract step_descriptions: { [step: string]: string };
  step_queue: LinkedQueue<AlgorithmStep> = new LinkedQueue();

  runNextStep(): AlgorithmStep | undefined {
    return this.step_queue.dequeue();
  }

  hasNextStep(): boolean {
    return !this.step_queue.isEmpty();
  }
}

export type AlgorithmStep = {
  // lines to highlight: 1-5
  highlightLines: string;

  // points to highlight (ids)
  highlightPoints: Entity["id"][];

  // edges to highlight (ids)
  highlightEdges: Entity["id"][];

  points: Point[];

  edges: Edge[];

  description: string;
};

export const defaultStep: AlgorithmStep = {
  highlightLines: "",
  highlightPoints: [],
  highlightEdges: [],
  points: [],
  edges: [],
  description: "Empty step",
};

export type Position = {
  x: number;
  y: number;
};

export type Entity = {
  id: number;
  highlight?: boolean;
};

export type Point = Entity & Position;

export type Edge = Entity & {
  start: Point;
  end: Point;
};
