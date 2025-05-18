import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/card";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md text-center">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl">OOPS!</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Code error: {params.error}
                </p>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <p className="text-sm text-muted-foreground">
                    An unspecified error occurred. Would you like to go home?
                  </p>
                  <Link
                    href="/"
                    className="font-bold leading-6 flex justify-center items-center mt-3"
                    aria-label="Learn more about Hobbyist"
                  >
                    <span aria-hidden="true" className="m-1">
                      <MoveLeft className="w-5 h-5 align-middle" />
                    </span>
                    Home
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
