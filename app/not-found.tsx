"use client";

import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <Card className="max-w-lg w-full border-0 shadow-none">
        <CardHeader className="flex flex-row items-center gap-2 border-b pb-2">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h1 className="text-2xl font-bold">404 Not Found</h1>
        </CardHeader>
        <CardContent className="py-4">
          <p className="text-muted-foreground">
            The page or resource you&apos;re looking for couldn&apos;t be found.
            It might have been moved, deleted, or never existed in the first
            place.
          </p>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            className="rounded-lg"
            variant="outline"
            onClick={() => history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button asChild className="rounded-lg" variant="default">
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
