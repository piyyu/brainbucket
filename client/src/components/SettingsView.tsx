import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, Palette, Shield, Save, Check } from "lucide-react";
import { useTheme } from "./theme-provider";

export const SettingsView = () => {
  const user = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }, []);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    // Update localStorage (in a real app, this would be an API call)
    const updatedUser = { ...user, username, email };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sections = [
    {
      title: "Profile",
      description: "Manage your personal information",
      icon: User,
      color: "text-blue-400",
      gradient: "from-blue-500/20 to-cyan-500/20",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary/30 border border-border/50 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary/30 border border-border/50 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Security",
      description: "Manage password and authentication",
      icon: Lock,
      color: "text-amber-400",
      gradient: "from-amber-500/20 to-orange-500/20",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg bg-secondary/30 border border-border/50 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg bg-secondary/30 border border-border/50 text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Notifications",
      description: "Configure how you receive notifications",
      icon: Bell,
      color: "text-violet-400",
      gradient: "from-violet-500/20 to-purple-500/20",
      content: (
        <div className="space-y-3">
          {["Email notifications", "Push notifications", "Weekly digest"].map((item) => (
            <label key={item} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50 cursor-pointer hover:bg-accent/20 transition-colors">
              <span className="text-[14px] text-foreground">{item}</span>
              <div className="w-9 h-5 rounded-full bg-foreground/20 relative transition-colors cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-foreground absolute top-0.5 left-0.5 transition-transform" />
              </div>
            </label>
          ))}
        </div>
      ),
    },
    {
      title: "Appearance",
      description: "Customize the look and feel",
      icon: Palette,
      color: "text-emerald-400",
      gradient: "from-emerald-500/20 to-teal-500/20",
      content: (
        <div className="space-y-3">
          <div>
            <label className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Theme</label>
            <div className="flex gap-2">
              {["dark", "light", "system"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t as "dark" | "light" | "system")}
                  className={`flex-1 h-10 rounded-lg text-[13px] font-medium transition-all cursor-pointer border capitalize ${theme === t
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-secondary/30 text-muted-foreground border-border/50 hover:border-border hover:text-foreground hover:bg-secondary/50"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Data & Privacy",
      description: "Manage your data and privacy settings",
      icon: Shield,
      color: "text-rose-400",
      gradient: "from-rose-500/20 to-pink-500/20",
      content: (
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg bg-secondary/20 border border-border/50 hover:bg-accent/20 transition-colors cursor-pointer">
            <p className="text-[14px] text-foreground font-medium">Export all data</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">Download your buckets and notes as JSON</p>
          </button>
          <button className="w-full text-left p-3 rounded-lg bg-destructive/5 border border-destructive/20 hover:bg-destructive/10 transition-colors cursor-pointer">
            <p className="text-[14px] text-destructive font-medium">Delete account</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">Permanently delete your account and all data</p>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-background bg-grid relative">
      <div className="absolute top-[10%] left-[-5%] w-[400px] h-[300px] bg-gradient-to-br from-blue-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl mx-auto px-4 py-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[22px] font-semibold text-foreground tracking-[-0.02em]">Settings</h1>
              <p className="text-[14px] text-muted-foreground mt-0.5">Manage your account and preferences</p>
            </div>
            <button
              onClick={handleSave}
              className={`h-9 px-4 rounded-lg text-[13px] font-medium transition-all cursor-pointer flex items-center gap-2
                ${saved
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-foreground text-background hover:bg-foreground/90 shadow-sm hover:shadow-md"
                }
              `}
            >
              {saved ? <><Check className="w-3.5 h-3.5" strokeWidth={2} /> Saved</> : <><Save className="w-3.5 h-3.5" strokeWidth={1.5} /> Save Changes</>}
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative p-5 rounded-xl border border-border/50 bg-secondary/10 backdrop-blur-sm overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-lg bg-secondary border border-border/50 flex items-center justify-center ${section.color} shrink-0`}>
                      <section.icon className="w-4 h-4" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold text-foreground">{section.title}</h3>
                      <p className="text-[12px] text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
