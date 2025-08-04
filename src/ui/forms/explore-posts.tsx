import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/ui/components/button";
import { Input } from "@/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/components/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/form";
import { useCategoriesQuery } from "@/hooks/categoriesQuery";

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

export default function SearchForm({
  onSubmit,
  resetResults,
}: {
  onSubmit: SubmitHandler<SearchFormValues>;
  resetResults: () => void;
}) {
  const { data: categories } = useCategoriesQuery();

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
          {/* Category Field */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormLabel htmlFor="category" className="text-lg">
                  Category:
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full sm:w-auto" id="category">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">Select a Category</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
}
