import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";

const SearchFormSchema = z
  .object({
    search: z.string().optional(),
    category: z.string().optional(),
  })
  .refine((data) => data.search || data.category, {
    message: "Either search or category is required",
    path: ["search"],
  });

// Define the type for form data
export type SearchFormValues = z.infer<typeof SearchFormSchema>;

type Category = {
  id: number;
  name: string;
};

const SearchForm = ({
  onSubmit,
  resetResults,
}: {
  categories: Category[];
  onSubmit: SubmitHandler<SearchFormValues>;
  resetResults: () => void;
}) => {
  const form = useForm<SearchFormValues>({
    mode: "onTouched",
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
      category: "",
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          {/* Title Field */}
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel htmlFor="search" className="text-lg">
                  Search:
                </FormLabel>
                <FormControl>
                  <Input
                    className="w-full sm:w-auto border rounded-md p-2 text-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button type="submit">Search</Button>
            <Button
              type="reset"
              onClick={() => {
                form.reset();
                resetResults();
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SearchForm;
