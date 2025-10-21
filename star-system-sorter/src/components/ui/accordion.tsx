import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const AccordionItemContext = createContext<string>('');

export function Accordion({ 
  children, 
  type = 'single',
  className = '' 
}: { 
  children: ReactNode; 
  type?: 'single' | 'multiple';
  className?: string;
}) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    if (type === 'single') {
      setOpenItems(openItems.includes(value) ? [] : [value]);
    } else {
      setOpenItems(
        openItems.includes(value)
          ? openItems.filter(item => item !== value)
          : [...openItems, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ 
  children, 
  value,
  className = '' 
}: { 
  children: ReactNode; 
  value: string;
  className?: string;
}) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={className}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const context = useContext(AccordionContext);
  const value = useContext(AccordionItemContext);
  
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  return (
    <button
      type="button"
      className={className}
      onClick={() => context.toggleItem(value)}
    >
      {children}
    </button>
  );
}

export function AccordionContent({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const context = useContext(AccordionContext);
  const value = useContext(AccordionItemContext);
  const contentRef = useRef<HTMLDivElement>(null);
  
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const isOpen = context.openItems.includes(value);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight = `${contentRef.current.scrollHeight}px`;
      } else {
        contentRef.current.style.maxHeight = '0px';
      }
    }
  }, [isOpen]);

  return (
    <div 
      ref={contentRef}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? '' : 'opacity-0'} ${className}`}
      style={{ 
        maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px',
        paddingTop: isOpen ? undefined : '0px',
        paddingBottom: isOpen ? undefined : '0px'
      }}
    >
      {isOpen && children}
    </div>
  );
}
