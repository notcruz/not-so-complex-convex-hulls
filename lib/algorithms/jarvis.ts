import { algorithms } from '../config';
import { Algorithm, Point, defaultStep, Edge } from '@/types';
import { generate_edges_from_arr, orient } from './ConvexHull';

export class JarvisMarch extends Algorithm {
  step_descriptions = algorithms[2].steps;
  constructor(points: Point[]) {
    super();
    this.jarvis_march(points);
  }

  jarvis_march(points: Point[]): Point[] {
    let right_most = points[0];
    let left_most = points[0];

    const num_points = points.length;

    // Find the leftmost and rightmost points of the set
    for (let i = 0; i < num_points; i++) {
      const { x: curr_x, y: curr_y } = points[i];
      if (
        (curr_x == left_most.x && curr_y < left_most.y) ||
        curr_x < left_most.x
      ) {
        left_most = points[i];
      }
      if (
        curr_x > right_most.x ||
        (curr_x == right_most.x && curr_y > right_most.y)
      ) {
        right_most = points[i];
      }
    }

    const convex_hull = [right_most];

    // Upper hull
    let current_point = convex_hull[convex_hull.length - 1];

    this.step_queue.enqueue({
      ...defaultStep,
      highlightLines: "4",
      highlightPoints: [right_most.id],
      points: points,
      description: this.step_descriptions['begin'],
    });
    while (true) {
      let best_candidate: Point = left_most; // initial value
      for (let i = 0; i < num_points; i++) {
        const candidate = points[i];

        if (
          (convex_hull.includes(candidate) && candidate != right_most) ||
          current_point == candidate ||
          candidate == best_candidate
        ) {
        this.step_queue.enqueue({
          ...defaultStep,
          highlightLines:"9-10",
          points: points,
          edges: generate_edges_from_arr(convex_hull),
          description: this.step_descriptions['main_loop'],
        });
          continue;
        }

        const tempEdges: Edge[] = generate_edges_from_arr(convex_hull);
        tempEdges.push({
          id: -1,
          highlight: true,
          start: current_point,
          end: candidate,
        });
        tempEdges.push({
          id: -2,
          highlight: true,
          start: current_point,
          end: best_candidate,
        });

        this.step_queue.enqueue({
          ...defaultStep,
          highlightEdges: [-1, -2],
          highlightLines: "9,11",
          highlightPoints: [current_point.id, candidate.id],
          points: points,
          edges: tempEdges,
          description: this.step_descriptions['main_loop'],
        });

        if (orient(current_point, candidate, best_candidate) >= 0) {
          this.step_queue.enqueue({
            ...defaultStep,
            highlightEdges: [-1, -2],
            highlightLines: "12",
            highlightPoints: [current_point.id, candidate.id],
            points: points,
            edges: tempEdges,
            description: this.step_descriptions['main_loop'],
          });
          best_candidate = candidate;
        }
      }
      if (best_candidate == right_most) {
        this.step_queue.enqueue({
            ...defaultStep,
            highlightLines: "13-14",
            highlightPoints: [right_most.id],
            points: points,
            edges: generate_edges_from_arr(convex_hull),
            description: this.step_descriptions['main_loop'],
          });
        break;
      }

      convex_hull.push(best_candidate);
      current_point = best_candidate;
      this.step_queue.enqueue({
            ...defaultStep,
            highlightLines: "15-16",
            points: points,
            edges: generate_edges_from_arr(convex_hull),
            description: this.step_descriptions['main_loop'],
      });
    }

    const conv_hull_edges = generate_edges_from_arr(convex_hull);
    const connecting_edge = {
      id: -1,
      highlight: false,
      start: convex_hull[convex_hull.length - 1],
      end: convex_hull[0],
    };
    conv_hull_edges.push(connecting_edge);
    this.step_queue.enqueue({
      ...defaultStep,
      highlightLines: "17",
      points: points,
      edges: conv_hull_edges,
      description: this.step_descriptions['done'],
    });

    return convex_hull;
  }
}
