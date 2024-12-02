import {Algorithm, defaultStep, Point, Edge } from "@/types"
import { orient, generate_edges_from_arr, mergeSortByAngle, slope, generate_edges_from_arr_closed} from './ConvexHull.ts';

export class ChansAlgorithm extends Algorithm {
    constructor(points: Point[]){
        super();
        this.chans_algorithm(points);
    }


    chans_algorithm(points: Point[]): void {
        const n = points.length;

        for (let m = 4; m <= n; m*= 2){
            const subsets: Point[][] = [];
            let mini_hull_edges: Edge[] = [];
            for (let i = 0; i < n; i += m){
                let next_subset = this.graham_helper(points, mini_hull_edges, points.slice(i, i + m));
                subsets.push(next_subset);
                let current_edges = generate_edges_from_arr_closed(next_subset);
                mini_hull_edges = [...mini_hull_edges, ...current_edges];
                this.step_queue.enqueue({...defaultStep, points: points, edges:mini_hull_edges});
            }

            var hull_maybe = this.jarvis_helper(points, mini_hull_edges, subsets, m);
            if(hull_maybe.length != 0){
                return;
            }
        }
    }


    graham_helper(all_points: Point[], all_edges: Edge[], subset_points: Point[]): Point[]{
        var stack: Point[] = [];

        // Find the leftmost, lowest, point
        var lowest_leftmost: Point = subset_points[0]; // default value
        var num_points: number = subset_points.length;
        for (var i = 0; i < num_points; i++) {
            let {x: leftest_coord, y: lowest_coord} = lowest_leftmost;
            let {x: curr_x, y: curr_y} = subset_points[i];
            if (curr_y < lowest_coord || (curr_y == lowest_coord && curr_x < leftest_coord)){
                lowest_leftmost = subset_points[i];
            }
        }

        // Sort the points by their angle to the lowest_leftmost point
        let {x, y} = lowest_leftmost;
        subset_points = mergeSortByAngle(all_points, all_edges, lowest_leftmost, subset_points, this.step_queue);
        let rem_i = subset_points.indexOf(lowest_leftmost);
        let [rem] = subset_points.splice(rem_i, 1);
        subset_points.unshift(rem)
        num_points = subset_points.length

        // Showcase sort
        for (i = 0; i < num_points; i++){
            this.step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[subset_points[i].id],
                points:all_points,
                highlightEdges:[-1],
                edges: [{id:-1, highlight: true, start:lowest_leftmost, end: subset_points[i]}, ...all_edges]
            })
        }

        this.step_queue.enqueue({ ...defaultStep, 
            highlightLines:"13",
            highlightPoints:[subset_points[0].id], 
            points: all_points,
            edges: [...generate_edges_from_arr(stack), ...all_edges]})

        for (i = 0; i < num_points; i++) {
            let current_point = subset_points[i];

            if(stack.length > 1){
                this.step_queue.enqueue({ ...defaultStep, 
                                        highlightPoints:[current_point.id, stack[stack.length-2].id, stack[stack.length-1].id], 
                                        points: all_points,
                                        edges: [...generate_edges_from_arr(stack), ...all_edges]})
            }
            else if(stack.length === 1){
                this.step_queue.enqueue({ ...defaultStep, 
                                        highlightPoints:[current_point.id], 
                                        points: all_points,
                                        edges: [...generate_edges_from_arr(stack), ...all_edges]})
            }
            
            while (stack.length > 1 && orient(stack[stack.length-2], stack[stack.length-1], current_point) < 0){
                stack.pop();
                if(stack.length > 1){
                    this.step_queue.enqueue({ ...defaultStep, 
                                            highlightPoints:[current_point.id, stack[stack.length-2].id, stack[stack.length-1].id], 
                                            points: all_points,
                                            edges: [...generate_edges_from_arr(stack), ...all_edges]})
                }
                else if(stack.length = 1){
                    this.step_queue.enqueue({ ...defaultStep, 
                                            highlightPoints:[current_point.id], 
                                            points: all_points,
                                            edges: [...generate_edges_from_arr(stack), ...all_edges]})
                }
            }
            stack.push(subset_points[i]);
        }
        let conv_hull = generate_edges_from_arr_closed(stack);
        this.step_queue.enqueue({...defaultStep, points: all_points, 
            edges: [...conv_hull, ...all_edges]});
        return stack;
    }
    
    jarvis_helper(all_points: Point[], all_edges: Edge[], subsets: Point[][], m: number): Point[]{

        function build_tangent_array(current_point: Point): Point[]{
            // Get all tangents of mini hulls from current point
            var tangents: Point[] = []
            for(var j = 0; j < num_subsets; j++){
                let curr_subset = subsets[j];
                if(curr_subset.length <= 2){
                    tangents = [...tangents, ...curr_subset];
                }
                else if(!curr_subset.includes(current_point)){
                    let {lower: t1, upper: t2} = findTangents(curr_subset, current_point);
                    tangents.push(t1);
                    tangents.push(t2);
                }
                else{
                    let index = curr_subset.indexOf(current_point);
                    let last_index = curr_subset.length - 1;
                    if(index == 0){
                        tangents.push(curr_subset[1]);
                        tangents.push(curr_subset[last_index]);
                    }
                    else if(index == last_index){
                        tangents.push(curr_subset[last_index - 1]);
                        tangents.push(curr_subset[0]);
                    }
                    else{
                        tangents.push(curr_subset[index - 1]);
                        tangents.push(curr_subset[index + 1]);
                    }
                }
            }
            return tangents;
        }

        var right_most = subsets[0][0];
        var left_most = subsets[0][0];

        var num_subsets = subsets.length;

        // Find the leftmost and rightmost points of the subsets
        for (var i = 0; i < num_subsets; i++) {
            let curr_subset = subsets[i];
            for (var j = 0; j < subsets[i].length; j++){
                let {x:curr_x, y:curr_y} = curr_subset[j];
                if ((curr_x == left_most.x && curr_y < left_most.y)
                    || curr_x < left_most.x){
                    left_most = curr_subset[j];
                }
                if (curr_x > right_most.x ||
                    (curr_x == right_most.x && curr_y > right_most.y)){
                    right_most = curr_subset[j];
                }
            }
        }

        var convex_hull = [right_most];

        // Upper hull
        var current_point = convex_hull[convex_hull.length-1];
        var hull_done = false;

        for (var n = 0; n < m ; n++){
            if(current_point == left_most){
                break;
            }
            let min_slope = slope(current_point, left_most) // initial value
            let best_candidate: Point = left_most; // initial value

            let tangents = build_tangent_array(current_point);
            console.log("Tangents upper hull", tangents);
            let num_tangents = tangents.length;

            for (i = 0; i < num_tangents; i++){
                let candidate = tangents[i];

                if ((convex_hull.includes(candidate)) || candidate.x >= current_point.x){
                    continue;
                }

                let tempEdges: Edge[] = generate_edges_from_arr(convex_hull);
                tempEdges.push({id:-1, highlight: true, start:current_point, end: candidate});

                this.step_queue.enqueue({...defaultStep, 
                                        highlightEdges:[-1],
                                        highlightPoints:[left_most.id, right_most.id, current_point.id, candidate.id, -1],
                                        points: all_points,
                                        edges: [...tempEdges, ...all_edges]
                                        })

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
        for (;n < m; n++){
            let min_slope = slope(current_point, right_most)
            let best_candidate: Point = right_most; // initial value

            let tangents = build_tangent_array(current_point);
            let num_tangents = tangents.length;

            for (i = 0; i < num_tangents; i++){
                let candidate = tangents[i];

                if ((convex_hull.includes(candidate)) && candidate != right_most 
                    || candidate.x <= current_point.x){
                    continue;
                }

                let tempEdges: Edge[] = generate_edges_from_arr(convex_hull);
                tempEdges.push({id:-1, highlight: true, start:current_point, end: candidate});


                this.step_queue.enqueue({...defaultStep, 
                                        highlightPoints:[left_most.id, right_most.id, current_point.id, candidate.id, -1],
                                        highlightEdges:[-1],
                                        points: all_points,
                                        edges: [...tempEdges, ...all_edges]
                                        })

                let test_slope = slope(candidate, current_point);
                if (test_slope < min_slope){
                    best_candidate = candidate;
                    min_slope = test_slope;
                }
            }
            if (best_candidate == right_most){
                hull_done = true;
                break;
            }
            convex_hull.push(best_candidate)
            current_point = best_candidate;
        }

        let conv_hull_edges = generate_edges_from_arr_closed(convex_hull);
        this.step_queue.enqueue({...defaultStep, points:all_points, edges:conv_hull_edges})
        if(hull_done){
            return convex_hull;
        }
        else{
            return [];
        }
    }
}

function findTangents(mini_hull: Point[], Q: Point): {lower: Point; upper: Point} {
        const n = mini_hull.length;

        function crossProduct(A: Point, B: Point, Q: Point): number {
            // Q->A x Q->B
            return (A.x - Q.x) * (B.y - Q.y) - (A.y - Q.y) * (B.x - Q.x);
        }

        // Binary search to find the lower tangent
        function findLowerTangent(): Point {
            let low = 0, high = n - 1;
            if (
                crossProduct(mini_hull[high], mini_hull[high - 1], Q) <= 0 &&
                crossProduct(mini_hull[high], mini_hull[0], Q) <= 0
            ) {
                return mini_hull[high];
            }
            if (
                crossProduct(mini_hull[low], mini_hull[low + 1], Q) <= 0 &&
                crossProduct(mini_hull[low], mini_hull[high], Q) <= 0
            ) {
                return mini_hull[low];
            }

            while (low != high) {
                const mid = Math.floor((low + high) / 2);
                const prev = (mid - 1 + n) % n;
                const next = (mid + 1) % n;

                // Check if the current point is the tangent
                if (
                    crossProduct(mini_hull[mid], mini_hull[prev], Q) <= 0 &&
                    crossProduct(mini_hull[mid], mini_hull[next], Q) <= 0
                ) {
                    return mini_hull[mid];
                }

                // Determine search direction
                if (crossProduct(mini_hull[mid], mini_hull[next], Q) > 0) {
                    low = mid + 1; // Move to the right
                } else {
                    high = mid; // Move to the left
                }
            }
            return mini_hull[low];
        }

        // Binary search to find the upper tangent
        function findUpperTangent(): Point {
            let low = 0, high = n - 1;

            if (
                crossProduct(mini_hull[high], mini_hull[high - 1], Q) >= 0 &&
                crossProduct(mini_hull[high], mini_hull[0], Q) >= 0
            ) {
                return mini_hull[high];
            }
            if (
                crossProduct(mini_hull[low], mini_hull[low + 1], Q) >= 0 &&
                crossProduct(mini_hull[low], mini_hull[high], Q) >= 0
            ) {
                return mini_hull[low];
            }

            while (low != high) {
                const mid = Math.floor((low + high) / 2);
                const prev = (mid - 1 + n) % n;
                const next = (mid + 1) % n;

                // Check if the current point is the tangent
                if (
                    crossProduct(mini_hull[mid], mini_hull[prev], Q) >= 0 &&
                    crossProduct(mini_hull[mid], mini_hull[next], Q) >= 0
                ) {
                    return mini_hull[mid];
                }

                // Determine search direction
                if (crossProduct(mini_hull[mid], mini_hull[next], Q) < 0) {
                    low = mid + 1; // Move to the right
                } else {
                    high = mid; // Move to the left
                }
            }
            return mini_hull[low];
        }

        const lower = findLowerTangent();
        const upper = findUpperTangent();
        console.log("Mini",mini_hull);
        console.log("Q", Q);
        console.log("lower",lower);
        console.log("upper",upper);

        return { lower, upper };
    }

let hull: Point[] = [
    {id:1, x:3, y:2},
    {id:2, x:5, y:3},
    {id:3, x:6, y:5},
    {id:4, x:3, y:7},
    {id:5, x:2, y:4}
];
let A: Point = {id:6, x:10, y:4};
let B: Point = {id:7, x:4, y:10};
let C: Point = {id:8, x:0, y:4};
let D: Point = {id:9, x:3.5, y:0};
console.log("A",findTangents(hull, A));
console.log("B",findTangents(hull, B));
console.log("C",findTangents(hull, C));
console.log("D",findTangents(hull, D));
