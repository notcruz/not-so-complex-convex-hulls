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
    code: 
   `def naive(points):
      ordered_pairs = cartesian_product(points, points)
      hull_edges = []
      for p, q in ordered_pairs:
        valid = true
        for point in points:
          if(right_hand_turn(p, point, q)):
            valid = false
        if(valid):
          hull_edges += [Edge(p, q)]
      return hull_edges`
    ,
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
   `def graham_scan(points):
      stack = []
      # p0 is lowest and leftmost point
      p0 = findP0(points)
      # Sort points by angle to lowest left most point
      mergesort_points_by_angle_to_anchor(points, p0)
      for point in points:
        while (len(stack) > 1 
              and clockwise(stack[-2], stack[-1], point) == false):
          stack.pop()
        stack.push(point)
      return stack`,
    resources: [],
  },
  {
    type: "jarvis",
    name: "Jarvis March",
    description: "This is a description for Jarvis algorithm.",
    complexity: {
      time: "O(nh)",
      reasoning: "",
    },
    code:
   `def jarvis_march(points):
      leftmost, rightmost = find_left_right(points)
      current_point = rightmost
      hull = [rightmost]
      while(true):
        # Setup initial values
        best_candidate = left_most
        for p in points:
          if((p in hull and p is not rightmost):
            continue
          if(orient(current_point, p, best_candidate) >= 0):
            best_candidate = current_point
        if(best_candidate == right_most):
          break
        hull.push(best_candidate)
        current_point = best_candidate
      return hull`,
    resources: [],
  },
  {
    type: "chans",
    name: "Chan's Algorithm",
    description: "This is a description for Chans algorithm.",
    complexity: {
      time: "O (n log h)",
      reasoning: "",
    },
    code: 
   `def chans(points):
      n = len(points)
      for(m = 2; m <= n; m *= m):
        mini_hulls = [] # Group up points arbitrarily
        for(i = 0; i < n; i += m):
          current_hull = graham_scan(points[i, i + m])
          mini_hulls.push(current_hull)
        """
        Here, jarvis_helper is just like jarvis_march but
        with two main differences:
        1) There is a limit of m iterations on the main outer loop,
        and jarvis_helper will return an empty list if it has an
        unfinished hull by the end of those m iteration.
        2) Instead of using all the points of the minihulls, 
        jarvis_helper will find the upper tangent of each hull for
        the current_point using binary search.
        """
        hull_maybe = jarvis_helper(mini_hulls, m)
        if(hull_maybe != []):
          return hull_maybe`,
    resources: [],
  },
];
