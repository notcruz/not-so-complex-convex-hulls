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
};


export interface Algorithm {
  runNextStep(points: Readonly<Point[]>, edges: Readonly<Edge[]>): AlgorithmStep;

  hasNextStep(): boolean;
}


export type AlgorithmStep = {
  // lines to higlight: 1-5
  highlightLines: string;

  // points to highlight (ids)
  highlighPoints: Entity['id'][];

  // edges to highlight (ids)
  highlightEdges: Entity['id'][];

  points: Point[];

  edges: Edge[]
}


export type Entity = {
  id: number;
  highlight?: boolean
}

export type Point = Entity & {
  x: number;
  y: number;
}


export type Edge = Entity & {
  start: Point;
  end: Point;
}


