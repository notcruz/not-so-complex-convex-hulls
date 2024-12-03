import { Algorithm, Point, defaultStep, Edge } from '@/types';
import { generate_edges_from_arr, orient } from './ConvexHull';

export class JarvisMarch extends Algorithm {
    
    constructor(points: Point[]){
        super();
        this.jarvis_march(points);
    }

    jarvis_march(points: Point[]): Point[] {

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
        while (true){
            let best_candidate: Point = left_most; // initial value
            for (i = 0; i < num_points; i++){
                let candidate = points[i];

                if ((convex_hull.includes(candidate) && candidate != right_most) 
                    || current_point == candidate || candidate == best_candidate){
                    continue;
                }

                let tempEdges: Edge[] = generate_edges_from_arr(convex_hull);
                tempEdges.push({id:-1, highlight: true, start:current_point, end: candidate});

                this.step_queue.enqueue({...defaultStep, 
                                        highlightEdges:[-1],
                                        highlightPoints:[current_point.id, candidate.id],
                                        points: points,
                                        edges: tempEdges
                                        })

                if (orient(current_point, candidate, best_candidate) >= 0){
                    best_candidate = candidate;
                }
            }
            if(best_candidate == right_most){
                break;
            }
            convex_hull.push(best_candidate)
            current_point = best_candidate;
        }

        let conv_hull_edges = generate_edges_from_arr(convex_hull);
        let connecting_edge = {id: -1, highlight:false, start: convex_hull[convex_hull.length -1], end: convex_hull[0]}
        conv_hull_edges.push(connecting_edge);
        this.step_queue.enqueue({...defaultStep, points:points, edges:conv_hull_edges})
        return convex_hull;
    }
}
