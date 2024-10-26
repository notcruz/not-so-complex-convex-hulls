import {Point, orient} from './ConvexHull.ts';
import { atan2 } from 'mathjs';

function graham_scan(points: Point[]): Point[] {
    // Perform Graham's Scan Convex Hulkl algorithm on a list of points.
    let stack: Point[] = [];

    // Find the leftmost, lowest, point
    let lowest_leftmost: Point = [Infinity, Infinity];
    let num_points: number = points.length;
    for (let i = 0; i < num_points; i++) {
        let [curr_x, curr_y] = points[i];
        let [most_left, lowest] = lowest_leftmost;
        if (curr_x < most_left || (curr_x == most_left && curr_y < lowest)){
            lowest_leftmost = points[i];
        }
    }

    // Sort the points by their angle to the lowest_leftmost point
    let [x, y] = lowest_leftmost;
    points.sort((a, b) => atan2(a[1] - y, a[0] - x) - atan2(b[1] - y, b[0] - x));

    for (let i = 0; i < num_points; i++){
        while (stack.length > 1 && orient(stack[-2], stack[-1], points[i]) == true){
            stack.pop();
        }
        stack.push(points[i]);
    }
    return stack;
}