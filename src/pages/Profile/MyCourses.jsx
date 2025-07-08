import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronDown, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/context/AuthContext"; // ✅ import context

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth(); // ✅ get token from context
  const token = auth.token;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://edu-master-delta.vercel.app/lesson/my/purchased",
          { headers: { token } }
        );
        setCourses(response.data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCourses();
    }
  }, [token]);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="space-y-4 w-full max-w-2xl">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 space-y-6">
      {/* Navigation Bar */}
      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-semibold">
          Courses{" "}
          <span className="text-gray-500">({filteredCourses.length})</span>
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center w-full">
          {/* Search */}
          <div className="relative w-full sm:w-1/2 md:w-1/3">
            <Input
              type="text"
              placeholder="Search Course"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-8 border-2 border-gray-200 w-full"
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Sort/Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">Sort By</span>
            <Button variant="outline" className="flex items-center gap-1">
              Relevance <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course._id} className="p-4 flex flex-col gap-4">
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <CardContent className="p-0 flex flex-col gap-3">
              {/* Embedded YouTube Video */}
              <div className="aspect-video w-full">
                <iframe
                  className="rounded-md w-full h-full"
                  src={course.video.replace("watch?v=", "embed/")}
                  title={course.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <p className="text-sm text-gray-500">{course.description}</p>

              <p className="text-sm text-gray-500">
                Scheduled Date:{" "}
                {new Date(course.scheduledDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
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
