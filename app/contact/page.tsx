"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";

// Form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await axios.post("/api/send", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Message sent successfully");
      form.reset();
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto py-4">
      <motion.div
        className="space-y-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold bg-clip-text">Contact</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a question or want to work together? Send me a message and
            I&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-sm p-2 sm:p-4 md:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({
                    field,
                  }: {
                    field: ControllerRenderProps<z.infer<typeof formSchema>>;
                  }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs sm:text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="subject"
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<z.infer<typeof formSchema>>;
                }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Subject
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What is this about?"
                        {...field}
                        className="h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">
                      Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your message here..."
                        className="min-h-[80px] sm:min-h-[100px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-2 sm:mt-4"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <svg
                      className="mr-2 h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </div>
  );
}
