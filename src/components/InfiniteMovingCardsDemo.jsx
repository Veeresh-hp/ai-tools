"use client";

import React from "react";
import { InfiniteMovingCards } from "./ui/InfiniteMovingCards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[20rem] rounded-md flex flex-col antialiased dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden mb-16">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "AI Tools Hub has completely transformed how I find new tools. The curation is top-notch and saves me hours of research every week!",
    name: "Alex Rivera",
    title: "Software Engineer",
  },
  {
    quote:
      "I check this site daily for the 'Tool of the Day'. It's become my go-to resource for staying ahead in the rapidly evolving AI landscape.",
    name: "Sarah Chen",
    title: "Product Manager",
  },
  {
    quote:
      "The dark mode design is stunning. Finally, a directory that looks as modern and premium as the tools it features. A visual treat!",
    name: "Jordan Knight",
    title: "UI/UX Designer",
  },
  {
    quote:
      "Found my favorite faceless video editor here. The categorization and filters make it incredibly easy to find exactly what I need.",
    name: "Mike Thompson",
    title: "Content Creator",
  },
  {
    quote:
      "An incredible resource for anyone in the generative AI space. Highly recommended for finding those hidden gems before they go mainstream.",
    name: "Emily Wong",
    title: "Data Scientist",
  },
];

export default InfiniteMovingCardsDemo;
