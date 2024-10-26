import { Algorithm } from "@/types";

export const algorithms: Algorithm[] = [
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
    type: "jarvis",
    name: "Jarvis Algorithm",
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
    name: "Chans Algorithm",
    description: "This is a description for Chans algorithm.",
    complexity: {
      time: "O (n log n)",
      reasoning: "",
    },
    code: "print('chans')",
    resources: [],
  },
];
