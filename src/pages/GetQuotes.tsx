import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle, Shield, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notifyQuoteSubmitted } from "@/lib/emailService";
import { mapServiceToQuoteProject, QUOTE_PROJECT_TYPES } from "@/data/services";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(20),
  postcode: z.string().trim().min(5, "Please enter a valid postcode").max(10),
  projectType: z.string().min(1, "Please select a project type"),
  description: z.string().trim().min(20, "Please describe your project in at least 20 characters").max(2000, "Description must be less than 2000 characters"),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to continue" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const projectTypes = [...QUOTE_PROJECT_TYPES];

export default function GetQuotes() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      postcode: "",
      projectType: "",
      description: "",
      termsAccepted: false,
    },
  });

  useEffect(() => {
    const projectParam = searchParams.get("projects");
    if (projectParam) {
      form.setValue("projectType", mapServiceToQuoteProject(projectParam));
    }
  }, [searchParams, form]);

  useEffect(() => {
    if (submitted) {
      window.scrollTo(0, 0);
    }
  }, [submitted]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { data: enquiryId, error } = await supabase.rpc("submit_enquiry", {
        p_name: data.name,
        p_email: data.email,
        p_phone: data.phone,
        p_postcode: data.postcode,
        p_project_type: data.projectType,
        p_description: data.description,
      });

      if (error || !enquiryId) {
        console.error("Error submitting enquiry:", error);
        toast.error("Something went wrong. Please try again.");
        return;
      }

      try {
        await notifyQuoteSubmitted({
          enquiryId: String(enquiryId),
          name: data.name,
          email: data.email,
          phone: data.phone,
          projectType: data.projectType,
          postcode: data.postcode,
          description: data.description,
        });
      } catch (emailErr) {
        console.error("Email failed, rolling back enquiry:", emailErr);
        await supabase.from("enquiries").delete().eq("id", enquiryId);
        toast.error("We couldn't submit your quote request. Please try again.");
        return;
      }

      supabase.functions.invoke("notify-contractors", {
        body: { enquiry_id: enquiryId },
      }).catch((err) => {
        console.error("Error notifying contractors:", err);
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
              You're All Set!
            </h1>
            <p className="text-muted-foreground text-lg mb-3">
              We've received your project details. Our vetted tradespeople will review your job and you'll receive up to 3 competitive quotes within 24 hours.
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Check your email for a confirmation. Remember — any agreement for work is made directly between you and the Service Provider.
            </p>
            <Link to="/">
              <Button variant="hero" size="lg" className="px-8 py-6 text-base text-white font-semibold">
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-24 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
            {/* Left column — form */}
            <div className="lg:col-span-3">
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                <span style={{ color: "#254472" }}>Start Your </span>
                <span style={{ color: "#1A8D93" }}>Project</span>
                <span style={{ color: "#254472" }}> the Smart Way</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Share your project details and we'll connect you with a vetted multi-trade expert ready to give you a free quote.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="07xxx xxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postcode</FormLabel>
                          <FormControl>
                            <Input placeholder="SW1A 1AA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Project</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projectTypes.filter(t => t !== "Other").map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other" className="text-muted-foreground text-xs italic">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe Your Project</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us what you need done — the more detail, the better your quotes will be..."
                            className="min-h-[120px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border bg-card p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal text-muted-foreground cursor-pointer">
                            Completemyproject.co.uk is here to help you find and connect with muti-trade companies. We take great care in vetting the professionals we introduce, but the work is completed by the muti-trade companies themselves, who are responsible for their own services.{" "}
                            <Link to="/terms" className="text-accent underline underline-offset-2 hover:text-accent/80 font-medium">
                              Read full Terms & Conditions
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full text-base font-semibold py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Get My Free Quotes"}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Right column — trust signals */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-brand">
                  <h3 className="font-display text-lg font-bold text-foreground mb-5">Why completemyproject.co.uk?</h3>
                  <div className="space-y-5">
                    {[
                      { icon: Shield, title: "Gold Standard Vetting", desc: "Every firm passes our 6-point check including DBS & references." },
                      { icon: Users, title: "Up to 3 Quotes", desc: "Compare competitive offers side by side — no obligation." },
                      { icon: Clock, title: "Quotes Within 24hrs", desc: "Fast turnaround so your project gets started sooner." },
                      { icon: CheckCircle, title: "100% Free", desc: "No fees, no hidden costs, no account required to start." },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center shrink-0">
                          <item.icon className="w-4.5 h-4.5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                          <p className="text-muted-foreground text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
