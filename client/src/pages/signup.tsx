import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export default function SignUpPage() {
  const { setRole } = useAuth();
  const [, navigate] = useLocation();

  const choose = (r: "student" | "teacher" | "admin") => {
    if (r === "admin") {
      // Do not set role. Admin must sign in.
      navigate("/signin?role=admin");
      return;
    }
    setRole(r);
    if (r === "student") navigate("/student/signup");
    else navigate("/teacher/signup");
  };

  return (
    <div 
      className="min-h-screen bg-space-gradient p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/api/image/green-natural-background-with-trees-and-wooden-foundation-free-image.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-blue-300 rounded-full animate-bounce delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-md mx-auto pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Sign Up</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto mt-2 mb-4"></div>
          <p className="text-blue-200">Choose your role to create an account.</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="grid grid-cols-1 gap-4">
            <Button 
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" 
              onClick={() => choose("student")}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">🎓</span>
                I'm a Student
              </div>
            </Button>
            
            <Button 
              className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" 
              onClick={() => choose("teacher")}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">👨‍🏫</span>
                I'm a Teacher
              </div>
            </Button>
            
            <Button 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-0" 
              onClick={() => choose("admin")}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">⚡</span>
                Admin
              </div>
            </Button>
          </div>
          
          <div className="text-center text-blue-200 text-sm mt-6">
            Already have an account? 
            <a href="/signin" className="text-white font-semibold hover:text-blue-200 ml-1 underline underline-offset-2 transition-colors duration-200">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
