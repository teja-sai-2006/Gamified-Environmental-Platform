import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactHelpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "", category: "" });
    setIsSubmitting(false);
  };

  return (
    <div 
      className="min-h-screen bg-space-gradient p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/api/image/profileofstudents.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-16 left-20 w-36 h-36 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-24 right-16 w-28 h-28 bg-orange-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-2/3 right-1/3 w-32 h-32 bg-amber-400 rounded-full animate-pulse delay-1200"></div>
        <div className="absolute bottom-1/2 left-10 w-20 h-20 bg-yellow-300 rounded-full animate-bounce delay-500"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">Contact & Help</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto mt-2 mb-4"></div>
          <p className="text-yellow-200">We're here to help! Reach out to us anytime.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <span>📧</span> Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-yellow-200 mb-2 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-yellow-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-yellow-200 mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-yellow-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-yellow-200 mb-2 font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-200"
                >
                  <option value="" className="bg-gray-800">Select a category</option>
                  <option value="technical" className="bg-gray-800">Technical Support</option>
                  <option value="account" className="bg-gray-800">Account Issues</option>
                  <option value="games" className="bg-gray-800">Games & Features</option>
                  <option value="feedback" className="bg-gray-800">Feedback & Suggestions</option>
                  <option value="general" className="bg-gray-800">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-yellow-200 mb-2 font-medium">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-yellow-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-200"
                  placeholder="How can we help you?"
                />
              </div>

              <div>
                <label className="block text-sm text-yellow-200 mb-2 font-medium">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-yellow-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all duration-200 resize-none"
                  placeholder="Describe your question or issue in detail..."
                />
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-0"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Help & Info */}
          <div className="space-y-6">
            {/* Quick Help */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <span>❓</span> Quick Help
              </h3>
              <div className="space-y-3">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h4 className="font-medium text-white mb-1">How do I reset my password?</h4>
                  <p className="text-yellow-200 text-sm">Go to the sign-in page and click "Forgot Password" to receive a reset link.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h4 className="font-medium text-white mb-1">How do I earn more Eco-Points?</h4>
                  <p className="text-yellow-200 text-sm">Play games, complete quizzes, and participate in challenges to earn points and badges.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <h4 className="font-medium text-white mb-1">Can't access my account?</h4>
                  <p className="text-yellow-200 text-sm">Make sure your account is approved by an admin. Contact us if you're still having issues.</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <span>📞</span> Get in Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span>📧</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Email Support</div>
                    <div className="text-yellow-200 text-sm">help@ecovision.edu</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span>⏰</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Response Time</div>
                    <div className="text-yellow-200 text-sm">Within 24 hours</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                    <span>🌍</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">Support Hours</div>
                    <div className="text-yellow-200 text-sm">24/7 Online Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <span>📚</span> Helpful Resources
              </h3>
              <div className="space-y-2">
                <a href="#" className="block bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-200 text-yellow-200 hover:text-white">
                  <span className="font-medium">User Guide</span>
                  <span className="block text-sm opacity-75">Learn how to use EcoVision effectively</span>
                </a>
                <a href="#" className="block bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-200 text-yellow-200 hover:text-white">
                  <span className="font-medium">Game Tutorials</span>
                  <span className="block text-sm opacity-75">Tips and strategies for all games</span>
                </a>
                <a href="#" className="block bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-all duration-200 text-yellow-200 hover:text-white">
                  <span className="font-medium">Sustainability Guide</span>
                  <span className="block text-sm opacity-75">Learn more about eco-friendly practices</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
