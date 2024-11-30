import { atan2 } from 'mathjs';
import { Algorithm, Point, defaultStep } from '@/types';
import { generate_edges_from_arr } from './ConvexHull';

function slope(p1: Point, p2: Point): number {
    // Return the slope of p1->p2
    if (p1.x <= p2.x){
        return atan2((p2.y - p1.y),(p2.x - p1.x));
    }
    else{
        return slope(p2, p1);
    }
}

export class NaiveAlgorithm extends Algorithm {
    
    constructor(points: Point[]){
        super();
        this.naive(points);
    }

    naive(points: Point[]): Point[] {
        // Perform Brute Force Convex Hull algorithm on a list of points.
        var right_most = points[0];
        var left_most = points[0];

        var num_points = points.length;

        // Find the leftmost and rightmost points of the set
        for (var i = 0; i < num_points; i++) {
            let {x:curr_x, y:curr_y} = points[i];
            if ((curr_x == left_most.x && curr_y < left_most.y)
                || curr_x < left_most.x){
                left_most = points[i];
            }
            if (curr_x > right_most.x ||
                (curr_x == right_most.x && curr_y > right_most.y)){
                right_most = points[i];
            }
        }

        var convex_hull = [right_most];

        // Upper hull
        var current_point = convex_hull[convex_hull.length-1];
        while (current_point != left_most){
            let min_slope = slope(current_point, left_most)
            let best_candidate: Point = left_most; // initial value
            for (i = 0; i < num_points; i++){
                let candidate = points[i];
                if ((convex_hull.includes(candidate)) || candidate.x >= current_point.x){
                    continue;
                }
                let test_slope = slope(candidate, current_point);
                if (test_slope < min_slope){
                    best_candidate = candidate;
                    min_slope = test_slope;
                }
            }
            convex_hull.push(best_candidate)
            current_point = best_candidate;
        }

        // Lower hull
        while (true){
            let min_slope = slope(current_point, right_most)
            let best_candidate: Point = right_most; // initial value
            for (i = 0; i < num_points; i++){
                let candidate = points[i];
                if ((convex_hull.includes(candidate)) && candidate != right_most 
                    || candidate.x <= current_point.x){
                    continue;
                }
                let test_slope = slope(candidate, current_point);
                if (test_slope < min_slope){
                    best_candidate = candidate;
                    min_slope = test_slope;
                }
            }
            if (best_candidate == right_most){
                break;
            }
            convex_hull.push(best_candidate)
            current_point = best_candidate;
        }
        console.log(convex_hull);
        let conv_hull_edges = generate_edges_from_arr(convex_hull);
        let connecting_edge = {id: -1, highlight:false, start: convex_hull[convex_hull.length -1], end: convex_hull[0]}
        conv_hull_edges.push(connecting_edge);
        this.step_queue.enqueue({...defaultStep, points:points, edges:conv_hull_edges})
        return convex_hull;
    }
}

