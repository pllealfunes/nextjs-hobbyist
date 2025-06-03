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

const SearchFormSchema = z.object({
  search: z.string().min(1, "Search is required"), // Ensures search is required
  category: z.string().optional(), // Allows category to be optional
});

// Define the type for form data
type SearchFormValues = z.infer<typeof SearchFormSchema>;

type Category = {
  id: number;
  name: string;
};

const SearchForm: React.FC<{
  categories: Category[];
  onSubmit: SubmitHandler<SearchFormValues>;
}> = ({ categories, onSubmit }) => {
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
                    required
                  >
                    <SelectTrigger className="w-full sm:w-auto" id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
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
            <Button type="reset">Reset</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SearchForm;
