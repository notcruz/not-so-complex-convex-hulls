import { algorithms } from '../config';
import { Algorithm, Point, Edge, defaultStep } from '@/types';
import { orient } from './ConvexHull';

export class NaiveAlgorithm extends Algorithm {
  step_descriptions = algorithms[0].steps;
  constructor(points: Point[]) {
    super();
    this.naive(points);
  }

  naive(points: Point[]): void {
    // Perform Brute Force Convex Hull algorithm on a list of points.
    points.sort((a, b) => a.x - b.x);

    const ch_edges: Edge[] = [];
    const all_ordered_pairs: [Point, Point][] = cartesianProduct<Point>(points);

    for (let i = 0; i < all_ordered_pairs.length; i++) {
      const current_pair = all_ordered_pairs[i];
      const p: Point = current_pair[0];
      const q: Point = current_pair[1];
      let valid = true;

      for (let j = 0; j < points.length; j++) {
        const r: Point = points[j];

        if (r != p && r != q) {
          const tempEdges = [...ch_edges];
          tempEdges.push({ id: -1, start: p, end: q });
          this.step_queue.enqueue({
            ...defaultStep,
            highlightPoints: [p.id, q.id, r.id],
            highlightEdges: [-1],
            points: points,
            edges: tempEdges,
            description: this.step_descriptions['naive'],
          });
          if (orient(p, r, q) >= 0) {
            valid = false;
          }
        }
      }
      if (valid) {
        ch_edges.push({ id: ch_edges.length + 1, start: p, end: q });
      }
    }
    this.step_queue.enqueue({
      ...defaultStep,
      points: points,
      edges: ch_edges,
    });
  }
}

function cartesianProduct<T>(array: T[]): [T, T][] {
  const result: [T, T][] = [];

  for (const a of array) {
    for (const b of array) {
      result.push([a, b]);
    }
  }

  return result;
}
