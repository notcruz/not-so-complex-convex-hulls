import { Matrix, matrix } from "mathjs";
import { det } from "mathjs";
import { Point, Edge, AlgorithmStep, defaultStep } from "@/types";
import { atan2 } from 'mathjs';
import { LinkedQueue } from "../queue";

export class EdgeCounter{
    static count = 0;
    constructor(points: Point[]){
        EdgeCounter.count = points.length;
    }
    nextNumber(){
        EdgeCounter.count += 1;
        return EdgeCounter.count;
    }
}


export function orient(p: Point, q: Point, r: Point) : number {
    // Return true if p->q->r is a left-hand turn
    let {x:px, y:py} = p;
    let {x:qx, y:qy} = q;
    let {x:rx, y:ry} = r;
    let M: Matrix = matrix([[1, px, py],[1, qx, qy], [1, rx, ry]]);
    let d: number = det(M);

    return d;
}

export function generate_edges_from_arr(arr: Point[], edge_counter?: EdgeCounter): Edge[] {
    var edges: Edge[] = [];

    for(var i = 1; i < arr.length; i++){
        let next_id = edge_counter ? edge_counter.nextNumber() : i
        let new_edge = {id: next_id, highlight:false, start: arr[i-1], end: arr[i]};
        edges.push(new_edge);
    }
    return edges;
}

export function generate_edges_from_arr_closed(arr: Point[], edge_counter?: EdgeCounter): Edge[] {
    var edges: Edge[] = generate_edges_from_arr(arr);

    let connecting_edge: Edge = {id:edge_counter? edge_counter.nextNumber() : arr.length + 1, start: arr[arr.length - 1], end: arr[0]};
    edges.push(connecting_edge);
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

export function mergeSortByAngle(full_points: Point[], full_edges: Edge[], anchor: Point, points: Point[], step_queue: LinkedQueue<AlgorithmStep>,
    edge_counter?: EdgeCounter
): Point[] {
    if (points.length <= 1) {
        return points;
    }

    // Split the array into two halves
    const mid = Math.floor(points.length / 2);
    const left = points.slice(0, mid);
    const right = points.slice(mid);

    // Recursively sort both halves
    const sortedLeft = mergeSortByAngle(full_points, full_edges, anchor, left, step_queue, edge_counter);
    const sortedRight = mergeSortByAngle(full_points, full_edges, anchor, right, step_queue, edge_counter);

    // Merge the sorted halves
    return merge(full_points, full_edges, anchor, sortedLeft, sortedRight, step_queue, edge_counter);
}

function merge(points: Point[], edges: Edge[], anchor: Point, left: Point[], right: Point[], step_queue: LinkedQueue<AlgorithmStep>,
    edge_counter?: EdgeCounter
): Point[] {
    const result: Point[] = [];
    let i = 0,
        j = 0;

    // Merge points based on their angles
    while (i < left.length && j < right.length) {
        const angleLeft = calculateAngle(anchor, left[i]);
        const angleRight = calculateAngle(anchor, right[j]);
        
        let next_id = edge_counter ? edge_counter.nextNumber() : -1
        step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[left[i].id, right[j].id],
                points:points,
                highlightEdges:[next_id],
                edges: [{id:next_id, highlight: true, start:anchor, end: left[i]},
                        {id:edge_counter ? edge_counter.nextNumber() : -2, highlight: true, start:anchor, end: right[j]}, ...edges]
            })

        if (angleLeft <= angleRight) {

            let next_id = edge_counter ? edge_counter.nextNumber() : -1
            step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[left[i].id, right[j].id],
                points:points,
                highlightEdges:[next_id],
                edges: [{id:next_id, highlight: true, start:anchor, end: left[i]},
                        {id:edge_counter ? edge_counter.nextNumber() : -2, highlight: true, start:anchor, end: right[j]}, ...edges]
            })
            result.push(left[i]);
            i++;
        } else {
            let next_id = edge_counter ? edge_counter.nextNumber() : -2
            step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[left[i].id, right[j].id],
                points:points,
                highlightEdges:[next_id],
                edges: [{id:edge_counter ? edge_counter.nextNumber() : -1, highlight: true, start:anchor, end: left[i]},
                        {id:next_id, highlight: true, start:anchor, end: right[j]}, ...edges]
            })
            result.push(right[j]);
            j++;
        }
    }

    // Add remaining elements from both halves
    while (i < left.length) {

        let next_id = edge_counter ? edge_counter.nextNumber() : -1
        step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[left[i].id],
                points:points,
                highlightEdges:[next_id],
                edges: [{id:next_id, highlight: true, start:anchor, end: left[i]}, ...edges]
            })
        result.push(left[i]);
        i++;
    }

    while (j < right.length) {
        let next_id = edge_counter ? edge_counter.nextNumber() : -1
        step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[right[j].id],
                points:points,
                highlightEdges:[next_id],
                edges: [{id:next_id, highlight: true, start:anchor, end: right[j]}, ...edges]
            })
        result.push(right[j]);
        j++;
    }

    return result;
}

function calculateAngle(anchor: Point, point: Point): number {
    // Calculate the angle in radians between the anchor and the point
    return Math.atan2(point.y - anchor.y, point.x - anchor.x);
}