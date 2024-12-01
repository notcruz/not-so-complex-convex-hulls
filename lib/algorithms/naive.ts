import { Algorithm, Point, Edge, defaultStep } from '@/types';
import { orient } from './ConvexHull';


export class NaiveAlgorithm extends Algorithm {
    
    constructor(points: Point[]){
        super();
        this.naive(points);
    }

    naive(points: Point[]): void {
        // Perform Brute Force Convex Hull algorithm on a list of points.
        points.sort((a, b) => a.x - b.x)

        var ch_edges: Edge[] = [];
        var all_ordered_pairs: [Point, Point][] = cartesianProduct<Point>(points);

        for(var i = 0; i < all_ordered_pairs.length; i++){
            let current_pair = all_ordered_pairs[i];
            let p: Point = current_pair[0];
            let q: Point = current_pair[1];
            let valid = true;

            for(var j = 0; j < points.length; j++){
                let r: Point = points[j];

                if(r != p && r != q){
                    let tempEdges = [...ch_edges];
                    tempEdges.push({id:-1, start: p, end: q})
                    this.step_queue.enqueue({
                        ...defaultStep,
                        highlightPoints:[p.id, q.id, r.id],
                        highlightEdges:[-1],
                        points:points,
                        edges: tempEdges
                    });
                    if(orient(p, r, q) >= 0){
                        valid = false;
                    }
                }
            }
            if (valid){
                ch_edges.push({id:ch_edges.length + 1, start: p, end:q})
            }

        }
        this.step_queue.enqueue({...defaultStep, points: points, 
            edges: ch_edges});
    }
}

function cartesianProduct<T>(array: T[]): [T, T][] {
    const result: [T, T][] = [];
    
    for (const a of array) {
        for (const b of array) {
            result.push([a, b]);
        }
    }
    
    return result;
}