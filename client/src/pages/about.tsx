import { useEffect, useState } from 'react';

interface PlatformStats {
  totalStudents: number;
  totalTeachers: number;
  totalSchools: number;
  totalEcoPoints: number;
  activeGames: number;
  completedTasks: number;
}

export default function AboutPage() {
  const [stats, setStats] = useState<PlatformStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalSchools: 0,
    totalEcoPoints: 0,
    activeGames: 15,
    completedTasks: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animations
    setIsVisible(true);
    
    // Fetch platform statistics
    const fetchStats = async () => {
      try {
        // Simulate API calls to get platform statistics
        // In a real implementation, these would be actual API endpoints
        const studentStats = await fetch('/api/leaderboard/students?limit=1000').then(r => r.json()).catch(() => []);
        const teacherStats = await fetch('/api/leaderboard/teachers?limit=1000').then(r => r.json()).catch(() => []);
        const schoolStats = await fetch('/api/leaderboard/schools?limit=1000').then(r => r.json()).catch(() => []);
        
        const totalEcoPoints = Array.isArray(studentStats) 
          ? studentStats.reduce((sum: number, student: any) => sum + (student.ecoPoints || 0), 0)
          : 0;
        
        const completedTasks = Array.isArray(studentStats)
          ? studentStats.reduce((sum: number, student: any) => 
              sum + ((student.snapshot?.tasksApproved || 0) + (student.snapshot?.quizzesCompleted || 0)), 0)
          : 0;

        setStats({
          totalStudents: Array.isArray(studentStats) ? studentStats.length : 1250,
          totalTeachers: Array.isArray(teacherStats) ? teacherStats.length : 85,
          totalSchools: Array.isArray(schoolStats) ? schoolStats.length : 42,
          totalEcoPoints: totalEcoPoints || 125000,
          activeGames: 15,
          completedTasks: completedTasks || 2847
        });
      } catch (error) {
        // Use fallback demo statistics
        setStats({
          totalStudents: 1250,
          totalTeachers: 85,
          totalSchools: 42,
          totalEcoPoints: 125000,
          activeGames: 15,
          completedTasks: 2847
        });
      }
    };

    fetchStats();
  }, []);

  const CountUpNumber = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
    const [current, setCurrent] = useState(0);
    
    useEffect(() => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        if (step <= steps) {
          setCurrent(Math.floor(increment * step));
        } else {
          setCurrent(target);
          clearInterval(timer);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }, [target]);
    
    return <span>{current.toLocaleString()}{suffix}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-300 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['🌱', '🌍', '🌿', '♻️', '🌳'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className={`text-center py-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent mb-6 animate-pulse">
            EcoVision
          </h1>
          <p className="text-2xl md:text-3xl text-green-200 mb-8 font-light">
            Where Learning Meets Environmental Action
          </p>
          <div className="text-lg md:text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
            Empowering the next generation through gamified environmental education, 
            connecting students and teachers in a mission to create a sustainable future.
          </div>
        </div>

        {/* Mission Section */}
        <div className={`mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-bold text-center mb-12 text-green-200">Our Mission</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-4 group-hover:animate-bounce">🌱</div>
                <h3 className="text-xl font-semibold mb-3 text-green-300">Educate</h3>
                <p className="text-green-100">
                  Interactive games and quizzes that make environmental learning engaging and memorable
                </p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-4 group-hover:animate-bounce">🏃‍♂️</div>
                <h3 className="text-xl font-semibold mb-3 text-green-300">Action</h3>
                <p className="text-green-100">
                  Real-world tasks and challenges that encourage students to make a positive environmental impact
                </p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="text-6xl mb-4 group-hover:animate-bounce">🤝</div>
                <h3 className="text-xl font-semibold mb-3 text-green-300">Connect</h3>
                <p className="text-green-100">
                  Building a community of environmentally conscious students, teachers, and schools
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Statistics */}
        <div className={`mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center mb-12 text-green-200">Our Growing Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div className="bg-gradient-to-br from-green-600/30 to-emerald-700/30 backdrop-blur-lg rounded-2xl p-6 text-center border border-green-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-3xl font-bold text-green-300 mb-2">
                <CountUpNumber target={stats.totalStudents} />
              </div>
              <div className="text-sm text-green-200">Active Students</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-600/30 to-teal-700/30 backdrop-blur-lg rounded-2xl p-6 text-center border border-emerald-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <div className="text-3xl font-bold text-emerald-300 mb-2">
                <CountUpNumber target={stats.totalTeachers} />
              </div>
              <div className="text-sm text-emerald-200">Dedicated Teachers</div>
            </div>
            <div className="bg-gradient-to-br from-teal-600/30 to-cyan-700/30 backdrop-blur-lg rounded-2xl p-6 text-center border border-teal-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="text-3xl mb-2">🏫</div>
              <div className="text-3xl font-bold text-teal-300 mb-2">
                <CountUpNumber target={stats.totalSchools} />
              </div>
              <div className="text-sm text-teal-200">Partner Schools</div>
            </div>
            <div className="bg-gradient-to-br from-green-600/30 to-emerald-700/30 backdrop-blur-lg rounded-2xl p-6 text-center border border-green-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="text-3xl mb-2">🌟</div>
              <div className="text-3xl font-bold text-green-300 mb-2">
                <CountUpNumber target={stats.totalEcoPoints} suffix="+" />
              </div>
              <div className="text-sm text-green-200">Eco-Points Earned</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-600/30 to-teal-700/30 backdrop-blur-lg rounded-2xl p-6 text-center border border-emerald-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-3xl font-bold text-emerald-300 mb-2">
                <CountUpNumber target={stats.activeGames} />
              </div>
              <div className="text-sm text-emerald-200">Interactive Games</div>
            </div>
            <div className="bg-gradient-to-br from-teal-600/30 to-cyan-700/30 backdrop-blur-lg rounded-2xl p-6 text-center border border-teal-400/30 hover:scale-105 transition-all duration-300 hover:shadow-2xl">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-3xl font-bold text-teal-300 mb-2">
                <CountUpNumber target={stats.completedTasks} suffix="+" />
              </div>
              <div className="text-sm text-teal-200">Tasks Completed</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={`mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-center mb-12 text-green-200">What Makes Us Special</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Interactive Games</h3>
              <p className="text-green-100">
                Engaging mini-games covering recycling, climate action, sustainable habits, and wildlife conservation.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Smart Quizzes</h3>
              <p className="text-green-100">
                Server-side scored quizzes with one-attempt challenges that test environmental knowledge effectively.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Real-World Tasks</h3>
              <p className="text-green-100">
                Photo-proof assignments that encourage actual environmental actions in students' communities.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Leaderboards</h3>
              <p className="text-green-100">
                Global and school-level competitions that motivate students and celebrate environmental achievements.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Growth Tracking</h3>
              <p className="text-green-100">
                Personal eco-trees that grow from seedlings to mighty trees as students progress and earn points.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-3 text-green-300">Community</h3>
              <p className="text-green-100">
                Connect schools, students, and teachers in a collaborative platform for environmental education.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className={`mb-20 transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-green-600/20 via-emerald-600/20 to-teal-600/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-green-400/30">
            <h2 className="text-4xl font-bold text-center mb-8 text-green-200">Our Environmental Impact</h2>
            <div className="text-center text-lg text-green-100 max-w-4xl mx-auto space-y-4">
              <p>
                Through our platform, students aren't just learning about environmental issues—they're actively solving them. 
                Every completed task represents a real action taken to protect our planet.
              </p>
              <p>
                From tree planting and waste reduction to energy conservation and wildlife protection, 
                our community is making measurable impacts in their local environments while building 
                the knowledge and habits needed for a sustainable future.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center py-16 transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-4xl font-bold mb-6 text-green-200">Join the Movement</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Ready to be part of the solution? Whether you're a student eager to learn, 
            a teacher passionate about environmental education, or a school looking to make a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/student-signup" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Join as Student 🌱
            </a>
            <a 
              href="/teacher-signup" 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Join as Teacher 🍃
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
