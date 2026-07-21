"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Award, Clock, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
};

type Props = {
  certificates: Certificate[];
};

export default function CertificatesClientComponent({ certificates }: Props) {
  return (
    <div>
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-4xl">
            Certificates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {certificates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {certificates.map((certificate) => (
                <div
                  key={certificate.title}
                  className="group bg-card/95 border border-border/10 rounded-lg lg:rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {certificate.image ? (
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image
                        src={certificate.image}
                        alt={certificate.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
                        <Badge
                          variant="secondary"
                          className="bg-background/90 text-foreground backdrop-blur-sm border border-border/20 text-xs lg:text-sm px-2 py-1 lg:px-3 lg:py-1.5"
                        >
                          {formatDate(certificate.issueDate)}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-6 lg:p-8 relative">
                      <div className="text-center">
                        <div className="p-2.5 lg:p-3 bg-primary/10 rounded-full mb-3 lg:mb-4 mx-auto w-fit">
                          <Award className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                        </div>
                        <h2 className="text-lg lg:text-xl font-semibold text-foreground line-clamp-2 px-2">
                          {certificate.title}
                        </h2>
                      </div>
                      <div className="absolute top-3 right-3 lg:top-4 lg:right-4">
                        <Badge
                          variant="secondary"
                          className="text-xs lg:text-sm px-2 py-1 lg:px-3 lg:py-1.5"
                        >
                          {formatDate(certificate.issueDate)}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <div className="p-4 lg:p-6">
                    <div className="mb-3 lg:mb-4">
                      <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 line-clamp-2 leading-tight">
                        {certificate.title}
                      </h3>
                      {certificate.credentialId && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-1"
                          >
                            ID: {certificate.credentialId}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4 pt-3 lg:pt-4 border-t border-border/10">
                      <div className="flex items-center text-muted-foreground">
                        <span className="text-xs lg:text-sm font-medium">
                          Issued by
                        </span>
                        <span className="mx-1.5 lg:mx-2">•</span>
                        <span className="text-xs lg:text-sm font-semibold text-primary truncate">
                          {certificate.issuer}
                        </span>
                      </div>
                      {certificate.credentialUrl ? (
                        <Link
                          href={certificate.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 lg:gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md lg:rounded-lg text-xs lg:text-sm font-medium transition-colors flex-shrink-0 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:rounded-sm"
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
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted rounded-full p-4 mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No current certificates
              </h3>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
