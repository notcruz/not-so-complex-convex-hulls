import {Algorithm, defaultStep, Point } from "@/types"
import { orient, generate_edges_from_arr} from './ConvexHull.ts';
import { atan2 } from 'mathjs';

export class GrahamScan extends Algorithm {

    constructor(points: Point[]){
        super();
        this.graham_scan(points);
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
        points.sort((a, b) => atan2(a.y - y, a.x - x) - atan2(b.y - y, b.x - x));
        let rem_i = points.indexOf(lowest_leftmost);
        let [rem] = points.splice(rem_i, 1);
        points.unshift(rem)

        this.step_queue.enqueue({ ...defaultStep, 
            highlightLines:"13",
            highlightPoints:[points[0].id], 
            points: points,
            edges: generate_edges_from_arr(stack)})

        for (i = 0; i < num_points; i++) {
            let current_point = points[i];

            if(stack.length > 1){
                this.step_queue.enqueue({ ...defaultStep, 
                                        highlightPoints:[current_point.id, stack[stack.length-2].id, stack[stack.length-1].id], 
                                        points: points,
                                        edges: generate_edges_from_arr(stack)})
            }
            else if(stack.length === 1){
                this.step_queue.enqueue({ ...defaultStep, 
                                        highlightPoints:[current_point.id], 
                                        points: points,
                                        edges: generate_edges_from_arr(stack)})
            }
            
            while (stack.length > 1 && orient(stack[stack.length-2], stack[stack.length-1], current_point) == false){
                stack.pop();
                if(stack.length > 1){
                    this.step_queue.enqueue({ ...defaultStep, 
                                            highlightPoints:[current_point.id, stack[stack.length-2].id, stack[stack.length-1].id], 
                                            points: points,
                                            edges: generate_edges_from_arr(stack)})
                }
                else if(stack.length = 1){
                    this.step_queue.enqueue({ ...defaultStep, 
                                            highlightPoints:[current_point.id], 
                                            points: points,
                                            edges: generate_edges_from_arr(stack)})
                }
            }
            stack.push(points[i]);
        }
        let conv_hull = generate_edges_from_arr(stack)
        let connecting_edge = {id: -1, highlight:false, start: stack[stack.length -1], end: stack[0]}
        conv_hull.push(connecting_edge);
        this.step_queue.enqueue({...defaultStep, points: points, 
            edges: conv_hull});
        return stack;
    }
}