'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChansAlgorithm } from '@/lib/algorithms/chan';
import { GrahamScan } from '@/lib/algorithms/graham';
import { JarvisMarch } from '@/lib/algorithms/jarvis';
import { NaiveAlgorithm } from '@/lib/algorithms/naive';
import { cn } from '@/lib/utils';
import { algorithmAtom } from '@/state';
import { Algorithm, AlgorithmStep, Edge, Point, Position } from '@/types';
import {
  PauseIcon,
  PlayIcon,
  ResetIcon,
  ResumeIcon,
  TrackNextIcon,
} from '@radix-ui/react-icons';
import { atom, useAtom, useAtomValue } from 'jotai';
import { MouseEvent, Suspense, useEffect, useRef, useState } from 'react';
import { atomOneDark, CodeBlock } from 'react-code-blocks';
import { toast } from 'sonner';
import { useInterval } from 'usehooks-ts';

const MAX_INTERVAL = 2000;
const MIN_INTERVAL = 10;
const placeHolderDecription =
  'Step through an algorithm to see described steps.';
const sharedStepDescription = atom(placeHolderDecription);
const sharedHighlightLine = atom('0');

export default function Visualizer() {
  const algorithm = useAtomValue(algorithmAtom);

  return (
    <>
      <h1 className="text-center text-lg font-bold">{algorithm?.name}</h1>
      <div className={'flex-1 grid grid-cols-6 gap-x-6 m-6'}>
        <AlgorithmCode />
        <div className={'col-span-4 flex flex-col gap-y-6'}>
          <PickYourPoints />
          <Description />
        </div>
      </div>
    </>
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
  const highlightLine = useAtomValue(sharedHighlightLine);

  return (
    <Container title="Code Block" className="col-span-2">
      <CodeBlock
        text={algorithm?.code}
        language={'python'}
        theme={atomOneDark}
        showLineNumbers
        highlight={highlightLine}
      />
    </Container>
  );
};

const PickYourPoints = () => {
  // atoms
  const [paused, setPaused] = useState(false);
  const [, setDescription] = useAtom(sharedStepDescription);
  const [, setLine] = useAtom(sharedHighlightLine);
  const algorithm = useAtomValue(algorithmAtom);

  // states
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);
  const [interval, setInterval] = useState(1000);
  const [minimumMet, setMinimumMet] = useState(false);
  const [pointsCount, setPointsCount] = useState(3);
  const [duration, setDuration] = useState(0);

  const [points, setPoints] = useState<Point[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [cursorPosition, setCursorPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [algo, setAlgo] = useState<Algorithm>();

  // refs
  const svgRect = useRef<SVGSVGElement>(null);

  // reset board whenever the algorithm is updated
  useEffect(() => {
    if (algorithm) {
      reset();
      toast.success(`Selected ${algorithm.name}!`);

      if (algorithm.type === 'naive' && points.length > 50) {
        toast.warning(
          `Please be aware that the naive implementation is very slow. Points exceeding 50 may result in long loading times.`
        );
      }

      if (points.length <= 3) {
        toast.info(
          "To start the visualizer, please add 3 points to the canvas and press the 'Play' button!"
        );
      }
    }
  }, [algorithm]);

  // enforce 3 data points minimum
  useEffect(() => {
    if (points.length >= 3) {
      setMinimumMet(true);
    } else {
      setMinimumMet(false);
    }
  }, [points]);

  // update states when complete
  useEffect(() => {
    if (complete) {
      setStarted(false);
      setPaused(true);
      setComplete(false);
    }
  }, [complete]);

  // create a point
  const createPoint = (x: number, y: number) => {
    setPoints([...points, { id: points.length + 1, x, y }]);
  };

  const getSVGRect = (): DOMRect | undefined => {
    if (!svgRect.current) return;
    return svgRect.current.getBoundingClientRect();
  };

  // handler for clicking canvas
  const handlePointGeneration = (e: MouseEvent<SVGElement>) => {
    const rect = getSVGRect();
    if (started || !rect) return;
    if (edges.length !== 0) reset();

    createPoint(e.clientX - rect.left, rect.bottom - e.clientY);
  };

  // handler for pointer on canvas
  const handleCursorNavigation = (e: MouseEvent<SVGElement>) => {
    const rect = getSVGRect();
    if (!rect) return;

    const x = Math.ceil(Math.max(e.clientX - rect.left, 0));
    const y = Math.ceil(Math.max(rect.bottom - e.clientY, 0));
    setCursorPosition({ x, y });
  };

  // randomly generate a set of points
  const generateRandomPoints = () => {
    const rect = getSVGRect();
    if (!rect) return;
    if (edges.length !== 0) reset();

    const count =
      algorithm?.type === 'naive' ? Math.min(pointsCount, 50) : pointsCount;
    if (algorithm?.type === 'naive' && pointsCount > 50) {
      toast.warning(
        'Due to the time complexity of the naive implementation, we have limited the number of random points to be generated to 50.'
      );
      setPointsCount(50);
    } else {
      toast.success(`Generated ${count} random points!`);
    }

    const newPoints = [];
    const { height, width } = rect;
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);
      newPoints.push({ id: newPoints.length + 1, x, y });
    }

    setPoints(newPoints);
  };

  // update states once visualizer starts
  const start = () => {
    setStarted(true);
    setPaused(false);
    setDescription(placeHolderDecription);
    setLine('0');

    const start = Date.now();

    switch (algorithm?.type) {
      case 'graham':
        setAlgo(new GrahamScan(points));
        break;
      case 'naive':
        setAlgo(new NaiveAlgorithm(points));
        break;
      case 'jarvis':
        setAlgo(new JarvisMarch(points));
        break;
      case 'chans':
        setAlgo(new ChansAlgorithm(points));
        break;
      default:
        // setAlgo(new TestAlgorithm());
        break;
    }

    const end = Date.now();

    setDuration(end - start);
  };

  // reset visualizer states
  const reset = (resetPoints = false) => {
    if (resetPoints) setPoints([]);

    setPoints((points) => {
      return points.map((point) => {
        return { ...point, highlight: false };
      });
    });
    setDuration(0);
    setComplete(false);
    setStarted(false);
    setPaused(true);
    setDescription(placeHolderDecription);
    setLine('0');
    setEdges([]);
    setAlgo(undefined);
  };

  // handler for an algorithm step
  const handleStep = () => {
    if (!started) start();
    if (!algo) return;

    if (algo.hasNextStep()) {
      const result = algo.runNextStep();
      if (!result) return;

      updateStates(result);
    }

    setPaused(true);
  };

  // update states from algorithm step
  const updateStates = ({
    description,
    points,
    highlightPoints,
    edges,
    highlightEdges,
    highlightLines,
  }: AlgorithmStep) => {
    setDescription(description);
    setLine(highlightLines);
    setPoints(
      points.map((point) => {
        return {
          ...point,
          highlight: highlightPoints.includes(point.id),
        };
      })
    );

    setEdges(
      edges.map((edge) => {
        return {
          ...edge,
          highlight: highlightEdges.includes(edge.id),
        };
      })
    );

    setComplete(!algo?.hasNextStep());
  };

  // continous interval for running an algorithm
  useInterval(
    () => {
      if (!algo) return;

      if (!paused) {
        const result = algo.runNextStep();
        if (!result) return;

        setDescription(placeHolderDecription);
        setLine('0');
        updateStates(result);
      }
    },
    algo?.hasNextStep() ? interval : null
  );

  return (
    <Suspense>
      <Container title="Pick Your Points" className="flex-1">
        <svg
          ref={svgRect}
          className={cn(
            'flex-1 border border-primary min-h-[32rem]',
            started ? 'cursor-not-allowed' : 'cursor-pointer'
          )}
          onMouseMoveCapture={handleCursorNavigation}
          onClick={handlePointGeneration}
        >
          {points.map(({ id, x, y, highlight }) => {
            const fill = highlight ? 'orange' : 'black';
            const stroke = highlight ? 'orange' : 'black';
            const rect = getSVGRect();
            if (!rect) return;

            const fixed_y = rect.bottom - y - rect.top;
            return (
              <circle
                key={id}
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
            const rect = getSVGRect();
            if (!rect) return;

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
        <div className="font-semibold flex items-center justify-between gap-x-6">
          <div>
            Cursor Position: ({cursorPosition.x}, {cursorPosition.y})
          </div>
          <div>Points Count: {points.length}</div>
          <div>Execution Time: {duration}ms</div>
          <div>Visualizer State: {paused ? 'PAUSED' : 'PLAY'}</div>
        </div>
        <Separator />
        <div className="flex items-center justify-center gap-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled={paused} onClick={() => setPaused(true)}>
                  <PauseIcon className="h-4 w-4 fill-current" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pause Visualizer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {started ? (
                  <Button
                    disabled={!paused || complete}
                    onClick={() => setPaused(false)}
                  >
                    <ResumeIcon className="h-4 w-4 fill-current" />
                  </Button>
                ) : (
                  <Button onClick={start} disabled={!minimumMet || complete}>
                    <PlayIcon className="h-4 w-4 fill-current" />
                  </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>{started ? 'Resume Visualizer' : 'Play Visualizer'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleStep} disabled={!minimumMet || complete}>
                  <TrackNextIcon className="h-4 w-4 fill-current" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next Step</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => reset(true)}>
                  <ResetIcon className="h-4 w-4 fill-current" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset/Clear Canvas</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex flex-col gap-y-3">
            <Input
              type="number"
              min={3}
              max={1000}
              value={pointsCount}
              onChange={(e) => {
                setPointsCount(Number.parseInt(e.target.value));
              }}
              onBlur={() => {
                const value = pointsCount;

                if (value < 3) {
                  setPointsCount(3);
                } else if (value > 1000) {
                  setPointsCount(1000);
                } else {
                  setPointsCount(value);
                }
              }}
            />
            <Button
              disabled={!paused || started || (!started && complete)}
              onClick={generateRandomPoints}
            >
              Generate Random Points
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-3 mt-3">
          <Slider
            className="max-w-96"
            defaultValue={[1000]}
            min={MIN_INTERVAL}
            max={MAX_INTERVAL}
            step={50}
            onValueChange={(e) => {
              setInterval(e[0]);
            }}
          />
          <div className="font-semibold">
            Algorithm Step Duration: {interval / 1000}s
          </div>
        </div>
      </Container>
    </Suspense>
  );
};

const Description = () => {
  const step = useAtomValue(sharedStepDescription);
  const desc = () => {
    return step;
  };

  return (
    <Container title="Step Description">
      <div className="">{desc()}</div>
    </Container>
  );
};
