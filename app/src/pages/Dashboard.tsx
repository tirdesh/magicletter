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
import * as SimpleIcons from "simple-icons";
import CohereIcon from "../assets/Cohere.svg";

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

  const techStacks = [
    {
      category: "Frontend Core Technologies",
      techs: [
        {
          icon: SimpleIcons.siReact,
          name: "React",
          description: "Building responsive and interactive user interfaces",
        },
        {
          icon: SimpleIcons.siTypescript,
          name: "TypeScript",
          description: "Ensuring type safety and improving code quality",
        },
        {
          icon: SimpleIcons.siVite,
          name: "Vite",
          description: "Fast build tool for improved development experience",
        },
      ],
    },
    {
      category: "State Management",
      techs: [
        {
          icon: SimpleIcons.siRedux,
          name: "React Redux & Toolkit",
          description: "Official React bindings for Redux",
        },
      ],
    },
    {
      category: "UI & Styling",
      techs: [
        {
          icon: SimpleIcons.siRadixui,
          name: "Radix UI",
          description: "Accessible and customizable UI components",
        },
        {
          icon: SimpleIcons.siFramer,
          name: "Framer Motion",
          description: "Animation library for React",
        },
        {
          icon: SimpleIcons.siTailwindcss,
          name: "Tailwind CSS",
          description: "Utility-first CSS framework",
        },
        {
          icon: SimpleIcons.siShadcnui,
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
          icon: SimpleIcons.siReacthookform,
          name: "React Hook Form",
          description: "Performant, flexible and extensible forms",
        },
        {
          icon: SimpleIcons.siPyup,
          name: "Yup",
          description: "Schema builder for value parsing and validation",
        },
      ],
    },
    {
      category: "Backend & Deployment",
      techs: [
        {
          icon: SimpleIcons.siFirebase,
          name: "Firebase",
          description:
            "Backend-as-a-Service for authentication and data storage",
        },
        {
          icon: SimpleIcons.siVercel,
          name: "Vercel (Serverless)",
          description: "Serverless deployment platform",
        },
      ],
    },
    {
      category: "Utilities & Libraries",
      techs: [
        {
          icon: SimpleIcons.siAxios,
          name: "Axios",
          description: "Promise-based HTTP client for API requests",
        },
        {
          icon: SimpleIcons.siCheerio,
          name: "Cheerio",
          description: "Fast, flexible & lean implementation of core jQuery",
        },
        {
          icon: SimpleIcons.siNpm,
          name: "Compromise",
          description: "Natural language processing library",
        },
      ],
    },
    {
      category: "AI Integrations",
      techs: [
        {
          icon: SimpleIcons.siOpenai,
          name: "OpenAI",
          description:
            "Powerful AI models for natural language processing and generation",
        },
        {
          icon: SimpleIcons.siAnthropic, // Using Anthropic's icon as Claude is their product
          name: "Claude (Anthropic)",
          description: "Advanced AI assistant for various language tasks",
        },
        {
          icon: { type: "svg", svg: CohereIcon },
          name: "Cohere",
          description:
            "AI platform for natural language understanding and generation",
        },
        {
          icon: SimpleIcons.siPerplexity, // Note: Perplexity might not have an icon in SimpleIcons
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
                Welcome to MagicPlanner
              </CardTitle>
              <CardDescription>
                Your AI-powered resume and cover letter assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex flex-col flex-grow overflow-hidden">
              <ScrollArea className="flex-grow pr-4 overflow-y-auto">
                <div className="space-y-8 pb-8">
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">
                      About MagicPlanner
                    </h2>
                    <p className="text-muted-foreground">
                      MagicPlanner is an innovative AI-powered application
                      designed to streamline your job application process. By
                      leveraging cutting-edge technologies and intelligent
                      algorithms, we help you create compelling resumes and
                      cover letters tailored to your target jobs, increasing
                      your chances of landing your dream position.
                    </p>
                  </section>

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
                  <section>
                    <h2 className="text-2xl font-semibold mb-4">
                      Technology Stack
                    </h2>
                    <Tabs defaultValue={techStacks[0].category}>
                      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {techStacks.map((stack) => (
                          <TabsTrigger
                            key={stack.category}
                            value={stack.category}
                          >
                            {stack.category}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {techStacks.map((stack) => (
                        <TabsContent
                          key={stack.category}
                          value={stack.category}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle>{stack.category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {stack.techs.map((tech) => (
                                  <div
                                    key={tech.name}
                                    className="flex items-start"
                                  >
                                    <svg
                                      role="img"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6"
                                      fill="currentColor"
                                    >
                                      <path d={tech.icon.toString()} />
                                    </svg>
                                    <div className="ml-4">
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
                            </CardContent>
                          </Card>
                        </TabsContent>
                      ))}
                    </Tabs>
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
