"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { WorkDisplayType, EducationDisplayType } from "@/types/index.type";
import { Badge } from "@/components/ui/badge";

type Props = {
  work: WorkDisplayType[];
  education: EducationDisplayType[];
};

export default function TimelineClientComponent({ work, education }: Props) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-3xl font-semibold sm:text-4xl">
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mt-2 mb-6 grid h-auto w-full grid-cols-1 gap-2 rounded-xl bg-transparent p-0 sm:mb-8 sm:grid-cols-2">
              <TabsTrigger
                value="work"
                className="flex min-h-11 items-center gap-2 border rounded-lg border-border/20 px-4 cursor-pointer data-[state=active]:shadow-accent-foreground"
              >
                Experiences
              </TabsTrigger>
              <TabsTrigger
                value="education"
                className="flex min-h-11 items-center gap-2 border rounded-lg border-border/20 px-4 cursor-pointer data-[state=active]:shadow-accent-foreground"
              >
                Education
              </TabsTrigger>
            </TabsList>

            <TabsContent value="work" className="space-y-5 sm:space-y-6">
              {work.length > 0 ? (
                work.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative border-l-2 border-primary/20 pl-5 pb-6 sm:pl-8 sm:pb-8 last:pb-0"
                  >
                    <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-4 border-background bg-primary sm:-left-2 sm:top-0 sm:h-4 sm:w-4" />

                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold capitalize sm:text-2xl">
                              {exp.title}
                            </h3>
                            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground sm:gap-x-8 sm:text-sm">
                              {exp.location && (
                                <Badge className="capitalize">
                                  {exp.location}
                                </Badge>
                              )}
                              {exp.period && (
                                <Badge className="capitalize">
                                  {exp.period}
                                </Badge>
                              )}
                              {exp.role && (
                                <Badge className="capitalize">{exp.role}</Badge>
                              )}
                            </div>
                          </div>
                          {exp.company && (
                            <p className="text-sm text-muted-foreground sm:text-base">
                              {exp.company}
                            </p>
                          )}
                        </div>
                      </div>

                      {exp.description && (
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {exp.description}
                        </p>
                      )}

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium sm:text-base">
                            Key Achievements
                          </p>
                          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {exp.achievements.map(
                              (achievement, achievementIndex) => (
                                <li
                                  key={`${exp.id}-achievement-${achievementIndex}`}
                                >
                                  {achievement}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No current work experiences
                  </h3>
                </div>
              )}
            </TabsContent>

            <TabsContent value="education" className="space-y-5 sm:space-y-6">
              {education.length > 0 ? (
                education.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative border-l-2 border-primary/20 pl-5 pb-6 sm:pl-8 sm:pb-8 last:pb-0"
                  >
                    <div className="absolute -left-[7px] top-1 h-3.5 w-3.5 rounded-full border-4 border-background bg-primary sm:-left-2 sm:top-0 sm:h-4 sm:w-4" />

                    <div className="space-y-4 sm:space-y-6">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1">
                          {exp.institution && (
                            <p className="text-base font-medium text-muted-foreground sm:text-lg">
                              {exp.institution}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground sm:gap-x-8 sm:text-sm">
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </span>
                        )}
                        {exp.period && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {exp.period}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-muted rounded-full p-4 mb-4">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No current education
                  </h3>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
