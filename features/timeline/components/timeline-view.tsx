"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EducationDisplayType, WorkDisplayType } from "@/types/index.type";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

type Props = {
  work: WorkDisplayType[];
  education: EducationDisplayType[];
};

export default function TimelineClientComponent({ work, education }: Props) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className="border-0 shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="section-heading">Timeline</CardTitle>
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

            <TabsContent value="work" className="space-y-0">
              {work.length > 0 ? (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-muted-foreground/20 sm:left-2" />

                  {work.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative pl-8 pb-8 last:pb-0"
                    >
                      {/* Dot */}
                      <div className="absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full border-2 border-muted-foreground/40 bg-background" />

                      <div className="space-y-3">
                        {/* Company header */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-foreground sm:text-lg">
                            {exp.companyName}
                          </h3>
                        </div>

                        {exp.companyWebsite && (
                          <a
                            href={exp.companyWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            {exp.companyWebsite}
                          </a>
                        )}

                        {/* Positions */}
                        {exp.positions && exp.positions.length > 0 && (
                          <div className="space-y-4">
                            {exp.positions.map((pos) => (
                              <div key={pos.id} className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-sm font-medium text-foreground">
                                    {pos.title}
                                  </h4>
                                  {pos.employmentType && (
                                    <span className="text-[10px] text-muted-foreground">
                                      {pos.employmentType}
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground">
                                  {pos.employmentPeriod?.start}
                                  {pos.employmentPeriod?.end
                                    ? ` — ${pos.employmentPeriod.end}`
                                    : " — Present"}
                                </p>

                                {pos.description && (
                                  <p className="text-xs leading-relaxed text-muted-foreground/80">
                                    {pos.description}
                                  </p>
                                )}

                                {pos.skills && pos.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {pos.skills.map((skill, i) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="text-[10px] px-1.5 py-0"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
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

            <TabsContent value="education" className="space-y-0">
              {education.length > 0 ? (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-muted-foreground/20 sm:left-2" />

                  {education.map((exp, index) => (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="relative pl-8 pb-8 last:pb-0"
                    >
                      {/* Dot */}
                      <div className="absolute left-0 top-1.5 h-[10px] w-[10px] rounded-full border-2 border-muted-foreground/40 bg-background" />

                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-foreground sm:text-lg">
                          {exp.institution}
                        </h3>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {exp.location}
                            </span>
                          )}
                          {exp.period && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {exp.period}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
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
