import { AlgorithmDetails } from "@/types";

export const algorithms: AlgorithmDetails[] = [
  {
    type: "naive",
    name: "Naive Algorithm",
    description: "This is a description for the Naive algorithm.",
    complexity: {
      time: "O(n^3)",
      reasoning: "",
    },
    code: "print('naive algorithm')",
    resources: [],
  },
  {
    type: "graham",
    name: "Graham's Scan",
    description: "This is a description for Graham algorithm.",
    complexity: {
      time: "O(n log n)",
      reasoning: "",
    },
    code: 
    `    def graham_scan(points):
        stack = []

        # p0 is lowest and leftmost point
        p0 = (math.inf, math.inf)
        for p in points:
                if p[1] < p0[1] or (p[1] == p0[1] and p[0] < p0[0]):
                        p0 = p

        # Sort by angle to lowest left most point
        points.sort(key=lambda x:math.atan2((x[1] - p0[1]), (x[0] - p0[0])))

        for point in points:
                while len(stack) > 1 and clockwise(stack[-2], stack[-1], point) == false:
                        stack.pop()
                stack.append(point)
        return stack`,
    resources: [],
  },
  {
    type: "jarvis",
    name: "Jarvis March",
    description: "This is a description for Jarvis algorithm.",
    complexity: {
      time: "O(n log h)",
      reasoning: "",
    },
    code: "print('jarvis')",
    resources: [],
  },
  {
    type: "chans",
    name: "Chan's Algorithm",
    description: "This is a description for Chans algorithm.",
    complexity: {
      time: "O (n log n)",
      reasoning: "",
    },
    code: "print('chans')",
    resources: [],
  },
];
