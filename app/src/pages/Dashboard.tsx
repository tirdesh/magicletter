import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Briefcase, FileText, Rocket, Zap } from "lucide-react";
import React from "react";
import { IconType } from "react-icons";
import {
  SiAnthropic,
  SiAxios,
  SiCheerio,
  SiFirebase,
  SiFramer,
  SiOpenai,
  SiPerplexity,
  SiRadixui,
  SiReact,
  SiReacthookform,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";

interface Tech {
  icon: IconType;
  name: string;
  description: string;
}

interface TechStack {
  category: string;
  techs: Tech[];
}

const Dashboard: React.FC = () => {
  const features = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "AI-Powered Resume Parsing",
      description: "Automatically extract key information from resumes",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Intelligent Cover Letter Generation",
      description:
        "Create tailored cover letters based on job descriptions and resumes",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Resume Management",
      description: "Organize and manage multiple resumes effortlessly",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Job Description Analysis",
      description: "Analyze job postings to highlight key requirements",
    },
  ];

  const techStacks: TechStack[] = [
    {
      category: "Frontend Core Technologies",
      techs: [
        {
          icon: SiReact,
          name: "React",
          description: "Building responsive and interactive user interfaces",
        },
        {
          icon: SiTypescript,
          name: "TypeScript",
          description: "Ensuring type safety and improving code quality",
        },
        {
          icon: SiVite,
          name: "Vite",
          description: "Fast build tool for improved development experience",
        },
      ],
    },
    {
      category: "State Management",
      techs: [
        {
          icon: SiRedux,
          name: "React Redux & Toolkit",
          description: "Official React bindings for Redux",
        },
      ],
    },
    {
      category: "UI & Styling",
      techs: [
        {
          icon: SiRadixui,
          name: "Radix UI",
          description: "Accessible and customizable UI components",
        },
        {
          icon: SiFramer,
          name: "Framer Motion",
          description: "Animation library for React",
        },
        {
          icon: SiTailwindcss,
          name: "Tailwind CSS",
          description: "Utility-first CSS framework",
        },
        {
          icon: SiRadixui,
          name: "shadcn/ui",
          description:
            "Re-usable components built with Radix UI and Tailwind CSS",
        },
      ],
    },
    {
      category: "Form Handling",
      techs: [
        {
          icon: SiReacthookform,
          name: "React Hook Form",
          description: "Performant, flexible and extensible forms",
        },
        {
          icon: SiPerplexity,
          name: "Yup",
          description: "Schema builder for value parsing and validation",
        },
      ],
    },
    {
      category: "Backend & Deployment",
      techs: [
        {
          icon: SiFirebase,
          name: "Firebase",
          description:
            "Backend-as-a-Service for authentication and data storage",
        },
        {
          icon: SiVercel,
          name: "Vercel (Serverless)",
          description: "Serverless deployment platform",
        },
      ],
    },
    {
      category: "Utilities & Libraries",
      techs: [
        {
          icon: SiAxios,
          name: "Axios",
          description: "Promise-based HTTP client for API requests",
        },
        {
          icon: SiCheerio,
          name: "Cheerio",
          description: "Fast, flexible & lean implementation of core jQuery",
        },
        {
          icon: SiCheerio,
          name: "Compromise",
          description: "Natural language processing library",
        },
      ],
    },
    {
      category: "AI Integrations",
      techs: [
        {
          icon: SiOpenai,
          name: "OpenAI",
          description:
            "Powerful AI models for natural language processing and generation",
        },
        {
          icon: SiAnthropic,
          name: "Claude (Anthropic)",
          description: "Advanced AI assistant for various language tasks",
        },
        {
          icon: SiOpenai,
          name: "Cohere",
          description:
            "AI platform for natural language understanding and generation",
        },
        {
          icon: SiPerplexity,
          name: "Perplexity",
          description: "AI-powered search and discovery platform",
        },
      ],
    },
  ];

  return (
    <div className="flex-grow flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full flex flex-col"
        >
          <Card className="w-full max-w-4xl mx-auto shadow-md flex flex-col flex-grow">
            <CardHeader className="bg-primary/10 dark:bg-primary/20">
              <CardTitle className="text-3xl font-bold text-primary">
                Welcome to MagicLetter
              </CardTitle>
              <CardDescription>
                Your AI-powered resume and cover letter assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col flex-grow overflow-hidden">
              <ScrollArea className="flex-grow pr-4 overflow-y-auto">
                <div className="space-y-8 pb-8">
                  {/* About section */}
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">
                      About MagicLetter
                    </h2>
                    <p className="text-muted-foreground">
                      MagicLetter is an innovative AI-powered application
                      designed to streamline your job application process. By
                      leveraging cutting-edge technologies, we help you create
                      compelling resumes and cover letters tailored to your
                      target jobs, increasing your chances of landing your dream
                      position.
                    </p>
                  </section>

                  {/* Key Features section */}
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">
                      Key Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              {feature.icon}
                              <span className="ml-2">{feature.title}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{feature.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>

                  {/* Technology Stack section */}
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">
                      Technology Stack
                    </h2>
                    <Card>
                      <CardContent className="p-0">
                        <Tabs
                          defaultValue={techStacks[0].category}
                          className="flex"
                        >
                          <TabsList className="flex flex-col w-1/3 h-auto border-r">
                            {techStacks.map((stack) => (
                              <TabsTrigger
                                key={stack.category}
                                value={stack.category}
                                className="justify-start px-4 py-2 text-left"
                              >
                                {stack.category}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                          <div className="w-2/3 p-4">
                            {techStacks.map((stack) => (
                              <TabsContent
                                key={stack.category}
                                value={stack.category}
                              >
                                <div className="space-y-4">
                                  {stack.techs.map((tech) => (
                                    <div
                                      key={tech.name}
                                      className="flex items-start"
                                    >
                                      <div className="flex-shrink-0 w-6 h-6 mr-4 mt-1">
                                        <tech.icon className="w-full h-full" />
                                      </div>
                                      <div>
                                        <h3 className="text-lg font-semibold">
                                          {tech.name}
                                        </h3>
                                        <p className="text-muted-foreground">
                                          {tech.description}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </TabsContent>
                            ))}
                          </div>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </section>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
