import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function AnnouncementsPage() {
  const { username } = useAuth();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
  const me = await fetch('/api/me/profile', { headers: { 'X-Username': username || '' } }).then(r => r.json());
  const teacherMode = me?.role === 'teacher';
  const url = teacherMode ? '/api/teacher/announcements' : '/api/student/announcements';
  const data = await fetch(url, { headers: { 'X-Username': username || '' } }).then(r => r.json());
        if (!mounted) return;
        setList(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [username]);
  return (
    <div 
      className="min-h-screen bg-space-gradient text-white p-6"
      style={{
        backgroundImage: `url(/api/image/99.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Glassmorphic header */}
      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Announcements</h1>
      </div>
      {loading ? <p className="text-white/70">Loading…</p> : (
        <div className="space-y-2">
          {list.length === 0 && <p className="text-sm text-white/70">No announcements yet.</p>}
          {list.map(a => (
            <div key={a.id} className="p-3 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
              <div className="font-medium">{a.title}</div>
              {a.body && <div className="text-sm text-white/70 whitespace-pre-wrap">{a.body}</div>}
              <div className="text-xs text-white/60 mt-1">{new Date(a.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
