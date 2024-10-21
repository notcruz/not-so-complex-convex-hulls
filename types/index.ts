export type Algorithm = {
  type: string;
  name: string;
  description: string;
  complexity: {
    time: string;
    reasoning: string;
  };
  code: string;
  resources: string[];
};
