'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TestAlgorithm } from '@/lib/algorithms/TestAlgorithm';
import { ChansAlgorithm } from '@/lib/algorithms/chan';
import { GrahamScan } from '@/lib/algorithms/graham';
import { JarvisMarch } from '@/lib/algorithms/jarvis';
import { NaiveAlgorithm } from '@/lib/algorithms/naive';
import { cn } from '@/lib/utils';
import { algorithmAtom } from '@/state';
import { Point, Edge, Algorithm } from '@/types';
import {
  PauseIcon,
  PlayIcon,
  ResetIcon,
  ResumeIcon,
  TrackNextIcon,
} from '@radix-ui/react-icons';
import { useAtomValue } from 'jotai';
import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { atomOneDark, CodeBlock, dracula } from 'react-code-blocks';
import { clearInterval, setInterval } from 'timers';
import { useInterval } from 'usehooks-ts';

const RANDOM_POINTS_COUNT = 25;

export default function Visualizer() {
  return (
    <div className={'flex-1 grid grid-cols-6 gap-x-6 m-6'}>
      <AlgorithmCode />
      <div className={'col-span-4 flex flex-col gap-y-6'}>
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
        'flex flex-col gap-y-3 border rounded p-6',
        props.className
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
        language={'python'}
        theme={atomOneDark}
        showLineNumbers
      />
    </Container>
  );
};

const PickYourPoints = () => {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(true);
  const [points, setPoints] = useState<Point[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [interval, setInterval] = useState(1000);
  const svgRect = useRef(null);
  const intervalRef = useRef(null);

  const algorithm = useAtomValue(algorithmAtom);
  const [algo, setAlgo] = useState<Algorithm>();
  const [complete, setComplete] = useState(false);

  // reset board whenever the algorithm is updated
  useEffect(() => {
    if (algorithm) {
      reset();
    }
  }, [algorithm]);

  const createPoint = (x: number, y: number) => {
    setPoints([...points, { id: points.length + 1, x, y }]);
  };

  const createEdge = (start: Point, end: Point) => {
    setEdges([...edges, { id: edges.length + 1, start, end }]);
  };

  const handlePointGeneration = (e: MouseEvent<SVGElement>) => {
    if (started) return;
    const target = e.target as SVGElement;
    const rect = target.getBoundingClientRect();
    createPoint(e.clientX - rect.left, rect.bottom - e.clientY);
  };

  const handleCursorNavigation = (e: MouseEvent<SVGElement>) => {
    if (!svgRect) return;

    const rect = svgRect.current.getBoundingClientRect();
    const x = Math.ceil(Math.max(e.clientX - rect.left, 0));
    const y = Math.ceil(Math.max(rect.bottom - e.clientY, 0));
    setCursorPosition({ x, y });
  };

  const handleStart = () => {
    setStarted(true);
    setPaused(false);

    play();
  };

  const handleStep = () => {
    if (!started) {
      handleStart();
    }

    if (algo?.hasNextStep()) {
      const result = algo?.runNextStep(points, edges);
      setPoints(
        result?.points.map((point) => {
          return {
            ...point,
            highlight: result.highlightPoints.includes(point.id),
          };
        })
      );

      setEdges(
        result?.edges.map((edge) => {
          return {
            ...edge,
            highlight: result.highlightEdges.includes(edge.id),
          };
        })
      );

      setComplete(!algo.hasNextStep());
    }

    setPaused(true);
  };

  const reset = () => {
    setComplete(false);
    setStarted(false);
    setPaused(true);
    setPoints([]);
    setEdges([]);
  };

  const generateRandomPoints = () => {
    const newPoints = [];
    const { height, width } = svgRect.current.getBoundingClientRect();
    for (let i = 0; i < RANDOM_POINTS_COUNT; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      newPoints.push({ id: newPoints.length + 1, x, y });
    }

    setPoints(newPoints);
  };

  const play = () => {
    var testAlgorithm: Algorithm | undefined = undefined;
    switch (algorithm?.type) {
      case 'graham':
        testAlgorithm = new GrahamScan(points);
        break;
      case 'naive':
        testAlgorithm = new NaiveAlgorithm(points);
        break;
      case 'jarvis':
        testAlgorithm = new JarvisMarch(points);
        break;
      case 'chans':
        testAlgorithm = new ChansAlgorithm(points);
        break;
      default:
        testAlgorithm = new TestAlgorithm();
        break;
    }
    setAlgo(testAlgorithm);
  };

  const pause = () => {};

  useInterval(
    () => {
      if (!paused) {
        const result = algo?.runNextStep(points, edges);
        setPoints(
          result?.points.map((point) => {
            return {
              ...point,
              highlight: result.highlightPoints.includes(point.id),
            };
          })
        );

        setEdges(
          result?.edges.map((edge) => {
            return {
              ...edge,
              highlight: result.highlightEdges.includes(edge.id),
            };
          })
        );

        setComplete(!algo?.hasNextStep());
      }
    },
    algo?.hasNextStep() ? interval : null
  );

  return (
    <Container title="Pick Your Points" className="flex-1">
      <svg
        ref={svgRect}
        className={cn(
          'flex-1 border border-primary',
          started ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
        onMouseMoveCapture={handleCursorNavigation}
        onClick={handlePointGeneration}
      >
        {points.map(({ x, y, highlight }) => {
          const fill = highlight ? 'orange' : 'black';
          const stroke = highlight ? 'orange' : 'black';
          var rect = svgRect.current.getBoundingClientRect();
          const fixed_y = rect.bottom - y - rect.top;
          return (
            <circle
              key={`${x}_${y}`}
              cx={x}
              cy={fixed_y}
              r={5}
              fill={fill}
              stroke={stroke}
            />
          );
        })}
        {edges.map(({ id, highlight, start, end }) => {
          const fill = highlight ? 'orange' : 'black';
          const stroke = highlight ? 'orange' : 'black';
          var rect = svgRect.current.getBoundingClientRect();
          const fixed_sy = rect.bottom - start.y - rect.top;
          const fixed_ey = rect.bottom - end.y - rect.top;
          return (
            <line
              key={`${start.x}_${end.y}_${id}`}
              fill={fill}
              stroke={stroke}
              x1={start.x}
              y1={fixed_sy}
              x2={end.x}
              y2={fixed_ey}
            />
          );
        })}
      </svg>
      <div>
        Cursor Position: ({cursorPosition.x}, {cursorPosition.y})
      </div>
      <div className="flex items-center justify-center gap-x-3">
        <Button disabled={paused} onClick={() => setPaused(true)}>
          <PauseIcon className="h-4 w-4 fill-current" />
        </Button>
        {started ? (
          <Button
            disabled={!paused || complete}
            onClick={() => setPaused(false)}
          >
            <ResumeIcon className="h-4 w-4 fill-current" />
          </Button>
        ) : (
          <Button
            onClick={handleStart}
            disabled={points.length === 0 || complete}
          >
            <PlayIcon className="h-4 w-4 fill-current" />
          </Button>
        )}
        <Button onClick={handleStep} disabled={points.length === 0 || complete}>
          <TrackNextIcon className="h-4 w-4 fill-current" />
        </Button>
        <Button onClick={reset} disabled={points.length === 0}>
          <ResetIcon className="h-4 w-4 fill-current" />
        </Button>
        <Button disabled={!paused} onClick={generateRandomPoints}>
          Generate Random Points
        </Button>
      </div>
      <div className="flex items-center justify-center mt-3">
        <Slider
          className="max-w-96"
          defaultValue={[1000]}
          min={10}
          max={1000}
          step={50}
          onValueCommit={(e) => {
            setInterval(e[0]);
          }}
        />
      </div>
    </Container>
  );
};

const Description = () => {
  return <Container title="Step Description"></Container>;
};
