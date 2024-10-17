import { Post, columns } from "@/ui/components/table-columns";
import { DataTable } from "@/ui/components/data-table";

async function getData(): Promise<Post[]> {
  return [
    {
      id: "1",
      title: "From Couch Potato to a 5k",
      category: "physical",
      date: "March 14, 2022",
    },
    {
      id: "2",
      title: "How to Crochet a Dinosaur",
      category: "creative",
      date: "July 9, 2023",
    },
    {
      id: "3",
      title: "Great ways to Start Meditating",
      category: "mental",
      date: "October 27, 2021",
    },
    {
      id: "4",
      title: "Cozy Delicious Beef Stew",
      category: "food",
      date: "January 5, 2024",
    },
    {
      id: "5",
      title: "My First Week Learning Guitar",
      category: "musical",
      date: "September 18, 2022",
    },
    {
      id: "6",
      title: "30 Years of Coin Collecting",
      category: "collecting",
      date: "April 23, 2021",
    },
    {
      id: "7",
      title: "Great Games for a Saturday Night with Friends",
      category: "games+puzzles",
      date: "June 11, 2023",
    },
  ];
}

export default async function Published() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
