"use client";

import { Container, Button, Heading } from "@/Components/ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  FileText,
  Code2,
  Terminal,
  Cpu,
} from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  const router = useRouter();
  const [resumeDownloading, setResumeDownloading] = useState(false)
  const defaultResumeUrl = "/Ashok_Bhaargaw_Resume.pdf";
  const [resumeUrl, setResumeUrl] = useState(defaultResumeUrl);

  useEffect(() => {
    const active = localStorage.getItem("active_resume_url");
    if (active) {
      setResumeUrl(active);
    }
  }, []);

  // Add this function above the return
  const handleDownload = async () => {
    if (!resumeUrl) return;
    try {
      setResumeDownloading(true)
      const response = await fetch(resumeUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "Ashok_Bhaargaw_Resume.pdf";
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback: just open the PDF (user can save manually)
      window.open(resumeUrl, "_blank");
    } finally {
      setResumeDownloading(false)
    }
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com/AshokBhaargaw", label: "GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/ashokbhaargaw",
      label: "LinkedIn",
    },
    { icon: Mail, href: "mailto:ashokbhaargaw@gmail.com", label: "Email" }, // Placeholder, can be updated by user
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10" />
      <Container>
        <section className="flex flex-col-reverse mt-10 md:mt-0 md:flex-row items-center justify-center md:justify-between gap-12 pt-20">
          {/* Left Content */}
          <div className="w-full md:w-1/2 text-center md:text-left z-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border-soft mb-6 w-fit mx-auto md:mx-0">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-subtle-foreground">
                Available for work
              </span>
            </div>

            <h6 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight mb-1">
              Hello, I&apos;m <br />
            </h6>
            <Heading
              as="h1"
              className="md:text-left text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight "
            >
              Ashok Bhaargaw
            </Heading>

            <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 mb-8">
              <span className="text-foreground font-semibold">
                Full Stack Developer {" "}
              </span>
              focused on building scalable and{" "}
              <span className="text-foreground font-semibold">
                high-performance
              </span>{" "}
              web applications using{" "}
              <span className="text-foreground font-semibold">Next.js</span> on
              the frontend and{" "}
              <span className="text-foreground font-semibold">NestJS</span> on
              the backend, with experience in{" "}
              <span className="text-foreground font-semibold">MongoDB</span> and{" "}
              <span className="text-foreground font-semibold">PostgreSQL</span>,
              and a strong focus on{" "}
              <span className="text-foreground font-semibold">
                clean architecture
              </span>
              ,{" "}
              <span className="text-foreground font-semibold">
                API design
              </span>
              , and{" "}
              <span className="text-foreground font-semibold">
                end-to-end development
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start mb-10">
              <Button
                className="w-full sm:w-auto min-w-35 shadow-lg shadow-primary/25"
                onClick={() => router.push("/#contact")}
              >
                Contact Me
              </Button>

              <Button
                variant="secondary"
                className="w-full sm:w-auto min-w-35 flex items-center justify-center gap-2"
                onClick={handleDownload}
                disabled={!resumeUrl}
              >
                <FileText size={18} />
                <span>{resumeDownloading ? "Downloading..." : "Resume"}</span>
              </Button>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-subtle-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Content - Visual Profile Card */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end z-10">
            <div className="relative w-full max-w-md aspect-square md:aspect-auto md:h-125 flex items-center justify-center">
              {/* Decorative Floating Elements */}
              <div
                className="absolute top-10 left-0 p-3 bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-xl animate-float"
                style={{ animationDelay: "0s" }}
              >
                <Code2 className="text-primary" size={28} />
              </div>
              <div
                className="absolute bottom-20 right-0 p-3 bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-xl animate-float"
                style={{ animationDelay: "2s" }}
              >
                <Terminal className="text-secondary" size={28} />
              </div>
              <div
                className="absolute top-1/2 -right-5 p-3 bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-xl animate-float"
                style={{ animationDelay: "1s" }}
              >
                <Cpu className="text-success" size={28} />
              </div>

              {/* Main Profile Card Placeholder */}
              <div className="relative w-72 min-h-80 sm:w-80 sm:h-96 rounded-2xl bg-linear-to-b from-border-soft to-card border border-border flex flex-col items-center justify-center p-3 py-6 md:p-6 text-center shadow-2xl card-glow transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-32 h-32 rounded-full bg-linear-to-tr from-primary to-secondary mb-4 p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    {/* Placeholder for Image */}
                    <div className="relative w-32 h-32">
                      <Image
                        src="/ashok.jpg"
                        alt="Ashok Bhaargaw"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Full Stack Developer
                </p>
                <h1 className="text-2xl my-1 font-bold text-foreground">
                  Ashok Bhaargaw
                </h1>
                <div className="flex gap-1 md:gap-2 mt-2 flex-wrap justify-center">
                  {[
                    ["MongoDB", "text-teal-400"],
                    ["Next.js", "text-red-400"],
                    ["React Native", "text-blue-400"],
                    ["React", "text-green-400"],
                    ["Typescript", "text-indigo-400"],
                    ["Javascript", "text-pink-400"],
                    ["Tailwind", "text-lime-400"],
                    ["HTML & CSS", "text-amber-400"],
                  ].map((skill) => (
                    <span
                      key={skill[0]}
                      className={`px-3 py-1 text-xs rounded-full bg-surface border border-border-soft  ${skill[1]}`}
                    >
                      {skill[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
