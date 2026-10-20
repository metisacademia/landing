import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf8f5]">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center">
            <AlertCircle className="h-8 w-8 text-[#c9a961]" />
            <h1 className="text-2xl font-medium text-[#0f2940]">Página não encontrada</h1>
          </div>
          <p className="mt-4 text-sm text-[#4a5568]">
            Este endereço não existe no site da Métis Academia da Mente.
          </p>
          <Link href="/" className="inline-block mt-6 text-[#0f2940] font-medium underline decoration-[#c9a961] underline-offset-4">
            Voltar ao início
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
