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
    code: "print('graham')",
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
