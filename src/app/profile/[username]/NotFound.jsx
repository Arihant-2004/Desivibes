import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeIcon, ArrowLeftIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="py-10 px-6 sm:px-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* ILLUSTRATION */}
            <img
              src="https://illustrations.popsy.co/gray/web-error.svg"
              alt="Not Found Illustration"
              className="w-40 h-40"
            />

            {/* 404 HEADING */}
            <p className="text-7xl font-extrabold text-primary font-mono">404</p>

            {/* MESSAGE */}
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">User not found</h1>
              <p className="text-muted-foreground">
                The page or user you're looking for doesn't seem to exist.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="default" asChild>
                <Link href="/">
                  <HomeIcon className="mr-2 size-4" />
                  Go to Home
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeftIcon className="mr-2 size-4" />
                  Try Again
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
