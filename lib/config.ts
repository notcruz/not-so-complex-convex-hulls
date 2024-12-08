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
    steps: {"naive": "The naive algorithm will go through every ordered pair of the point list.\
       If a pair has no points to its right, then the edge between the pair belongs on the convex hull."},
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
    steps: {"begin": "To begin this Graham's Scan, a merge sort is performed on all of the points.\
       They are ordered by their angle to the lowest point.",
      "main_loop":"Now that the points are sorted, a stack is kept to hold the convex hull.\
       Graham scan traverses through the ordered points. If the stack has at least two points in it,\
       the scan will orient the last two points on the stack and the new point being checked.\
        While the orientation is a right hand turn, pop the last point off the stack. If the stack goes down to \
        one point or a right hand turn is no longer detected, the point being checked is added.",
        "done":"Once there are no more points to check, the convex hull is finished and the stack is returned."
    },
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
    steps: {"begin":"To begin Jarvis March, the rightmost point must be found. The hull begins as a list containing the rightmost point.",
      "main_loop":"While the rightmost point is not reached again, the current point is set to the\
       last one found that belongs in the convex hull. Jarvis March will set a best candidate point\
        to an arbitrary value and then loop for the current point. For every other candidate point, the orientation\
         of the current point, current candidate, and the best candidate is tested. If the current candidate\
          is to the right of the line from the current point to the best candidate, then the best\
          candidate is replaced by the current candidate. At the end of the inner loop,\
          if the best candidate is actually the rightmost point, then the outer loop is broken out of.",
      "done": "With the outer loop broken, the convex hull can be simply returned."
    },
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
    steps: {"begin":"To begin, Chan's Algorithm will arbitrarily subsdivide the points into groups of at most m, \
      where m is a guess.",
      "graham_done": "Here are the finished mini convex hull edges.",
    "graham": "For each subdivision of points, Graham's Scan is performed to obtain a mini convex hull.",
    "jarvis": "With a handful of mini convex hulls, Chan's Algorithm will perform a modified Jarvis March\
    on the convex hulls. The modifications being that the outer loop of Jarvis March is restricted to m\
    iterations and that only the upper tangent from the current point to each convex hulls along with the\
    next point of the current point's own convex hull are considered. The tangents can be found in O(log(h))\
     time where h is the number of points on the mini hull. If m iterations pass before the convex hull is\
     finished, then Jarvis March returns an empty hull and starts Chan's Algorthm again with a doubled guess.",
    "done": "Jarvis March has returned a non-empty list, so the guess was good enough and the hull is complete."},
  },
];
