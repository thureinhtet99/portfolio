"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { experiences } from "@/data/experiences";
import { skills } from "@/data/skills";
import {
  Laptop,
  Calendar,
  MapPin,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { education } from "@/data/education";

export default function Timelines() {
  // Pagination state for skills
  const [currentSkillsPage, setCurrentSkillsPage] = useState(1);
  const skillsPerPage = 15;

  // Pagination logic for skills
  const totalSkillsPages = Math.ceil(skills.length / skillsPerPage);
  const startIndex = (currentSkillsPage - 1) * skillsPerPage;
  const endIndex = startIndex + skillsPerPage;
  const currentSkills = skills.slice(startIndex, endIndex);

  const goToPreviousSkillsPage = () => {
    setCurrentSkillsPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextSkillsPage = () => {
    setCurrentSkillsPage((prev) => Math.min(prev + 1, totalSkillsPages));
  };

  return (
    <div>
      {/* Experience and Education with Tabs */}
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-4xl">
            <Calendar className="w-8 h-8" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="work" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Work Experience
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                Education
              </TabsTrigger>
            </TabsList>

            <TabsContent value="work" className="space-y-6">
              {experiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative pl-8 pb-8 border-l-2 border-primary/20 last:pb-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">{exp.title}</h3>
                        {exp.company && (
                          <p className="text-muted-foreground">{exp.company}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-md">
                        {exp.type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-10 text-sm text-muted-foreground">
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.duration}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {exp.description}
                    </p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold text-lg">
                          Key Achievements:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-lg text-muted-foreground">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Skills Section */}
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-4xl">
                    <Laptop className="w-8 h-8" />
                    Technical Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Skills Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                      {currentSkills.map((skill) => (
                        <div
                          key={`${skill.name}-${currentSkillsPage}`}
                          className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card"
                        >
                          <div className="text-3xl flex-shrink-0">
                            {skill.icon}
                          </div>
                          <div className="text-center w-full">
                            <p className="font-medium text-sm leading-tight break-words hyphens-auto">
                              {skill.name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center pt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousSkillsPage}
                          disabled={currentSkillsPage === 1}
                          className="flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextSkillsPage}
                          disabled={currentSkillsPage === totalSkillsPages}
                          className="flex items-center gap-1"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              {education.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative pl-8 pb-8 border-l-2 border-primary/20 last:pb-0"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold">{exp.degree}</h3>
                        {exp.institution && (
                          <p className="text-muted-foreground">
                            {exp.institution}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-10 text-sm text-muted-foreground">
                      {exp.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.duration}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {exp.description}
                    </p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-semibold text-lg">
                          Key Achievements:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-lg text-muted-foreground">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
