import { Matrix, matrix } from "mathjs";
import { det } from "mathjs";
import { Point } from "@/types";


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

let x: Point = {id: 0, highlight: false, x: 0, y: 10}
let y: Point = {id: 0, highlight: false, x: 10, y: 0}
let z: Point = {id: 0, highlight: false, x: 10, y: -20}
console.log(orient(x, y, z))
