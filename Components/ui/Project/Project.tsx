"use client";

import {
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  Github,
  Layers,
} from "lucide-react";
import Image from "next/image";
import Button from "../Buttons/Button";
import type { Project } from "@/redux/types/project";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface ProjectProps {
  project: Project;
  currentProject: number;
  totalProjects: number;
  onNext?: () => void;
  onPrev?: () => void;
  leftRight?: number;
  showMobileNav?: boolean;
}

export default function Project({
  project,
  currentProject,
  totalProjects,
  onNext,
  onPrev,
  leftRight,
  showMobileNav = true,
}: ProjectProps) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  return (
    <div
      className={`flex flex-col items-center my-20 gap-12 md:gap-20 ${leftRight ? (leftRight % 2 ? "lg:flex-row-reverse" : "lg:flex-row") : "lg:flex-row"}`}
    >
      {/* Left: Laptop Preview */}
      <div className="w-full lg:max-w-1/2 flex justify-center">
        <div className="relative w-full max-w-200 group">
          <Image
            src="/laptop.png"
            alt="Laptop frame"
            width={1600}
            height={1000}
            className="w-full h-auto drop-shadow-2xl relative z-20 pointer-events-none"
            priority
          />

          <div className="absolute z-10 top-[5%] left-[10%] w-[80%] h-[82%] rounded overflow-hidden bg-black">
            <div className="h-full overflow-y-auto scrollbar-hide">
              <a href={project.liveUrl} target="_blank">
                <Image
                  src={project.image || "/PortfolioImage/image.png"}
                  alt={`${project.title} preview`}
                  width={1200}
                  height={1400}
                  className="w-full h-auto object-cover"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Details */}
      <div className="w-full lg:max-w-1/2 flex flex-col gap-6">
        <h3 className="text-3xl md:text-4xl font-bold">{project.title}</h3>

        <div className="flex">
          <p
            className={`text-muted-foreground text-base sm:text-lg ${
              !showFullDesc && "md:line-clamp-3 line-clamp-4"
            } `}
          >
            {project.description}
          </p>
          {showFullDesc ? (
            <ChevronUp
              onClick={() => setShowFullDesc(false)}
              className="place-self-end h-full mb-3 cursor-pointer"
              size={80}
            />
          ) : (
            <ChevronDown
              onClick={() => setShowFullDesc(true)}
              className="place-self-end h-full mb-3 cursor-pointer"
              size={80}
            />
          )}
        </div>

        {/* Tech Stack */}
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-sm uppercase">
            <Layers size={16} /> Tech Stack
          </div>

          <div className="w-full max-w-[80vw] overflow-hidden mt-2">
            <Swiper
              spaceBetween={4.5}
              slidesPerView="auto"
              className="overflow-visible!"
            >
              {project.techStack.map((tech) => (
                <SwiperSlide key={tech} className="w-auto!">
                  <span className="px-2 py-0.5 text-sm rounded-full bg-surface border whitespace-nowrap cursor-grab">
                    {tech}
                  </span>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Features */}
        <div>
          <div className="flex items-center gap-2 text-secondary font-semibold text-sm uppercase">
            <CheckCircle2 size={16} /> Key Features
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {project.keyFeatures.map((feature) => (
              <li key={feature} className="text-sm text-muted-foreground">
                • {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex gap-4 pt-4">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button className="px-4! md:px-auto! gap-1 md:gap-2">
                Live Demo <ExternalLink size={16} />
              </Button>
            </a>
          )}

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                className="px-4! md:px-auto! gap-1 md:gap-1"
              >
                <Github size={18} /> Source Code
              </Button>
            </a>
          )}
        </div>

        {/* Mobile Navigation */}
        {showMobileNav && (
          <div className="flex sm:hidden justify-center items-center gap-4 pt-6">
            <button onClick={onPrev} disabled={!onPrev}>
              <ChevronLeft size={28} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalProjects }).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentProject
                      ? "w-6 bg-primary"
                      : "w-2 bg-gray-600"
                  }`}
                />
              ))}
            </div>

            <button onClick={onNext} disabled={!onNext}>
              <ChevronRight size={28} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
