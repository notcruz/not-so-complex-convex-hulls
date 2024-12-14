'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

const rate = 0.75;

export default function About() {
  return (
    <Suspense>
      <div className={'flex flex-col gap-y-9 justify-center mx-64 mt-16'}>
        <div className="flex flex-col gap-y-9 text-center">
          <h1 className="font-bold text-2xl">Not-So-Complex Convex Hulls</h1>
          <p>
            <Button asChild>
              <Link
                href={
                  'https://rit.zoom.us/rec/play/hnVZ06MS-IRJlWkMdy2mJpphX_LQFmcxCHShRGLuwhcE9Lu7kiZeB8ONW6vh5H3FJtiTpyHJXv3240ED.fVdZAjk7uSOiHqQq?canPlayFromShare=true&from=my_recording&continueMode=true&componentName=rec-play&originRequestUrl=https%3A%2F%2Frit.zoom.us%2Frec%2Fshare%2F2D1hsjJb4QORk6-qCEIFWONIOcOMfjGYGBqeuZxMgZKTK8J-M0n6ENkXvRkwipjS.h-ut-dLLIFjgzyeG'
                }
              >
                Final Presentation Recording
              </Link>
            </Button>
          </p>
          <p>
            An interactive learning tool that walks users through the Naive
            Algorithm, Graham&#39;s Scan, Jarvis March, and Chan&#39;s
            Algorithm, for generating convex hulls. It provides step-by-step
            visualizations on different point sets, helping users understand how
            each algorithm makes decisions and approaches the problem of convex
            hull construction in computational geometry.
          </p>
          <p>
            The algorithm implementations will first take in a set of points.
            Once the user starts the algorithm, by either pressing the Play or
            Step button, the algorithm with run on the provided set of points.
            The visualizer will lock, preventing any new user input to prevent
            messing with the algorithm (other than the action buttons). If too
            many points are provided, such as greater than 1,000 for the
            optimized algorithms or 50 for the naive algorithm, it is possible
            for the webapp to crash because all steps are generated for a set of
            points beforehand. For this reason, we enforce a strict upper limit
            whenever points are randomly generated. Once the algorithm finishes,
            the set of steps are iterated over, updating the step description,
            the highlighted lines, and the edges and points.
          </p>
        </div>
      </div>
    </Suspense>
  );
}
