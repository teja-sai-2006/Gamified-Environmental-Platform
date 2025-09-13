import { useEffect, useMemo, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown, School, Search, Trophy, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";

type SchoolRow = { schoolId: string; schoolName: string; ecoPoints: number; students: number };
type StudentRow = { username: string; name?: string; ecoPoints: number };
type GlobalStudentRow = {
  username: string;
  name?: string;
  schoolId?: string;
  schoolName?: string;
  ecoPoints: number;
  achievements?: string[];
  snapshot?: { tasksApproved: number; quizzesCompleted: number };
};
type TeacherRow = { username: string; name?: string; schoolId?: string; schoolName?: string; ecoPoints: number; tasksCreated: number; quizzesCreated: number };

export default function LeaderboardPage() {
  const [schools, setSchools] = useState<SchoolRow[] | null>(null);
  const [schoolsError, setSchoolsError] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolRow | null>(null);
  const [students, setStudents] = useState<StudentRow[] | null>(null);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const { username: me } = useAuth();

  // Header filters and tabs
  type Scope = 'global' | 'school' | 'class';
  const [scope, setScope] = useState<Scope>('global');
  type Tab = 'schools' | 'students' | 'teachers';
  const [tab, setTab] = useState<Tab>('schools');
  const [search, setSearch] = useState('');
  const [globalStudents, setGlobalStudents] = useState<GlobalStudentRow[] | null>(null);
  const [teachers, setTeachers] = useState<TeacherRow[] | null>(null);
  const [loadingTab, setLoadingTab] = useState(false);
  const [schoolsList, setSchoolsList] = useState<Array<{ id: string; name: string }>>([]);
  const [schoolFilter, setSchoolFilter] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setSchoolsError(null);
      try {
        const res = await fetch(`/api/leaderboard/schools?limit=50`);
        if (!res.ok) throw new Error(`${res.status}`);
        const list = (await res.json()) as SchoolRow[];
        if (mounted) setSchools(Array.isArray(list) ? list : []);
      } catch (e: any) {
        if (mounted) setSchoolsError(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load tab content for Students/Teachers (global scope)
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (tab === 'students') {
        setLoadingTab(true);
        try {
          const url = `/api/leaderboard/students?limit=100${schoolFilter ? `&schoolId=${encodeURIComponent(schoolFilter)}` : ''}`;
          const res = await fetch(url);
          const list = (await res.json()) as GlobalStudentRow[];
          if (mounted) setGlobalStudents(Array.isArray(list) ? list : []);
        } catch {
          if (mounted) setGlobalStudents([]);
        } finally {
          if (mounted) setLoadingTab(false);
        }
      } else if (tab === 'teachers') {
        setLoadingTab(true);
        try {
          const url = `/api/leaderboard/teachers?limit=100${schoolFilter ? `&schoolId=${encodeURIComponent(schoolFilter)}` : ''}`;
          const res = await fetch(url);
          const list = (await res.json()) as TeacherRow[];
          if (mounted) setTeachers(Array.isArray(list) ? list : []);
        } catch {
          if (mounted) setTeachers([]);
        } finally {
          if (mounted) setLoadingTab(false);
        }
      }
    };
    run();
    return () => { mounted = false; };
  }, [tab, schoolFilter]);

  // Derive schools for filter dropdown from loaded leaderboard schools
  useEffect(() => {
    if (Array.isArray(schools)) {
      setSchoolsList(schools.map(s => ({ id: s.schoolId, name: s.schoolName })));
    }
  }, [schools]);

  const loadStudents = async (school: SchoolRow) => {
    setSelectedSchool(school);
    setStudents(null);
    setStudentsError(null);
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/leaderboard/school/${encodeURIComponent(school.schoolId)}/students?limit=50`);
      if (!res.ok) throw new Error(`${res.status}`);
      const list = (await res.json()) as StudentRow[];
      setStudents(Array.isArray(list) ? list : []);
    } catch (e: any) {
      setStudentsError(e?.message || "Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const backToGlobal = () => {
    setSelectedSchool(null);
    setStudents(null);
    setStudentsError(null);
  };

  return (
    <div 
      className="min-h-screen bg-space-gradient p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/api/image/9999.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-16 w-40 h-40 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-32 h-32 bg-amber-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-28 h-28 bg-orange-400 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-yellow-300 rounded-full animate-bounce delay-500"></div>
      </div>
      
      <div className="relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-4">
            {selectedSchool && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={backToGlobal}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20"
              >
                <ArrowLeft size={14} className="mr-1" /> Back
              </Button>
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent flex items-center gap-3">
              Leaderboard <span className="text-3xl">🏆</span>
            </h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mb-4"></div>

          {/* Header filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-full border border-white/20 p-1">
              {(['global','school','class'] as const).map((s) => (
                <button 
                  key={s} 
                  onClick={()=>setScope(s)} 
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                    scope===s
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-yellow-200 hover:bg-white/10'
                  }`}
                >
                  {s==='global'?'🌍 Global':s==='school'?'🏫 School':'👥 Class'}
                </button>
              ))}
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full border border-white/20 p-1">
              {(['schools','students','teachers'] as const).map((t)=> (
                <button 
                  key={t} 
                  onClick={()=>setTab(t)} 
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                    tab===t
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-yellow-200 hover:bg-white/10'
                  }`}
                >
                  {t[0].toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
            {(tab==='students' || tab==='teachers') && (
              <select 
                value={schoolFilter} 
                onChange={(e)=>setSchoolFilter(e.target.value)} 
                className="rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 text-sm text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
              >
                <option value="" className="bg-gray-800">All Schools</option>
                {schoolsList.map(s => (<option key={s.id} value={s.id} className="bg-gray-800">{s.name}</option>))}
              </select>
            )}
            <div className="ml-auto flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 px-3 py-2">
              <Search size={16} className="text-yellow-200" />
              <input 
                value={search} 
                onChange={e=>setSearch(e.target.value)} 
                placeholder="Search..." 
                className="bg-transparent outline-none text-sm text-white placeholder-yellow-200 w-32"
              />
            </div>
          </div>
        </div>

        {!selectedSchool ? (
          <div>
            {tab === 'schools' && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="bg-white/5 backdrop-blur-sm px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-white">Top Schools</h2>
                  <p className="text-yellow-200 text-sm">Global schools ranked by eco-points</p>
                </div>
                <div className="grid grid-cols-12 px-6 py-3 text-sm text-yellow-200 border-b border-white/10 bg-white/5">
                  <div className="col-span-2">Rank</div>
                  <div className="col-span-4">School</div>
                  <div className="col-span-3">Top Student</div>
                  <div className="col-span-1 text-right">👥</div>
                  <div className="col-span-2 text-right">Eco-Points</div>
                </div>
                <div>
                  {loading && <div className="px-6 py-8 text-yellow-200 text-center">Loading amazing schools...</div>}
                  {schoolsError && <div className="px-6 py-8 text-red-300 text-center">{schoolsError}</div>}
                  {(!loading && !schoolsError && (schools?.length ?? 0) === 0) && (
                    <div className="px-6 py-8 text-yellow-200 text-center">No schools yet.</div>
                  )}
                  {(schools || []).filter(s=>!search||s.schoolName.toLowerCase().includes(search.toLowerCase())).map((s, idx) => (
                    <HoverCard key={s.schoolId}>
                      <HoverCardTrigger asChild>
                        <button
                          className="w-full grid grid-cols-12 px-6 py-4 hover:bg-white/5 text-left transition-all duration-200 border-b border-white/5 last:border-b-0"
                          onClick={() => loadStudents(s)}
                        >
                          <div className="col-span-2 flex items-center gap-2 text-sm">
                            {idx===0?
                              <Crown size={16} className="text-yellow-400"/>:
                              <Trophy size={16} className={idx < 3 ? 'text-yellow-400' : 'text-yellow-200'} />
                            }
                            <span className="font-semibold">#{idx + 1}</span>
                          </div>
                          <div className="col-span-4 flex items-center gap-2">
                            <School size={18} className="text-emerald-400" />
                            <span className="truncate font-medium text-white">{s.schoolName}</span>
                          </div>
                          <div className="col-span-3 text-sm text-yellow-200">—</div>
                          <div className="col-span-1 text-right text-yellow-200 flex items-center justify-end gap-1">
                            <Users size={14} /> <span className="font-medium">{s.students}</span>
                          </div>
                          <div className="col-span-2 text-right font-bold text-white text-lg">{formatPoints(s.ecoPoints)}</div>
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-gray-800/90 backdrop-blur-xl border-white/20">
                        <SchoolHoverPreview schoolId={s.schoolId} fallback={{ schoolName: s.schoolName, ecoPoints: s.ecoPoints, students: s.students }} />
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </div>
            )}

            {tab === 'students' && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="bg-white/5 backdrop-blur-sm px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-white">Top Students</h2>
                  <p className="text-yellow-200 text-sm">Global students ranked by eco-points</p>
                </div>
                <div className="grid grid-cols-12 px-6 py-3 text-sm text-yellow-200 border-b border-white/10 bg-white/5">
                  <div className="col-span-2">Rank</div>
                  <div className="col-span-4">Student</div>
                  <div className="col-span-4">School</div>
                  <div className="col-span-2 text-right">Eco-Points</div>
                </div>
                <div>
                  {loadingTab && <div className="px-6 py-8 text-yellow-200 text-center">Loading eco-champions...</div>}
                  {(!loadingTab && (globalStudents?.length ?? 0) === 0) && <div className="px-6 py-8 text-yellow-200 text-center">No students found.</div>}
                  {(globalStudents || []).filter(r => !search || r.username.toLowerCase().includes(search.toLowerCase()) || (r.name||'').toLowerCase().includes(search.toLowerCase()) || (r.schoolName||'').toLowerCase().includes(search.toLowerCase())).map((r, idx) => (
                    <GlobalStudentRowItem key={r.username} row={r} rank={idx + 1} isMe={me === r.username} />
                  ))}
                </div>
              </div>
            )}

            {tab === 'teachers' && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="bg-white/5 backdrop-blur-sm px-6 py-4 border-b border-white/10">
                  <h2 className="text-xl font-semibold text-white">Top Teachers</h2>
                  <p className="text-yellow-200 text-sm">Educators making a difference</p>
                </div>
                <div className="grid grid-cols-12 px-6 py-3 text-sm text-yellow-200 border-b border-white/10 bg-white/5">
                  <div className="col-span-2">Rank</div>
                  <div className="col-span-4">Teacher</div>
                  <div className="col-span-2">School</div>
                  <div className="col-span-2 text-right">Eco-Points</div>
                  <div className="col-span-1 text-right">Tasks</div>
                  <div className="col-span-1 text-right">Quizzes</div>
                </div>
                <div>
                  {loadingTab && <div className="px-6 py-8 text-yellow-200 text-center">Loading inspiring educators...</div>}
                  {(!loadingTab && (teachers?.length ?? 0) === 0) && <div className="px-6 py-8 text-yellow-200 text-center">No teachers found.</div>}
                  {(teachers || []).filter(r => !search || r.username.toLowerCase().includes(search.toLowerCase()) || (r.name||'').toLowerCase().includes(search.toLowerCase()) || (r.schoolName||'').toLowerCase().includes(search.toLowerCase())).map((t, idx) => (
                    <HoverCard key={t.username}>
                      <HoverCardTrigger asChild>
                        <div className="grid grid-cols-12 px-6 py-4 hover:bg-white/5 transition-all duration-200 border-b border-white/5 last:border-b-0">
                          <div className="col-span-2 text-sm font-semibold">#{idx + 1}</div>
                          <div className="col-span-4 font-medium text-white">@{t.username} {t.name && <span className="text-yellow-200 ml-1">{t.name}</span>}</div>
                          <div className="col-span-2 text-yellow-200">{t.schoolName || '—'}</div>
                          <div className="col-span-2 text-right font-bold text-white">{formatPoints(t.ecoPoints)}</div>
                          <div className="col-span-1 text-right font-medium">{t.tasksCreated}</div>
                          <div className="col-span-1 text-right font-medium">{t.quizzesCreated}</div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-gray-800/90 backdrop-blur-xl border-white/20">
                        <TeacherHoverPreview username={t.username} />
                      </HoverCardContent>
                    </HoverCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
            <div className="bg-white/5 backdrop-blur-sm px-6 py-4 border-b border-white/10">
              <div className="text-yellow-200 text-sm mb-1">Global › School</div>
              <h2 className="text-2xl font-semibold text-white">{selectedSchool.schoolName}</h2>
              <div className="text-yellow-200">Top students in this school</div>
            </div>

            <div className="grid grid-cols-12 px-6 py-3 text-sm text-yellow-200 border-b border-white/10 bg-white/5">
              <div className="col-span-2">Rank</div>
              <div className="col-span-6">Student</div>
              <div className="col-span-4 text-right">Eco-Points</div>
            </div>
            <div>
              {loadingStudents && <div className="px-6 py-8 text-yellow-200 text-center">Loading students...</div>}
              {studentsError && <div className="px-6 py-8 text-red-300 text-center">{studentsError}</div>}
              {(!loadingStudents && !studentsError && (students?.length ?? 0) === 0) && (
                <div className="px-6 py-8 text-yellow-200 text-center">No students yet.</div>
              )}
              {(students || []).map((u, idx) => (
                <StudentRowItem key={u.username} row={u} rank={idx + 1} isMe={me === u.username} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SchoolHoverPreview({ schoolId, fallback }: { schoolId: string; fallback?: { schoolName: string; ecoPoints: number; students: number } }) {
  const [data, setData] = useState<{ schoolId: string; schoolName: string; ecoPoints: number; students: number; topStudent?: { username: string; name?: string; ecoPoints: number } } | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/leaderboard/school/${encodeURIComponent(schoolId)}/preview`);
        if (!res.ok) throw new Error('');
        const j = await res.json();
        if (mounted) setData(j);
      } catch {
        if (mounted && fallback) setData({ schoolId, ...fallback });
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, [schoolId]);
  if (!loaded && !data) return <div className="text-xs text-earth-muted">Loading…</div>;
  if (!data) return <div className="text-xs text-red-300">Not available</div>;
  return (
    <div className="text-sm">
      <div className="font-medium">{data.schoolName}</div>
      <div className="text-xs text-earth-muted">Eco-Points: <span className="text-white font-semibold">{formatPoints(data.ecoPoints)}</span></div>
      <div className="text-xs text-earth-muted">Students: <span className="text-white">{data.students}</span></div>
      {data.topStudent && (
        <div className="mt-2 text-xs">
          Top Student: <span className="font-medium">@{data.topStudent.username}</span> <span className="text-earth-muted">{data.topStudent.name || ''}</span>
          <span className="ml-1">· {formatPoints(data.topStudent.ecoPoints)} pts</span>
        </div>
      )}
      <div className="mt-3 text-[10px] text-earth-muted">Click to view top students</div>
    </div>
  );
}

function StudentRowItem({ row, rank, isMe }: { row: StudentRow; rank: number; isMe: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <HoverCard open={open} onOpenChange={(o)=>setOpen(o)}>
      <HoverCardTrigger asChild>
        <div className="grid grid-cols-12 px-6 py-4 hover:bg-white/5 cursor-default transition-all duration-200 border-b border-white/5 last:border-b-0" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
          <div className="col-span-2 text-sm font-semibold">#{rank}</div>
          <div className="col-span-6">
            <span className="font-medium text-white">@{row.username}</span>
            {row.name && <span className="text-yellow-200 ml-2">{row.name}</span>}
            {isMe && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">you</span>}
          </div>
          <div className="col-span-4 text-right font-bold text-white text-lg">{formatPoints(row.ecoPoints)}</div>
        </div>
      </HoverCardTrigger>
      <StudentHoverPreview username={row.username} open={open} />
    </HoverCard>
  );
}

function GlobalStudentRowItem({ row, rank, isMe }: { row: GlobalStudentRow; rank: number; isMe: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <div className="grid grid-cols-12 px-6 py-4 hover:bg-white/5 cursor-default transition-all duration-200 border-b border-white/5 last:border-b-0" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
          <div className="col-span-2 text-sm font-semibold">#{rank}</div>
          <div className="col-span-4">
            <span className="font-medium text-white">@{row.username}</span>
            {row.name && <span className="text-yellow-200 ml-2">{row.name}</span>}
            {isMe && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200">you</span>}
          </div>
          <div className="col-span-4 text-yellow-200">{row.schoolName || '—'}</div>
          <div className="col-span-2 text-right font-bold text-white text-lg">{formatPoints(row.ecoPoints)}</div>
          <div className="col-span-12 pl-6 mt-2 flex gap-2 text-sm">
            {(row.achievements || []).slice(0,3).map((a: string, i: number)=>(<span key={i} className="text-amber-300">{a}</span>))}
            {row.snapshot && (
              <span className="text-xs text-yellow-200 ml-auto">{row.snapshot.tasksApproved} tasks · {row.snapshot.quizzesCompleted} quizzes</span>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <StudentHoverPreview username={row.username} open={open} />
    </HoverCard>
  );
}

function StudentHoverPreview({ username, open }: { username: string; open: boolean }) {
  const [data, setData] = useState<{ username: string; name?: string; ecoPoints: number; schoolId?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { username: me } = useAuth();

  // Load once on first open
  useEffect(() => {
    let active = true;
    if (!open || loaded) return;
    (async () => {
      try {
        const res = await fetch(`/api/leaderboard/student/${encodeURIComponent(username)}/preview`);
        if (!res.ok) throw new Error(`${res.status}`);
        const json = await res.json();
        if (active) setData(json);
      } catch (e: any) {
        if (active) setError(e?.message || "Failed to load");
      } finally {
        if (active) setLoaded(true);
      }
    })();
    return () => { active = false; };
  }, [open, loaded, username]);

  return (
    <HoverCardContent>
      {!loaded && <div className="text-xs text-earth-muted">Loading…</div>}
      {error && <div className="text-xs text-red-300">{error}</div>}
      {data && (
        <div className="text-sm">
          <div className="font-medium">@{data.username} {data.name && <span className="text-earth-muted">· {data.name}</span>}</div>
          <div className="text-xs text-earth-muted">Eco-Points: <span className="text-white font-semibold">{formatPoints(data.ecoPoints)}</span></div>
          {me === data.username ? (
            <div className="mt-3">
              <a href="/student" className="text-xs underline text-emerald-300">View your eco-profile</a>
            </div>
          ) : (
            <div className="mt-3 text-[10px] text-earth-muted">Full profile is private; ask them to share.</div>
          )}
        </div>
      )}
    </HoverCardContent>
  );
}

function TeacherHoverPreview({ username }: { username: string }) {
  const [data, setData] = useState<{ username: string; name?: string; ecoPoints: number; schoolId?: string; schoolName?: string; tasksCreated: number; quizzesCreated: number } | null>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/leaderboard/teacher/${encodeURIComponent(username)}/preview`);
        if (!res.ok) throw new Error('');
        const j = await res.json();
        if (mounted) setData(j);
      } catch {
        if (mounted) setData(null);
      } finally {
        if (mounted) setLoaded(true);
      }
    })();
    return () => { mounted = false; };
  }, [username]);
  if (!loaded) return <div className="text-xs text-earth-muted">Loading…</div>;
  if (!data) return <div className="text-xs text-red-300">Not available</div>;
  return (
    <div className="text-sm">
      <div className="font-medium">@{data.username} {data.name && <span className="text-earth-muted">· {data.name}</span>}</div>
      <div className="text-xs text-earth-muted">School: <span className="text-white">{data.schoolName || '—'}</span></div>
      <div className="text-xs text-earth-muted">Eco-Points: <span className="text-white font-semibold">{formatPoints(data.ecoPoints)}</span></div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div>Tasks: <span className="text-white">{data.tasksCreated}</span></div>
        <div>Quizzes: <span className="text-white">{data.quizzesCreated}</span></div>
      </div>
    </div>
  );
}

function formatPoints(n: number) {
  const v = Math.floor(Number(n) || 0);
  return v.toLocaleString();
}
