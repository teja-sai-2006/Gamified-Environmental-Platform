import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { GAMES } from "@/lib/gamesCatalog";

type GameDef = typeof GAMES[number];

export default function GamesPage() {
  const [category, setCategory] = useState<'recycling' | 'climate' | 'habits' | 'wildlife' | 'fun' | 'all'>('all');
  const [summary, setSummary] = useState<{ totalGamePoints: number; badges: string[]; monthCompletedCount: number; totalUniqueGames: number } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const { username } = useAuth();
  const [tapLock, setTapLock] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoadingSummary(true);
      try {
        const res = await fetch('/api/student/games/summary', { headers: username ? { 'x-username': username } : undefined });
        const json = await res.json();
        if (active) setSummary(json);
      } catch {
        if (active) setSummary({ totalGamePoints: 0, badges: [], monthCompletedCount: 0, totalUniqueGames: 0 });
      } finally {
        if (active) setLoadingSummary(false);
      }
    })();
    return () => { active = false; };
  }, [username]);

  const filtered = useMemo(() => {
    return category === 'all' ? GAMES : GAMES.filter(g => g.category === category);
  }, [category]);

  const openGame = (g: GameDef) => {
    if (tapLock) return;
    setTapLock(true);
    setTimeout(()=>setTapLock(false), 500); // simple debounce
  };
  // Refresh progress when user returns from a game
  useEffect(() => {
    const onFocus = () => {
      fetch('/api/student/games/summary', { headers: username ? { 'x-username': username } : undefined })
        .then(r=>r.json())
        .then(setSummary)
        .catch(()=>{});
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [username]);

  return (
    <div 
      className="min-h-screen bg-space-gradient p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/api/image/earth.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-10 w-32 h-32 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-emerald-400 rounded-full animate-bounce delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-teal-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-10 w-28 h-28 bg-lime-400 rounded-full animate-bounce delay-1500"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl flex-1">
            <h1 className="text-4xl font-bold flex items-center gap-3 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
              Eco-Games <span className="text-3xl">🌱🎮</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mt-2 mb-4"></div>
            <p className="text-green-200">Play fun interactive games, learn sustainability, and earn Eco-Points & badges.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl min-w-[280px]">
            <div className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🏆</span> Your Game Progress
            </div>
            {loadingSummary ? (
              <div className="text-green-200 text-sm">Loading…</div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-green-200">Game Points</span>
                    <span className="font-bold text-xl text-white">{summary?.totalGamePoints ?? 0}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center">
                    <div className="text-sm text-green-200">This Month</div>
                    <div className="font-semibold text-white">{summary?.monthCompletedCount ?? 0}</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 text-center">
                    <div className="text-sm text-green-200">Unique Games</div>
                    <div className="font-semibold text-white">{summary?.totalUniqueGames ?? 0}</div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="text-sm text-green-200 mb-2">Badges Earned</div>
                  <div className="flex flex-wrap gap-1">
                    {(summary?.badges ?? []).length ? (
                      summary!.badges.map((b,i) => (
                        <span key={i} className="text-lg">{b}</span>
                      ))
                    ) : (
                      <span className="text-green-300 text-xs">No badges yet - keep playing!</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
          <Tabs value={category} onValueChange={(v)=>setCategory(v as any)}>
            <TabsList className="bg-white/10 backdrop-blur-sm border border-white/20 w-full grid grid-cols-6 gap-1 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-green-200 border-0">All</TabsTrigger>
              <TabsTrigger value="recycling" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-green-200 border-0">♻️ Recycling</TabsTrigger>
              <TabsTrigger value="climate" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-green-200 border-0">🌍 Climate</TabsTrigger>
              <TabsTrigger value="habits" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-green-200 border-0">🏡 Habits</TabsTrigger>
              <TabsTrigger value="wildlife" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-green-200 border-0">🌱 Wildlife</TabsTrigger>
              <TabsTrigger value="fun" className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-green-200 border-0">🎲 Fun</TabsTrigger>
            </TabsList>
            <TabsContent value={category} className="mt-6">
              {/* Grid of game cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(g => (
                  <div key={g.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xl font-semibold flex items-center gap-2 text-white">
                        {g.icon && <span className="text-2xl">{g.icon}</span>}
                        <span>{g.name}</span>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-green-200">
                        {g.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-green-200 mb-4 leading-relaxed">{g.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-green-200">Reward: </span>
                        <span className="font-semibold text-white">+{g.points} pts</span>
                      </div>
                      <Link href={`/games/play/${g.id}`}>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 transition-all duration-300 group-hover:scale-105" 
                          onClick={()=>openGame(g)}
                        >
                          Play Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
