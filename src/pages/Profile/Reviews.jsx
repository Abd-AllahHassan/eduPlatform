import React from "react";
import { MoreHorizontal, Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const reviews = [
  {
    id: 1,
    course: "Advanced JavaScript Concepts",
    rating: 5,
    review:
      "Hands down the best JS course I've taken. The instructor explained closures, prototypes, and async/await with perfect clarity. Highly recommend for intermediate devs.",
  },
  {
    id: 2,
    course: "React Performance Optimization",
    rating: 4,
    review:
      "Great insights into React internals and profiling techniques. I especially liked the sections on memoization and React DevTools. A bit fast-paced at times.",
  },
  {
    id: 3,
    course: "Docker & Kubernetes Bootcamp",
    rating: 5,
    review:
      "This bootcamp demystified DevOps for me. The labs were challenging but rewarding, and I feel confident deploying containerized apps now.",
  },
  {
    id: 4,
    course: "Building REST APIs with Node.js",
    rating: 4,
    review:
      "Solid backend fundamentals covered. I appreciated the security practices and middleware deep dives. More real-world examples would've been nice.",
  },
  {
    id: 5,
    course: "Git & GitHub Essentials",
    rating: 3,
    review:
      "Basic but effective. Good for absolute beginners. Would've liked more interactive exercises and team workflow simulations.",
  },
];

export default function ReviewsSection() {
  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">
        Reviews <span className="text-gray-500">(5)</span>
      </h2>

      <div className="space-y-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative"
          >
            <div className="absolute top-4 right-4 text-gray-400 cursor-pointer">
              <MoreHorizontal className="w-5 h-5" />
            </div>

            <p className="text-sm font-medium text-gray-600">
              Course Name:{" "}
              <span className="text-black font-semibold">{r.course}</span>
            </p>

            <div className="flex items-center gap-1 my-2">
              <span className="text-sm font-medium text-gray-600">Rating:</span>
              <div className="flex gap-0.5">
                {[...Array(r.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{r.review}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-5">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
