import {Algorithm, defaultStep, Point, Edge } from "@/types"
import { orient, generate_edges_from_arr, mergeSortByAngle, generate_edges_from_arr_closed, EdgeCounter} from './ConvexHull.ts';
import { minifySync } from "next/dist/build/swc/index";
import { after } from "node:test";

export class ChansAlgorithm extends Algorithm {
    edge_counter: EdgeCounter;
    constructor(points: Point[]){
        super();
        this.edge_counter = new EdgeCounter(points);
        this.chans_algorithm(points);
    }


    chans_algorithm(points: Point[]): void {
        const n = points.length;

        for (let m = 2; m <= n; m *= m){
            const subsets: Point[][] = [];
            let mini_hull_edges: Edge[] = [];
            for (let i = 0; i < n; i += m){
                let next_subset = this.graham_helper(points, mini_hull_edges, points.slice(i, i + m));
                subsets.push(next_subset);
                let current_edges = generate_edges_from_arr_closed(next_subset, this.edge_counter);
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
        subset_points = mergeSortByAngle(all_points, all_edges, lowest_leftmost, subset_points, this.step_queue, this.edge_counter);
        let rem_i = subset_points.indexOf(lowest_leftmost);
        let [rem] = subset_points.splice(rem_i, 1);
        subset_points.unshift(rem)
        num_points = subset_points.length

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
                if(curr_subset.length == 1){
                    if(curr_subset[0] != current_point){
                        tangents.push(curr_subset[0]);
                    }
                }
                else if(curr_subset.length == 2){
                    //tangents = [...tangents, ...curr_subset];
                    let p = curr_subset[0];
                    let q = curr_subset[1];
                    if(current_point != p  && orient(current_point, p, q) >= 0){
                        tangents.push(p);
                    }
                    else if(current_point != q){
                        tangents.push(q);
                    }
                }
                else if(!curr_subset.includes(current_point)){
                    let t1 = findTangent(curr_subset, current_point);
                    tangents.push(t1);
                }
                else{
                    let index = curr_subset.indexOf(current_point);
                    tangents.push(curr_subset[(index + 1) % curr_subset.length])
                }
            }
            return tangents;
        }
        console.log(subsets);

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

        var current_point = convex_hull[convex_hull.length-1];
        var hull_done = false;

        for (var n = 0; n < m ; n++){

            let tangents = build_tangent_array(current_point);
            //console.log("m", m);
            let best_candidate: Point = tangents[0]; // initial value
            //console.log("Num subsets", subsets.length);
            console.log("Current point", current_point);
            console.log("Tangents", tangents);
            let num_tangents = tangents.length;

            for (i = 0; i < num_tangents; i++){
                let candidate = tangents[i];
                //console.log("candidate", candidate);
                //console.log("best_candidate", best_candidate);

                if ((convex_hull.includes(candidate) && candidate != right_most)
                    || current_point == candidate || candidate == best_candidate){
                    continue;
                }

                let tempEdges: Edge[] = generate_edges_from_arr(convex_hull);
                let tempID = this.edge_counter.nextNumber();
                tempEdges.push({id:tempID, highlight: true, start:current_point, end: candidate});

                this.step_queue.enqueue({...defaultStep, 
                                        highlightEdges:[tempID],
                                        highlightPoints:[current_point.id, candidate.id],
                                        points: all_points,
                                        edges: [...tempEdges, ...all_edges]
                                        })

                if(orient(current_point, candidate, best_candidate) >= 0){
                    best_candidate = candidate;
                }
            }
            if(best_candidate === right_most){
                hull_done = true;
                break;
            }
            convex_hull.push(best_candidate);
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

function findTangent(mini_hull: Point[], Q: Point): Point {
        console.log("mini_hull", mini_hull);
        console.log("Q", Q);
        let n = mini_hull.length;
        let [a, b] = [0, n - 1];
        if (orient(Q, mini_hull[a], mini_hull[(a - 1 + n) % n]) >= 0
        && orient(Q, mini_hull[a], mini_hull[(a + 1) % n]) >= 0){
            return mini_hull[a];
        }
        if (orient(Q, mini_hull[b], mini_hull[(b - 1 + n) % n]) >= 0
        && orient(Q, mini_hull[b], mini_hull[(b + 1) % n]) >= 0){
            return mini_hull[b];
        }
        while(true){
            let c = Math.floor((a + b) / 2);
            let before_c = orient(Q, mini_hull[c], mini_hull[(c - 1 + n) % n]);
            let after_c = orient(Q, mini_hull[c], mini_hull[(c + 1) % n]);
            if(before_c >= 0 && after_c >= 0){
                console.log("Found tangent", mini_hull[c]);
                return mini_hull[c];
            }

            let a_on_left_of_tans = orient(Q, mini_hull[a], mini_hull[(a + 1) % n]) >= 0;
            let a_above_c = orient(Q, mini_hull[a], mini_hull[c]) >= 0;
            let c_on_left_of_tans = orient(Q, mini_hull[c], mini_hull[(c + 1) % n]) >= 0;
            if(!a_on_left_of_tans){ // a on right
                if(!a_above_c && !c_on_left_of_tans){
                    a = c;
                }
                else{
                    b = c;
                }
            }
            else{ // on left
                if(a_above_c && c_on_left_of_tans){
                    a = c;
                }
                else if(!c_on_left_of_tans){ // c on right
                    a = c;
                }
                else{
                    b = c;
                }
            }
        }
        //Nuclear option
        //for(var s = 0; s < mini_hull.length; s++){
        //    if(orient(Q, mini_hull[s], mini_hull[(s-1+mini_hull.length) % mini_hull.length]) >= 0 &&
        //    orient(Q, mini_hull[s], mini_hull[(s+1) % mini_hull.length]) >= 0){
        //        return mini_hull[s];
        //    }
        //}
        //return mini_hull[s];
    }

let test_mini_hull: Point[] = [];
test_mini_hull.push({id:0, x:157, y:75});
test_mini_hull.push({id:1, x:526, y:89});
test_mini_hull.push({id:2, x:563, y:103});
test_mini_hull.push({id:3, x:671, y:247});
test_mini_hull.push({id:4, x:286, y:331});
test_mini_hull.push({id:5, x:11, y:184});
let test_q: Point = {id: 6, x:609, y:303};
let res = findTangent(test_mini_hull, test_q);
console.log(res);

