import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { getRandomQuote } from '../../data/quotes';

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(getRandomQuote());

  const handleRefresh = () => {
    setQuote(getRandomQuote());
  };

  return (
    <div className="text-center max-w-4xl mx-auto pt-8">
      <div className="space-y-4">
        <p className="text-2xl font-medium italic text-white leading-relaxed drop-shadow-lg">
          "{quote.text}"
        </p>
        <p className="text-base text-white/90 drop-shadow-md">
          — {quote.author}, <span className="text-sm">{quote.field}</span>
        </p>
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-white hover:text-white/80 hover:bg-white/10"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
