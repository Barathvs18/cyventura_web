import React from 'react';
import { 
  Rocket, 
  Laptop, 
  Palette, 
  Radio, 
  FileText, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import './event.css';

const BentoGridItem = ({ title, description, header, icon, className }) => {
  return (
    <div className={`bento-item ${className}`}>
      <div className="bento-header-wrapper">{header}</div>
      <div className="bento-content">
        <div className="bento-icon">{icon}</div>
        <h2 className="bento-title">{title}</h2>
        <p className="bento-description">{description}</p>
      </div>
    </div>
  );
};

export const BentoGrid = ({ items }) => {
  return (
    <div className="bento-container">
      <div className="bento-grid">
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={item.className}
          />
        ))}
      </div>
    </div>
  );
};

// Updated Example Usage with Lucide Icons
const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of new ideas and inventions.",
    header: <div className="skeleton sk-1" />,
    className: "md:col-span-2",
    icon: <Rocket size={20} className="icon-blue" />,
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <div className="skeleton sk-2" />,
    className: "md:col-span-1",
    icon: <Laptop size={20} className="icon-purple" />,
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of functional design.",
    header: <div className="skeleton sk-3" />,
    className: "md:col-span-1",
    icon: <Palette size={20} className="icon-red" />,
  },
  {
    title: "Communication Mastery",
    description: "Understand the impact of effective communication.",
    header: <div className="skeleton sk-4" />,
    className: "md:col-span-2",
    icon: <Radio size={20} className="icon-green" />,
  },
];

export default function BentoDemo() {
  return (
    <div className="bento-page-wrapper">
      <BentoGrid items={items} />
    </div>
  );
}