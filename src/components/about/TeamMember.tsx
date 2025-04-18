import React from 'react';
import { type LucideIcon } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  Icon: LucideIcon;
}

export function TeamMember({ name, role, image, Icon }: TeamMemberProps) {
  return (
    <div className="text-center">
      <div className="relative mb-4 inline-block">
        <img
          src={image}
          alt={name}
          className="w-32 h-32 rounded-full object-cover mx-auto"
        />
        <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
}