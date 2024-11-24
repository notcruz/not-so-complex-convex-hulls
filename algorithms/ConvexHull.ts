import { Matrix } from "mathjs";
import { matrix } from "mathjs";
import { det } from "mathjs";

export type Point = [x: number, y: number];

export function orient(p: Point, q: Point, r: Point) : boolean {
    // Return true if p->q->r is a left-hand turn
    let [px, py] = p;
    let [qx, qy] = q;
    let [rx, ry] = r;
    let M: Matrix = matrix([[1, px, py],[1, qx, qy], [1, rx, ry]]);
    let d: number = det(M);

    if (d < 0) {
        return false;
    }
    else{
        return true;
    }
}
