import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { getRandomQuote } from '../../data/quotes';

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(getRandomQuote());

  const handleRefresh = () => {
    setQuote(getRandomQuote());
  };

  return (
    <Card className="bg-transparent border-white/20 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <p className="text-lg italic text-white drop-shadow-lg">
              "{quote.text}"
            </p>
            <p className="text-sm text-white/70 drop-shadow-lg">
              — {quote.author}, <span className="text-xs">{quote.field}</span>
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="shrink-0 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
