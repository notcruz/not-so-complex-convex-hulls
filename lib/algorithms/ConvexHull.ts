import { Matrix, matrix } from "mathjs";
import { det } from "mathjs";
import { Point, Edge, AlgorithmStep, defaultStep } from "@/types";
import { atan2 } from 'mathjs';
import { LinkedQueue } from "../queue";


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

export function mergeSortByAngle(full_points: Point[], anchor: Point, points: Point[], step_queue: LinkedQueue<AlgorithmStep>): Point[] {
    if (points.length <= 1) {
        return points;
    }

    // Split the array into two halves
    const mid = Math.floor(points.length / 2);
    const left = points.slice(0, mid);
    const right = points.slice(mid);

    // Recursively sort both halves
    const sortedLeft = mergeSortByAngle(full_points, anchor, left, step_queue);
    const sortedRight = mergeSortByAngle(full_points, anchor, right, step_queue);

    // Merge the sorted halves
    return merge(full_points, anchor, sortedLeft, sortedRight, step_queue);
}

function merge(points: Point[], anchor: Point, left: Point[], right: Point[], step_queue: LinkedQueue<AlgorithmStep>): Point[] {
    const result: Point[] = [];
    let i = 0,
        j = 0;

    // Merge points based on their angles
    while (i < left.length && j < right.length) {
        const angleLeft = calculateAngle(anchor, left[i]);
        const angleRight = calculateAngle(anchor, right[j]);

        step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[left[i].id, right[j].id],
                points:points,
                highlightEdges:[-1],
                edges: [{id:-1, highlight: true, start:anchor, end: left[i]},
                        {id:-2, highlight: true, start:anchor, end: right[j]}]
            })

        if (angleLeft <= angleRight) {
            step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[left[i].id, right[j].id],
                points:points,
                highlightEdges:[-1],
                edges: [{id:-1, highlight: true, start:anchor, end: left[i]},
                        {id:-2, highlight: true, start:anchor, end: right[j]}]
            })
            result.push(left[i]);
            i++;
        } else {
            step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[left[i].id, right[j].id],
                points:points,
                highlightEdges:[-2],
                edges: [{id:-1, highlight: true, start:anchor, end: left[i]},
                        {id:-2, highlight: true, start:anchor, end: right[j]}]
            })
            result.push(right[j]);
            j++;
        }
    }

    // Add remaining elements from both halves
    while (i < left.length) {
        step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[left[i].id],
                points:points,
                highlightEdges:[-1],
                edges: [{id:-1, highlight: true, start:anchor, end: left[i]}]
            })
        result.push(left[i]);
        i++;
    }

    while (j < right.length) {
        step_queue.enqueue({
                ...defaultStep,
                highlightPoints:[right[j].id],
                points:points,
                highlightEdges:[-1],
                edges: [{id:-1, highlight: true, start:anchor, end: right[j]}]
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