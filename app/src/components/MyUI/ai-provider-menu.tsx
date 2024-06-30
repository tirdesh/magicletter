import cohereIcon from "@/assets/cohere.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIProviderName } from "@/model";
import { setAIProvider } from "@/redux/slices/aiProviderSlice";
import { RootState } from "@/redux/store";
import { ChevronDown } from "lucide-react";
import React from "react";
import {
  SiOpenai,
  SiProbot, // for Claude (Anthropic)
} from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";

const providers: { name: AIProviderName; icon: React.ReactNode }[] = [
  { name: "openai", icon: <SiOpenai className="w-5 h-5" /> },
  { name: "claude", icon: <SiProbot className="w-5 h-5" /> },
  {
    name: "cohere",
    icon: <img src={cohereIcon} alt="Cohere" className="w-5 h-5" />,
  },
];

export const AIProviderMenu: React.FC = () => {
  const dispatch = useDispatch();
  const currentProvider = useSelector(
    (state: RootState) => state.aiProvider.currentProvider
  );

  const handleProviderChange = (provider: AIProviderName) => {
    dispatch(setAIProvider(provider));
  };

  const currentProviderIcon = providers.find(
    (p) => p.name === currentProvider
  )?.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          {currentProviderIcon}
          <span className="capitalize">{currentProvider}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {providers.map((provider) => (
          <DropdownMenuItem
            key={provider.name}
            onSelect={() => handleProviderChange(provider.name)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            {provider.icon}
            <span className="capitalize">{provider.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
