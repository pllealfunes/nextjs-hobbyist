import { Skeleton } from "@/ui/components/skeleton";
import { ChevronLeft } from "lucide-react";

const PostSkeleton = () => {
  return (
    <main className="flex-1 py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="inline-flex items-center mb-6">
          <ChevronLeft className="h-4 w-4 mr-2 text-gray-300" />
          <Skeleton className="h-4 w-32 rounded" />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-4">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>

        <article>
          {/* Cover Image */}
          <Skeleton className="w-full h-[400px] rounded-lg mb-6" />

          <div className="p-6 md:p-8">
            {/* Author Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24 mb-2 rounded" />
                  <div className="flex items-center text-sm space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-20 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                    <Skeleton className="h-4 w-20 rounded" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Post Title */}
            <Skeleton className="h-8 w-3/4 mb-4 rounded" />

            {/* Post Content */}
            <div className="prose max-w-none space-y-3">
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} className="h-4 w-full rounded" />
              ))}
            </div>
          </div>
        </article>

        {/* Like & Comment Buttons */}
        <div className="mt-8 flex justify-end items-center">
          <div className="flex space-x-4">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>

        {/* Separator */}
        <div className="my-8">
          <Skeleton className="h-px w-full bg-gray-300" />
        </div>

        {/* Comment Form Section */}
        <div className="mt-8">
          <Skeleton className="h-6 w-40 mb-4 rounded" />
          <div className="bg-white rounded-lg shadow p-4">
            <Skeleton className="h-24 w-full mb-4 rounded-lg" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <section className="mt-12">
          <Skeleton className="h-7 w-32 mb-6 rounded" />
          <div className="space-y-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Separator */}
        <div className="my-8">
          <Skeleton className="h-px w-full bg-gray-300" />
        </div>

        {/* Related Posts Section */}
        <section>
          <Skeleton className="h-7 w-40 mb-4 rounded" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4">
                <Skeleton className="h-5 w-3/4 mb-2 rounded" />
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default PostSkeleton;
