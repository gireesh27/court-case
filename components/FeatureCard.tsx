import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, description, icon: Icon }: Props) {
  return (
    <Card className="border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-indigo-700" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}
