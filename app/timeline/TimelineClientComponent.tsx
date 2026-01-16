"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { WorkDisplayType, EducationDisplayType } from "@/types/index.type";

type Props = {
  work: WorkDisplayType[];
  education: EducationDisplayType[];
};

export default function TimelineClientComponent({ work, education }: Props) {
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
              {work.length > 0 ? (
                work.map((exp, index) => (
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
                          <h3 className="text-2xl font-bold capitalize">
                            {exp.title}
                          </h3>
                          {exp.company && (
                            <p className="text-muted-foreground">
                              {exp.company}
                            </p>
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
                          {exp.period}
                        </span>
                      </div>

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
                        {exp.technologies?.map((tech) => (
                          <Badge
                            key={tech}
                            variant="outline"
                            className="text-sm"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mb-4">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No current work experiences
                  </h3>
                </div>
              )}
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              {education.length > 0 ? (
                education.map((exp, index) => (
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
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4 mb-4">
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
