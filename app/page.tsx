"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HardDriveDownload,
  Mail,
  MoveRight,
  MapPin,
  Circle,
  Code2,
  Server,
  Database,
  Globe,
  Smartphone,
  Laptop,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import profile from "@/public/me.jpg";
import { motion } from "framer-motion";
import { projects as featuredProjects } from "@/data/projects";
import { useState, useEffect } from "react";
import { BiWorld } from "react-icons/bi";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

export default function Home() {
  const [residence] = useState("Myanmar");
  const [available] = useState(true);

  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "Fullstack Developer",
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const role = roles[currentRoleIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentText.length < role.length) {
          setCurrentText(role.substring(0, currentText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentText.length > 0) {
          setCurrentText(role.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex]);

  const skills = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Frontend Development",
      description:
        "Creating responsive and interactive user interfaces using React, Next.js, and modern CSS frameworks.",
      color: "blue",
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Backend Development",
      description:
        "Building robust server-side applications with Node.js, Express, and various databases.",
      color: "green",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Database Design",
      description:
        "Designing efficient database schemas and implementing data models that scale.",
      color: "purple",
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Mobile-First Design",
      description:
        "Ensuring applications work seamlessly across all devices with responsive design.",
      color: "orange",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "API Development",
      description:
        "Creating RESTful APIs that power modern web applications and mobile apps.",
      color: "red",
    },
    {
      icon: <Laptop className="w-6 h-6" />,
      title: "Performance Optimization",
      description:
        "Optimizing applications for speed through code splitting and lazy loading.",
      color: "cyan",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-20">
      {/* Hero Section */}
      <section
        id="hero-section"
        className="min-h-[calc(100vh-8rem)] flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 max-w-2xl mx-auto text-center"
        >
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              Hey guys!
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              I&apos;m
            </h1>
            <p className="text-xl text-muted-foreground min-h-[1.75rem]">
              {currentText}
              <span className="animate-pulse">|</span>
            </p>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            Crafting scalable web applications with React, Next.js, and
            TypeScript. Transforming complex business requirements into elegant
            digital solutions.
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {residence}
            </span>
            {available && (
              <span className="flex items-center gap-1">
                <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                Available for work
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Get in Touch
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link
                href="/resume/CV.pdf"
                target="_blank"
                download={false}
                className="flex items-center gap-2"
              >
                <HardDriveDownload className="h-5 w-5" />
                Download CV
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about-section" className="space-y-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          {/* Profile Picture - Top on Mobile */}
          <div className="flex justify-center mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-32 md:w-40 md:h-40"
            >
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                <Image
                  src={profile}
                  alt="Thu Rein Htet"
                  fill
                  className="object-cover"
                  priority
                  sizes="160px"
                />
              </div>
            </motion.div>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold">About Me</h2>
          <p className="text-muted-foreground max-w-3xl text-lg mx-auto leading-relaxed">
            I&apos;m a passionate{" "}
            <b className="text-primary">fullstack web developer</b> from{" "}
            {residence}, specializing with the React ecosystem and modern web
            technologies. My journey began when I discovered the joy of turning
            creative ideas into interactive digital experiences.
          </p>
        </motion.div>

        {/* Skills Horizontal Scroll */}
        <div className="relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {[...skills, ...skills].map((skill, index) => (
              <motion.div
                key={`${skill.title}-${index}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: (index % skills.length) * 0.05,
                }}
                className="flex-shrink-0 w-40 md:w-64"
              >
                <Card className="p-3 md:p-4 h-full hover:shadow-lg transition-shadow">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center">
                    <span>{skill.icon}</span>
                  </div>
                  <h3 className="text-md md:text-lg font-semibold">
                    {skill.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {skill.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects-section" className="space-y-8">
        <div className="flex justify-between items-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Featured Projects
          </motion.h2>
          <Button variant="outline" asChild>
            <Link href="/projects" className="flex items-center gap-2">
              View All <MoveRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredProjects.slice(0, 2).map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
                <div className="relative aspect-video w-full bg-accent overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-xl mb-3">{project.title}</h3>
                  <p className="text-muted-foreground flex-1 text-md line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStacks.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-sm">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStacks.length > 4 && (
                      <Badge variant="outline" className="text-sm">
                        +{project.techStacks.length - 4} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <Button
                      variant="outline"
                      disabled={!project.isGitHub}
                      asChild={project.isGitHub}
                    >
                      {project.isGitHub ? (
                        <Link
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <FaGithub className="h-4 w-4" />
                          Code
                        </Link>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FaGithub className="h-4 w-4" />
                          Code
                        </span>
                      )}
                    </Button>

                    <Button
                      disabled={!project.isLiveDemo}
                      asChild={project.isLiveDemo}
                      variant="outline"
                    >
                      {project.isLiveDemo ? (
                        <Link
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <BiWorld className="h-4 w-4" />
                          Visit
                        </Link>
                      ) : (
                        <span className="flex items-center gap-1">
                          <BiWorld className="h-4 w-4" />
                          Visit
                        </span>
                      )}
                    </Button>

                    <ProjectDetailModal project={project}>
                      <Button variant="outline">
                        <span className="flex items-center gap-1">
                          View details <MoveRight className="h-4 w-4" />
                        </span>
                      </Button>
                    </ProjectDetailModal>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
