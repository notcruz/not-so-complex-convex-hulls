import { AlgorithmDetails } from "@/types";

export const algorithms: AlgorithmDetails[] = [
  {
    type: "naive",
    name: "Naive Algorithm",
    description: "The naive convex hull generating algorithm is a brute force attempt at seeing which \
    pairs of points belong on the hull. It check every pair combination against every other point.",
    complexity: {
      time: "O(n^3)",
      reasoning: "For every pair combination (n^2), check if every other point is to the left of that pair (n).",
    },
    code:
      `def naive(points):
      ordered_pairs = cartesian_product(points, points)
      hull_edges = []
      for p, q in ordered_pairs:
        valid = true
        for point in points:
          if(orient(p, point, q) < 0):
            valid = false
        if(valid):
          hull_edges += [Edge(p, q)]
      return hull_edges`
    ,
    resources: [],
    steps: {
      "naive": "The naive algorithm will go through every ordered pair of the point list.\
       If a pair has no points to its right, then the edge between the pair belongs on the convex hull."},
  },
  {
    type: "graham",
    name: "Graham's Scan",
    description: "Named after Ronald Graham, Graham's Scan sorts points and analyzes them in sequence. It uses a stack to keep track\
    of the convex hull it iteratively builds.",
    complexity: {
      time: "O(n log n)",
      reasoning: "While Graham's Scan builds the hull stack in O(n) time and takes O(n log n) time to sort the points, \
      the time complexity is still O(n log n) because time to sort dominates time to build the stack.",
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
              and orient(stack[-2], stack[-1], point) < 0):
          stack.pop()
        stack.push(point)
      return stack`,
    resources: [],
    steps: {
      "begin": "To begin this Graham's Scan, a merge sort is performed on all of the points.\
       They are ordered by their angle to the lowest point.",
      "main_loop": "Now that the points are sorted, a stack is kept to hold the convex hull.\
       Graham scan traverses through the ordered points. If the stack has at least two points in it,\
       the scan will orient the last two points on the stack and the new point being checked.\
        While the orientation is a right hand turn, pop the last point off the stack. If the stack goes down to \
        one point or a right hand turn is no longer detected, the point being checked is added.",
      "done": "Once there are no more points to check, the convex hull is finished and the stack is returned."
    },
  },
  {
    type: "jarvis",
    name: "Jarvis March",
    description: "Named after R.A. Jarvis and sometimes called the \'Gift-Wrapping Algorithm\', \
    Jarvis March is an output-sensitive algorithm that loops through unordered points to \
    find a point that minimizes turning angle from the current point.",
    complexity: {
      time: "O(nh)",
      reasoning: "The current point in the outer loop only changes when the next point on the hull\
      is found and only stops when the convex hull is complete (O(h)). The inner loop checks the \
      current point against all other points (O(n)).",
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
    steps: {
      "begin": "To begin Jarvis March, the rightmost point must be found. The hull begins as a list containing the rightmost point.",
      "main_loop": "While the rightmost point is not reached again, the current point is set to the\
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
    description: "Named after Timithy M. Chan, Chan's Algorithm is an output-sensitive algorithm that combines Graham's \
    Scan and a modified version of Jarvis March. It chooses to subdivide points into groups of at most some guess m, compute mini convex hulls for each grouping, \
    and then run a type of Jarvis March on all the mini hulls.",
    complexity: {
      time: "O (n log h)",
      reasoning: "Performing Graham's Scan on all K subgroupings of m points takes K * O(m log m) = O(n log m).\
      Performing Jarvis March is simpler than normal, only allowing m iterations in the outer loop and using\
      binary search to find the upper tangent of a given mini hull in O(log m) time, O(K log m) for all\
      the mini hulls, and O(K h log m) for the entire Jarvis March. If m is a good guess (h <= m <= h^2), then\
      this run time is O(n log h) which trumps the runtime of the Graham's Scan phase.\
      To find a good guess for m, the number of points allowed in a mini hull, a squaring strategy is adopted, \
      restarting and doubling m when Jarvis March does not finish executing.",
    },
    code:
      `def chans(points):
      n = len(points)
      m = 2
      while(m <= n):
        mini_hulls = [] # Group up points arbitrarily
        for(i = 0; i < n; i += m):
          current_hull = graham_scan(points[i, i + m])
          mini_hulls.push(current_hull)
        hull_maybe = jarvis_helper(mini_hulls, m)
        if(hull_maybe != []):
          return hull_maybe
        m = min(m*m, n)`,
    resources: [],
    steps: {
      "begin": "To begin, Chan's Algorithm will arbitrarily subsdivide the points into groups of at most m, \
      where m is a guess.",
      "graham_done": "Here are the finished mini convex hull edges.",
      "graham": "For each subdivision of points, Graham's Scan is performed to obtain a mini convex hull.",
      "jarvis": "With a handful of mini convex hulls, Chan's Algorithm will perform a modified Jarvis March\
    on the convex hulls. The modifications being that the outer loop of Jarvis March is restricted to m\
    iterations and that only the upper tangent from the current point to each convex hulls along with the\
    next point of the current point's own convex hull are considered. The tangents can be found in O(log(h))\
     time where h is the number of points on the mini hull. If m iterations pass before the convex hull is\
     finished, then Jarvis March returns an empty hull and starts Chan's Algorthm again with a doubled guess.",
      "done": "Jarvis March has returned a non-empty list, so the guess was good enough and the hull is complete."
    },
  },
];
