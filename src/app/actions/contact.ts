"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";
import {
  contactSchema,
  fieldErrorsFrom,
  HONEYPOT_FIELD,
  type ContactState,
} from "@/lib/validations/contact";

/*
 * Server Action do formulário. Roda só no servidor: a chave do Resend nunca chega ao browser,
 * e esta validação é a que vale (a do client é só conforto, pode ser contornada).
 * Assinatura (estadoAnterior, formData) é a exigida pelo useActionState.
 */
export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot preenchido = bot. Responde "sucesso" para ele não saber que foi barrado.
  if (String(formData.get(HONEYPOT_FIELD) ?? "") !== "") {
    return { status: "success", message: "Mensagem enviada! Respondo em breve." };
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise os campos destacados.",
      fieldErrors: fieldErrorsFrom(parsed.error),
      values: raw,
    };
  }

  // Na Vercel o IP real do visitante é o primeiro da lista do x-forwarded-for.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success: allowed } = await rateLimit(ip);
  if (!allowed) {
    return {
      status: "error",
      message: "Muitas mensagens em pouco tempo. Tente de novo em alguns minutos.",
      values: raw,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("[contact] RESEND_API_KEY ou CONTACT_TO_EMAIL não configurados.");
    return {
      status: "error",
      message: "O envio está indisponível no momento. Use o e-mail ao lado.",
      values: raw,
    };
  }

  const { name, email, message } = parsed.data;
  const { error } = await new Resend(apiKey).emails.send({
    // O remetente precisa ser de um domínio verificado no Resend; o do visitante vai no replyTo
    // (usar o e-mail dele no `from` seria falsificar remetente e cairia em spam/bloqueio).
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `Contato pelo portfolio — ${name}`,
    text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
  });

  if (error) {
    console.error("[contact] Falha no Resend:", error);
    return {
      status: "error",
      message: "Não consegui enviar agora. Tente de novo ou use o e-mail ao lado.",
      values: raw,
    };
  }

  return { status: "success", message: "Mensagem enviada! Respondo em breve." };
}
