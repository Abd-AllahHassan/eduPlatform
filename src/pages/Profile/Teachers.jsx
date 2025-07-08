import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronDown, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Teachers() {
  const teachersData = [
    {
      id: 1,
      name: "Liam Carter",
      title: "React Native Instructor",
      image: "https://randomuser.me/api/portraits/men/21.jpg",
    },
    {
      id: 2,
      name: "Ava Thompson",
      title: "Full-Stack Developer",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
      id: 3,
      name: "Ethan Brooks",
      title: "Machine Learning Engineer",
      image: "https://randomuser.me/api/portraits/men/23.jpg",
    },
    {
      id: 4,
      name: "Mia Clark",
      title: "DevOps Consultant",
      image: "https://randomuser.me/api/portraits/women/24.jpg",
    },
    {
      id: 5,
      name: "Noah Mitchell",
      title: "Cybersecurity Analyst",
      image: "https://randomuser.me/api/portraits/men/25.jpg",
    },
    {
      id: 6,
      name: "Isabella Lewis",
      title: "Product Designer",
      image: "https://randomuser.me/api/portraits/women/26.jpg",
    },
    {
      id: 7,
      name: "Mason Walker",
      title: "Cloud Solutions Architect",
      image: "https://randomuser.me/api/portraits/men/27.jpg",
    },
    {
      id: 8,
      name: "Charlotte Hall",
      title: "Data Visualization Expert",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
    },
  ];

  const [search, setSearch] = useState("");

  const filteredTeachers = teachersData.filter(
    (teacher) =>
      teacher.title.toLowerCase().includes(search.toLowerCase()) ||
      teacher.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 space-y-8 max-w-[1440px] mx-auto">
      {/* Header + Filter Section */}
      <div className="flex flex-col gap-6">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Teachers{" "}
          <span className="text-gray-500">({filteredTeachers.length})</span>
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-2/3 md:w-1/3">
            <Input
              type="text"
              placeholder="Search teacher"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 border-2 border-gray-200"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          {/* Filter + Sort Buttons */}
          <div className="flex flex-wrap gap-3 items-center">
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

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition text-center p-6 flex flex-col items-center"
          >
            <img
              src={teacher.image}
              alt={teacher.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-100"
            />
            <h3 className="text-base sm:text-lg font-semibold">
              {teacher.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{teacher.title}</p>
            <button className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md transition-all">
              Send Message
            </button>
          </div>
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
