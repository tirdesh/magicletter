import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIProviderName } from "@/model";
import { setAIProvider } from "@/redux/slices/aiProviderSlice";
import { RootState } from "@/redux/store";
import { ChevronDown } from "lucide-react"; // Import ChevronDown icon
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const providers: AIProviderName[] = ["openai", "claude", "cohere"];

export const AIProviderMenu: React.FC = () => {
  const dispatch = useDispatch();
  const currentProvider = useSelector(
    (state: RootState) => state.aiProvider.currentProvider
  );

  const handleProviderChange = (provider: AIProviderName) => {
    dispatch(setAIProvider(provider));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus:outline-none">
        <span>{currentProvider}</span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {providers.map((provider) => (
          <DropdownMenuItem
            key={provider}
            onSelect={() => handleProviderChange(provider)}
          >
            {provider}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
