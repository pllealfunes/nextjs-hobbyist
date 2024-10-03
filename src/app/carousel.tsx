// CarouselPlugin.tsx
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Define interfaces for user and card
interface User {
  name: string;
  image: string;
}

interface Card {
  id: number; // or string if your IDs are strings
  title: string;
  date: string;
  backgroundImage: string;
  user: User;
}

// Accept cards as a prop with a specific type
interface CarouselPluginProps {
  cards: Card[];
}

export function CarouselPlugin({ cards }: CarouselPluginProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-4xl mx-auto"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {/* Map over the cards prop and display them */}
        {cards.map((card) => (
          <CarouselItem key={card.id}>
            <div>
              <div
                className="relative w-full h-[500px] bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${card.backgroundImage})` }}
              >
                <div className="flex flex-col justify-end p-6 h-full bg-black bg-opacity-50 rounded-lg">
                  <h2 className="text-white font-bold text-2xl">
                    {card.title}
                  </h2>
                  <p className="text-white mt-2">{card.date}</p>
                  <div className="flex items-center mt-2">
                    <Image
                      src={card.user.image}
                      alt={card.user.name}
                      height={24}
                      width={24}
                      className="w-10 h-10 rounded-full mr-2"
                    />
                    <span className="text-white">{card.user.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
