"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { certificates } from "@/data/certificates";
import { Award, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function CertificatesPage() {
  return (
    <>
      <motion.div
        className="mx-auto space-y-20 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Professional Header Section */}
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold bg-clip-text">Certificates</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A collection of certifications and achievements showing expertise
            across various technologies.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {certificates.map((certificate) => (
            <div
              key={certificate.title}
              className="group bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {certificate.image ? (
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image
                    src={certificate.image}
                    alt={certificate.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 backdrop-blur-sm border-0 text-xs lg:text-sm px-2 py-1 lg:px-3 lg:py-1.5"
                    >
                      {certificate.date}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-6 lg:p-8 relative">
                  <div className="text-center">
                    <div className="p-2.5 lg:p-3 bg-primary/10 rounded-full mb-3 lg:mb-4 mx-auto w-fit">
                      <Award className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                    </div>
                    <h2 className="text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 px-2">
                      {certificate.title}
                    </h2>
                  </div>
                  <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
                    <Badge
                      variant="secondary"
                      className="bg-white dark:bg-slate-700 text-xs lg:text-sm px-2 py-1 lg:px-3 lg:py-1.5"
                    >
                      {certificate.date}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="p-4 lg:p-6">
                <div className="mb-3 lg:mb-4">
                  <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2 leading-tight">
                    {certificate.title}
                  </h3>
                  {certificate.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {certificate.description}
                    </p>
                  )}
                  {certificate.skills && certificate.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {certificate.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4 pt-3 lg:pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center text-muted-foreground">
                    <span className="text-xs lg:text-sm font-medium">
                      Issued by
                    </span>
                    <span className="mx-1.5 lg:mx-2">•</span>
                    <span className="text-xs lg:text-sm font-semibold text-primary truncate">
                      {certificate.issuer}
                    </span>
                  </div>
                  {certificate.verificationUrl ? (
                    <Link
                      href={certificate.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 lg:gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md lg:rounded-lg text-xs lg:text-sm font-medium transition-colors flex-shrink-0 w-full sm:w-auto"
                    >
                      <span>Verify Certificate</span>
                      <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4" />
                    </Link>
                  ) : (
                    <span className="text-xs lg:text-sm text-muted-foreground text-center sm:text-left">
                      Certificate on file
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
