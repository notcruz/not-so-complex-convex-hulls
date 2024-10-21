"use client";

import { algorithms } from "@/lib/config";
import { algorithmAtom } from "@/state";
import { useAtom } from "jotai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const [algorithm, setAlgorithm] = useAtom(algorithmAtom);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onVisualizer = pathname === "/visualizer";

  useEffect(() => {
    if (onVisualizer) {
      const type = searchParams.get("type");
      const result = algorithms.find((algorithm) => algorithm.type === type);

      // if no type is specified or the specified type is not supported
      if (!type || !result) {
        // default to naive
        const params = new URLSearchParams(searchParams.toString());
        params.set("type", "naive");
        router.push(pathname + "?" + params.toString());
      } else {
        // update algorithm atom
        setAlgorithm(result);
      }
    }
  }, [onVisualizer, searchParams, router, pathname, setAlgorithm]);

  const onValueChange = (value: string) => {
    const result = algorithms.find((algorithm) => algorithm.type === value);

    // is the specified algorithm type is valid
    if (result) {
      // update params
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", result.type);
      router.push(pathname + "?" + params.toString());

      // update algorithm atom
      setAlgorithm(result);
    }
  };

  return (
    <nav className={"flex items-center justify-between mx-64 my-8"}>
      <Button asChild variant={"link"}>
        <a href={"/"}>Home</a>
      </Button>
      {!onVisualizer && (
        <Button asChild>
          <a href={"/visualizer"}>Visualizer</a>
        </Button>
      )}
      {onVisualizer && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-48" variant={"outline"}>
              Picker
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Algorithms</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={algorithm?.type}
              onValueChange={onValueChange}
            >
              {algorithms.map(({ type, name }) => {
                return (
                  <DropdownMenuRadioItem key={type} value={type}>
                    {name}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default Navbar;
