import { algorithms } from '../config.ts';
import { Algorithm, defaultStep, Point } from '@/types';
import {
  orient,
  generate_edges_from_arr,
  mergeSortByAngle,
} from './ConvexHull.ts';

export class GrahamScan extends Algorithm {
  step_descriptions = algorithms[1].steps;
  constructor(points: Point[]) {
    super();
    this.graham_scan(points);
  }

  graham_scan(points: Point[]): void {
    // Perform Graham's Scan Convex Hull algorithm on a list of points.
    const stack: Point[] = [];

    // Find the leftmost, lowest, point
    let lowest_leftmost: Point = points[0]; // default value
    let num_points: number = points.length;
    for (let i = 0; i < num_points; i++) {
      const { x: leftest_coord, y: lowest_coord } = lowest_leftmost;
      const { x: curr_x, y: curr_y } = points[i];
      if (
        curr_y < lowest_coord ||
        (curr_y == lowest_coord && curr_x < leftest_coord)
      ) {
        lowest_leftmost = points[i];
      }
    }

    // Sort the points by their angle to the lowest_leftmost point
    points = mergeSortByAngle(
      points,
      [],
      lowest_leftmost,
      points,
      this.step_queue
    );
    const rem_i = points.indexOf(lowest_leftmost);
    const [rem] = points.splice(rem_i, 1);
    points.unshift(rem);
    num_points = points.length;

    // Showcase sort
    for (let i = 0; i < num_points; i++) {
      this.step_queue.enqueue({
        ...defaultStep,
        highlightPoints: [points[i].id],
        points: points,
        highlightEdges: [-1],
        edges: [
          { id: -1, highlight: true, start: lowest_leftmost, end: points[i] },
        ],
        description: this.step_descriptions['begin'],
      });
    }

    this.step_queue.enqueue({
      ...defaultStep,
      highlightLines: '13',
      highlightPoints: [points[0].id],
      points: points,
      edges: generate_edges_from_arr(stack),
      description: this.step_descriptions['main_loop'],
    });

    for (let i = 0; i < num_points; i++) {
      const current_point = points[i];

      if (stack.length > 1) {
        this.step_queue.enqueue({
          ...defaultStep,
          highlightLines: "7-9",
          highlightPoints: [
            current_point.id,
            stack[stack.length - 2].id,
            stack[stack.length - 1].id,
          ],
          points: points,
          edges: generate_edges_from_arr(stack),
          description: this.step_descriptions['main_loop'],
        });
      } else if (stack.length === 1) {
        this.step_queue.enqueue({
          ...defaultStep,
          highlightLines: "7-9",
          highlightPoints: [current_point.id],
          points: points,
          edges: generate_edges_from_arr(stack),
          description: this.step_descriptions['main_loop'],
        });
      }

      while (
        stack.length > 1 &&
        orient(
          stack[stack.length - 2],
          stack[stack.length - 1],
          current_point
        ) < 0
      ) {
        stack.pop();
        if (stack.length > 1) {
          this.step_queue.enqueue({
            ...defaultStep,
            highlightLines: "10",
            highlightPoints: [
              current_point.id,
              stack[stack.length - 2].id,
              stack[stack.length - 1].id,
            ],
            points: points,
            edges: generate_edges_from_arr(stack),
            description: this.step_descriptions['main_loop'],
          });
        } else if ((stack.length == 1)) {
          this.step_queue.enqueue({
            ...defaultStep,
            highlightLines: "10",
            highlightPoints: [current_point.id],
            points: points,
            edges: generate_edges_from_arr(stack),
            description: this.step_descriptions['main_loop'],
          });
        }
      }
      if (stack.length > 1) {
        this.step_queue.enqueue({
            ...defaultStep,
            highlightLines: "11",
            highlightPoints: [
              current_point.id,
              stack[stack.length - 2].id,
              stack[stack.length - 1].id,
            ],
            points: points,
            edges: generate_edges_from_arr(stack),
            description: this.step_descriptions['main_loop'],
          });
        } else if ((stack.length == 1)) {
          this.step_queue.enqueue({
            ...defaultStep,
            highlightLines: "11",
            points: points,
            edges: generate_edges_from_arr(stack),
            description: this.step_descriptions['main_loop'],
          });
        }
      stack.push(points[i]);
  }
    const conv_hull = generate_edges_from_arr(stack);
    const connecting_edge = {
      id: -1,
      highlight: false,
      start: stack[stack.length - 1],
      end: stack[0],
    };
    conv_hull.push(connecting_edge);
    this.step_queue.enqueue({
      ...defaultStep,
      highlightLines:"12",
      points: points,
      edges: conv_hull,
      description: this.step_descriptions['done'],
    });
  }
}
