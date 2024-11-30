import { Matrix, matrix } from "mathjs";
import { det } from "mathjs";
import { Point, Edge } from "@/types";
import { atan2 } from 'mathjs';


export function orient(p: Point, q: Point, r: Point) : boolean {
    // Return true if p->q->r is a left-hand turn
    let {x:px, y:py} = p;
    let {x:qx, y:qy} = q;
    let {x:rx, y:ry} = r;
    let M: Matrix = matrix([[1, px, py],[1, qx, qy], [1, rx, ry]]);
    let d: number = det(M);

    if (d < 0) {
        return false;
    }
    else{
        return true;
    }
}

export function generate_edges_from_arr(arr: Point[]): Edge[] {
    var edges: Edge[] = [];

    for(var i = 1; i < arr.length; i++){
        let new_edge = {id: i, highlight:false, start: arr[i-1], end: arr[i]};
        edges.push(new_edge);
    }
    return edges;
}

export function slope(p1: Point, p2: Point): number {
    // Return the slope of p1->p2
    if (p1.x <= p2.x){
        return atan2((p2.y - p1.y),(p2.x - p1.x));
    }
    else{
        return slope(p2, p1);
    }
}
