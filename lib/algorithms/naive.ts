import { Point } from './ConvexHull.ts';
import { atan2 } from 'mathjs';

function slope(p1:Point, p2:Point): number {
    // Return the slope of p1->p2
    if (p1[0] <= p2[0]){
        return atan2((p2[1] - p1[1]),(p2[0] - p1[0]));
    }
    else{
        return slope(p2, p1);
    }
}

function naive(points: Point[]): Point[] {
    // Perform Brute Force Convex Hull algorithm on a list of points.
    var right_most = points[0];
    var left_most = points[0];

    var num_points = points.length

    // Find the leftmost and rightmost points of the set
    for (var i = 0; i < num_points; i++) {
        let [curr_x, curr_y] = points[i];
        if (curr_x < left_most[0]){
            left_most = points[i];
        }
        if (curr_x > right_most[0]){
            right_most = points[i];
        }
    }

    var convex_hull = [right_most];

    // Upper hull
    var current_point = convex_hull[-1];
    while (current_point != left_most){
        let min_slope = Number.POSITIVE_INFINITY;
        let best_candidate: Point = [Number.POSITIVE_INFINITY, 0]; // dummy value
        for (i = 0; i < num_points; i++){
            let candidate = points[i];
            if ((points.indexOf(candidate) > -1) || candidate[0] > current_point[0]){
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
        let min_slope = Number.POSITIVE_INFINITY;
        let best_candidate: Point = [Number.POSITIVE_INFINITY, 0]; // dummy value
        for (i = 0; i < num_points; i++){
            let candidate = points[i];
            if ((points.indexOf(candidate) > -1) && candidate != right_most 
                || candidate[0] < current_point[0]){
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
    return convex_hull;
}