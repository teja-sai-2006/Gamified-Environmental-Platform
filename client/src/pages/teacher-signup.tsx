import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export default function TeacherSignupWizard() {
  const { setRole } = useAuth();
  const [, navigate] = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    id: "",
    username: "",
    schoolId: "",
    subject: "",
    photoDataUrl: "",
    password: "",
    confirmPassword: "",
  });
  const [usernameStatus, setUsernameStatus] = useState<"unknown" | "checking" | "available" | "taken">("unknown");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  async function checkUsername() {
    if (!form.username) return;
    setUsernameStatus('checking');
    try {
      const res = await fetch(`/api/username-available/${encodeURIComponent(form.username)}`).then(r => r.json());
      setUsernameStatus(res.available ? 'available' : 'taken');
    } catch {
      setUsernameStatus('unknown');
    }
  }

  async function requestOtp() {
    if (!form.email) return;
    await fetch('/api/otp/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email }) });
    setOtpSent(true);
  }

  const submit = async () => {
    const sanitized = otpCode.replace(/\D/g, '').slice(0, 6);
    if (sanitized.length !== 6) {
      alert('Please enter the 6-digit OTP sent to your email.');
      return;
    }
    if (!form.password || form.password.length < 6) {
      alert('Please set a password with at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      const avail = await fetch(`/api/username-available/${encodeURIComponent(form.username)}`).then(r => r.json());
      if (!avail.available) {
        alert('Username is taken. Please choose another.');
        return;
      }
    } catch {}

    setSubmitting(true);
    const verify = await fetch('/api/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, code: sanitized }) }).then(r => r.json());
    if (!verify.ok) {
      setSubmitting(false);
      alert('Invalid OTP. Please try again.');
      return;
    }

    await fetch('/api/signup/teacher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        username: form.username,
        schoolId: form.schoolId,
        id: form.id,
        subject: form.subject,
        photoDataUrl: form.photoDataUrl,
        password: form.password,
      })
    });
    setSubmitting(false);
    alert('Application submitted. Please wait for admin approval. You can sign in after approval.');
    navigate('/signin');
  };

  return (
    <div 
      className="min-h-screen bg-space-gradient p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(/api/image/foster-lake (1).jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-24 left-32 w-36 h-36 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-28 h-28 bg-indigo-400 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-2/3 left-1/4 w-20 h-20 bg-violet-400 rounded-full animate-pulse delay-1200"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">Teacher Sign Up</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full mx-auto mt-2 mb-4"></div>
          <p className="text-purple-200">Join EcoVision as an educator and inspire the next generation</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-8">
            <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-white">Personal Information</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LabeledInput label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} helper="Example: Jane Smith" />
                <LabeledInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} helper="OTP will be sent to this email" disabled={otpSent} />
                <LabeledInput label="Teacher ID" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} helper="Set your own unique ID" />
                <LabeledInput label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} helper="Example: Mathematics, Science" />
              </div>
            </section>

            <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-white">School Information</h2>
              <SchoolPicker value={form.schoolId} onChange={(v) => setForm({ ...form, schoolId: v })} helper="Don't see yours? Ask admin to add your school." />
            </section>

            <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-white">Account Setup</h2>
              <div className="space-y-4">
                <LabeledInput
                  label="Unique Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  onBlur={checkUsername}
                  helper="This must be unique. Example: jane_smith_01"
                />
                <div className="flex items-center gap-3">
                  <Button 
                    variant="secondary" 
                    onClick={checkUsername} 
                    disabled={!form.username || usernameStatus === 'checking'}
                    className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/20"
                  >
                    {usernameStatus === 'checking' ? 'Checking…' : 'Check Username'}
                  </Button>
                  {usernameStatus === 'available' && <span className="text-green-400 text-sm font-medium">✓ Available</span>}
                  {usernameStatus === 'taken' && <span className="text-red-400 text-sm font-medium">✗ Taken</span>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <LabeledInput label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} helper="At least 6 characters" />
                  <LabeledInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                </div>
              </div>
            </section>

            <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-white">Profile Photo</h2>
              <PhotoInput label="Upload Profile Photo" value={form.photoDataUrl} onChange={(v) => setForm({ ...form, photoDataUrl: v })} />
            </section>

            <section className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-white">Verify Email</h2>
              <p className="text-purple-200 text-sm mb-4">We'll send a one-time code to your email.</p>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Button 
                  variant="secondary" 
                  onClick={requestOtp} 
                  disabled={!form.email || otpSent}
                  className="bg-purple-500/20 backdrop-blur-sm text-white hover:bg-purple-500/30 border border-purple-400/20"
                >
                  {otpSent ? '✓ OTP Sent' : 'Send OTP to Email'}
                </Button>
                {otpSent && (
                  <input
                    placeholder="Enter 6-digit OTP"
                    className="rounded-lg px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-purple-200 w-48"
                    value={otpCode}
                    maxLength={6}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                )}
              </div>
              {otpSent && <p className="text-purple-200 text-xs">OTP sent to: <span className="text-white font-medium">{form.email}</span></p>}
            </section>

            <div className="pt-4 text-center">
              <Button 
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-0" 
                onClick={submit} 
                disabled={submitting || usernameStatus === 'taken' || !otpCode}
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </Button>
              <p className="mt-3 text-purple-200 text-sm">After submission, your application will be pending until an admin approves it.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange, onBlur, helper, type, disabled }: { 
  label: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  onBlur?: () => void; 
  helper?: string; 
  type?: string; 
  disabled?: boolean 
}) {
  return (
    <label className="block">
      <span className="block text-sm text-purple-200 mb-2 font-medium">{label}</span>
      <input 
        className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-purple-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-200" 
        value={value} 
        onChange={onChange} 
        onBlur={onBlur} 
        type={type}
        disabled={disabled} 
      />
      {helper && <span className="block text-xs text-purple-300 mt-1">{helper}</span>}
    </label>
  );
}

function PhotoInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  return (
    <label className="block">
      <span className="block text-sm text-purple-200 mb-2 font-medium">{label}</span>
      <input 
        type="file" 
        accept="image/*" 
        onChange={onFile} 
        className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-purple-500/20 file:text-white hover:file:bg-purple-500/30 transition-all duration-200" 
      />
      {value && (
        <div className="mt-3 flex items-center gap-3">
          <img src={value} alt="Preview" className="h-16 w-16 object-cover rounded-full border-2 border-white/20" />
          <span className="text-green-400 text-sm">✓ Photo uploaded</span>
        </div>
      )}
    </label>
  );
}

function SchoolPicker({ value, onChange, helper }: { value: string; onChange: (v: string) => void; helper?: string }) {
  const [schools, setSchools] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/schools')
      .then(r => r.json())
      .then(data => { if (mounted) setSchools(data || []); })
      .catch(() => { if (mounted) setError('Failed to load schools'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <label className="block">
      <span className="block text-sm text-purple-200 mb-2 font-medium">School</span>
      <select 
        className="w-full rounded-lg px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-200" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" className="bg-gray-800">{loading ? 'Loading…' : error ? 'Failed to load' : 'Select school…'}</option>
        {schools.map((s) => (
          <option key={s.id} value={s.id} className="bg-gray-800">{s.name}</option>
        ))}
      </select>
      {helper && <span className="block text-xs text-purple-300 mt-1">{helper}</span>}
    </label>
  );
}
