import { Search, FileText } from "lucide-react";
export default function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full mb-6">
        <FileText className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-3xl font-semibold mb-2">No Posts Found</h3>
      <p className="max-w-md mb-6">
        We couldn&apos;t find any posts matching your search criteria. Try
        adjusting your filters or search terms.
      </p>
      <div className="flex items-center gap-2 text-sm">
        <Search className="w-4 h-4 text-rose-400" />
        <span>Try a different search</span>
      </div>
    </div>
  );
}
