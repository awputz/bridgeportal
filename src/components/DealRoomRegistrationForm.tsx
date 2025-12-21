import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Users,
  Loader2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type RegistrationFormData, type UserType } from "@/hooks/useDealRoomRegistration";

const phoneRegex = /^[\d\s\-\(\)\+]+$/;

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().email("Please enter a valid email address").max(255),
  phone: z.string()
    .min(10, "Please enter a valid phone number")
    .max(20)
    .regex(phoneRegex, "Please enter a valid phone number"),
  companyName: z.string().min(1, "Company or organization is required").max(150),
  userType: z.enum(["principal", "broker", "attorney", "lender", "developer", "other"] as const),
  brokerageFirm: z.string().max(150).optional(),
  workingWith: z.string().max(150).optional(),
});

type FormValues = z.infer<typeof registrationSchema>;

interface DealRoomRegistrationFormProps {
  propertyAddress: string;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
  isSubmitting: boolean;
}

const userTypeOptions: { value: UserType; label: string; description: string }[] = [
  { value: "principal", label: "Principal / Owner-Investor", description: "Direct buyer or seller" },
  { value: "broker", label: "Broker / Agent", description: "Licensed real estate professional" },
  { value: "attorney", label: "Attorney", description: "Legal counsel for transaction" },
  { value: "lender", label: "Lender / Bank", description: "Financing provider" },
  { value: "developer", label: "Developer", description: "Real estate developer" },
  { value: "other", label: "Other", description: "Other professional" },
];

export const DealRoomRegistrationForm = ({
  propertyAddress,
  onSubmit,
  isSubmitting,
}: DealRoomRegistrationFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      companyName: "",
      userType: undefined,
      brokerageFirm: "",
      workingWith: "",
    },
  });

  const selectedUserType = form.watch("userType");
  const showBrokerageFirm = selectedUserType === "broker";

  const handleSubmit = async (data: FormValues) => {
    await onSubmit(data as RegistrationFormData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <User className="w-4 h-4" />
            <span>Your Information</span>
          </div>

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Smith"
                    className="bg-background/50 border-border/50 focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="(212) 555-1234"
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4 pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Professional Information</span>
          </div>

          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a... *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company / Organization *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Your company name"
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showBrokerageFirm && (
            <FormField
              control={form.control}
              name="brokerageFirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brokerage Firm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your brokerage firm"
                      className="bg-background/50 border-border/50 focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="workingWith"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Who referred you? (Optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name of referrer or broker"
                    className="bg-background/50 border-border/50 focus:border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                Access Deal Room
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By registering, you agree to maintain confidentiality of all materials contained within this deal room.
        </p>
      </form>
    </Form>
  );
};
