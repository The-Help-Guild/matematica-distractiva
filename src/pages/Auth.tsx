import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Sparkles } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Numele trebuie să aibă cel puțin 2 caractere")
    .max(50, "Numele trebuie să aibă maxim 50 caractere")
    .regex(/^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/, "Numele poate conține doar litere, spații și liniuțe"),
  email: z
    .string()
    .trim()
    .email("Adresa de email nu este validă")
    .max(255, "Email-ul trebuie să aibă maxim 255 caractere"),
  password: z
    .string()
    .min(8, "Parola trebuie să aibă cel puțin 8 caractere")
    .max(100, "Parola trebuie să aibă maxim 100 caractere"),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Adresa de email nu este validă")
    .max(255, "Email-ul trebuie să aibă maxim 255 caractere"),
  password: z.string().min(1, "Parola este obligatorie"),
});

const Auth = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = signupSchema.safeParse({
      displayName,
      email,
      password,
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error("Date invalide", { description: firstError.message });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: validation.data.email,
      password: validation.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: validation.data.displayName,
        },
      },
    });

    setLoading(false);

    if (error) {
      toast.error("Eroare la înregistrare", { description: error.message });
    } else {
      toast.success("Cont creat cu succes!", { description: "Te poți autentifica acum." });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse({
      email,
      password,
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error("Date invalide", { description: firstError.message });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    setLoading(false);

    if (error) {
      toast.error("Eroare la autentificare", { description: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl gradient-hero bg-clip-text text-transparent">
              Bine ai venit!
            </CardTitle>
            <Sparkles className="w-8 h-8 text-secondary" />
          </div>
          <CardDescription>
            Înregistrează-te sau autentifică-te pentru a începe să înveți matematică
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Autentificare</TabsTrigger>
              <TabsTrigger value="signup">Înregistrare</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="email@exemplu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Parolă</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Se încarcă..." : "Autentificare"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nume</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Numele tău"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="email@exemplu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Parolă</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Se încarcă..." : "Creează cont"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
