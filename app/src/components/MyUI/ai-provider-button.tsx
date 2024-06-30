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
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const providers: AIProviderName[] = ["openai", "claude", "cohere"];

export const AIProviderButton: React.FC = () => {
  const dispatch = useDispatch();
  const currentProvider = useSelector(
    (state: RootState) => state.aiProvider.currentProvider
  );

  const handleProviderChange = (provider: AIProviderName) => {
    dispatch(setAIProvider(provider));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{currentProvider}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {providers.map((provider) => (
          <DropdownMenuItem
            key={provider}
            onClick={() => handleProviderChange(provider)}
          >
            {provider}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
