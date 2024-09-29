export default function Home() {
  return (
    <div className={"flex min-h-screen mx-64 items-center justify-center font-[family-name:var(--font-geist-sans)]"}>
      <div className={"flex flex-col text-center gap-y-6"}>
        <div>
          <h1 className={"text-xl font-bold"}>
            Not So Complex Convex Hulls
          </h1>
          <h2>
            Jonathan Cruz & Lucas Romero
          </h2>
        </div>
        <p>
          An interactive learning tool that walks users through the Naive Algorithm, Jarvis March, and Chan&#39;s
          Algorithm for generating convex hulls. It provides step-by-step visualizations on different point sets,
          helping users understand how each algorithm makes decisions and approaches the problem of convex hull
          construction in computational geometry.
        </p>
      </div>
    </div>
  );
}
