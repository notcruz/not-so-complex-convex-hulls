import {Algorithm, AlgorithmStep, defaultStep, Edge, Point } from "@/types"
import { LinkedQueue } from "../queue.ts";
import {orient} from './ConvexHull.ts';
import { atan2 } from 'mathjs';
import { initHeapProfiler } from "next/dist/build/swc/index";
import { start } from "repl";

export class GrahamScan implements Algorithm {
    step_queue: LinkedQueue<AlgorithmStep>;

    constructor(initial_state: AlgorithmStep){
        this.step_queue = new LinkedQueue<AlgorithmStep>();
        this.step_queue.enqueue(initial_state);
        this.graham_scan(initial_state.points);
    }

    runNextStep(points: Readonly<Point[]>, edges: Readonly<Edge[]>): AlgorithmStep | undefined {
        return this.step_queue.dequeue()
    }

    hasNextStep(): boolean {
        return !this.step_queue.isEmpty()
    }

    generate_edges_from_arr(arr: Point[]): Edge[] {
        var edges: Edge[] = [];

        for(var i = 1; i < arr.length; i++){
            let new_edge = {id: i, highlight:false, start: arr[i-1], end: arr[i]};
            edges.push(new_edge);
        }
        return edges;
    }

    graham_scan(points: Point[]): Point[] {
        // Perform Graham's Scan Convex Hull algorithm on a list of points.
        var stack: Point[] = [];

        // Find the leftmost, lowest, point
        var lowest_leftmost: Point = points[0]; // default value
        var num_points: number = points.length;
        for (var i = 0; i < num_points; i++) {
            let {x: leftest_coord, y: lowest_coord} = lowest_leftmost;
            let {x: curr_x, y: curr_y} = points[i];
            if (curr_y < lowest_coord || (curr_y == lowest_coord && curr_x < leftest_coord)){
                lowest_leftmost = points[i];
            }
        }

        // Sort the points by their angle to the lowest_leftmost point
        let {x, y} = lowest_leftmost;
        points.sort((b, a) => atan2(a.y - y, a.x - x) - atan2(b.y - y, b.x - x));
        console.log(lowest_leftmost);
        console.log(points);

        for (i = 0; i < num_points; i++) {
            let current_point = points[i];

            if(stack.length > 1){
                this.step_queue.enqueue({ ...defaultStep, 
                                        highlightPoints:[current_point.id, stack[stack.length-2].id, stack[stack.length-1].id], 
                                        points: points,
                                        edges: this.generate_edges_from_arr(stack)})
            }
            else if(stack.length === 1){
                this.step_queue.enqueue({ ...defaultStep, 
                                        highlightPoints:[current_point.id], 
                                        points: points,
                                        edges: this.generate_edges_from_arr(stack)})
            }
            
            while (stack.length > 1 && orient(stack[stack.length-2], stack[stack.length-1], current_point) == true){
                stack.pop();
                if(stack.length > 1){
                    this.step_queue.enqueue({ ...defaultStep, 
                                            highlightPoints:[current_point.id, stack[stack.length-2].id, stack[stack.length-1].id], 
                                            points: points,
                                            edges: this.generate_edges_from_arr(stack)})
                }
                else if(stack.length = 1){
                    this.step_queue.enqueue({ ...defaultStep, 
                                            highlightPoints:[current_point.id], 
                                            points: points,
                                            edges: this.generate_edges_from_arr(stack)})
                }
            }
            stack.push(points[i]);
        }
        let conv_hull = this.generate_edges_from_arr(stack)
        let connecting_edge = {id: -1, highlight:false, start: stack[stack.length -1], end: stack[0]}
        conv_hull.push(connecting_edge);
        this.step_queue.enqueue({...defaultStep, points: points, 
            edges: conv_hull});
        return stack;
    }
}