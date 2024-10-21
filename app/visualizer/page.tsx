"use client";

import { cn } from "@/lib/utils";
import { algorithmAtom } from "@/state";
import { useAtomValue } from "jotai";
import { MouseEvent, useState } from "react";
import { CodeBlock } from "react-code-blocks";

export default function Visualizer() {
  return (
    <div className={"flex-1 grid grid-cols-6 gap-x-6 m-6"}>
      <AlgorithmCode />
      <div className={"col-span-4 flex flex-col gap-y-6"}>
        <PickYourPoints />
        <Description />
      </div>
    </div>
  );
}

type ContainerProps = {
  children?: React.ReactNode;
  className?: string;
  title: string;
};

const Container = (props: ContainerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-y-3 border rounded p-6",
        props.className,
      )}
    >
      <div className="text-lg font-semibold">{props.title}</div>
      {props.children}
    </div>
  );
};

const AlgorithmCode = () => {
  const algorithm = useAtomValue(algorithmAtom);

  return (
    <Container title="Code Block" className="col-span-2">
      <CodeBlock
        text={algorithm?.code}
        language={"python"}
        wrapLongLines
        showLineNumbers
      />
    </Container>
  );
};

const PickYourPoints = () => {
  const [circles, setCircles] = useState<JSX.Element[]>([]);
  const determineCoordinated = (event: MouseEvent<SVGElement>) => {
    const target = event.target as SVGElement;
    const rect = target.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const generateCircle = (e: MouseEvent<SVGElement>) => {
    const { x, y } = determineCoordinated(e);
    const circle = (
      <circle key={`${x}_${y}`} cx={x} cy={y} r={5} stroke={"red"} fill="red" />
    );

    setCircles([...circles, circle]);
  };

  return (
    <Container title="Pick Your Points" className="flex-1">
      <svg className={"flex-1 border border-primary"} onClick={generateCircle}>
        {circles}
      </svg>
    </Container>
  );
};

const Description = () => {
  return <Container title="Step Description"></Container>;
};

