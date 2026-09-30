import { z } from "zod";

/*
 * Schema único do formulário, importado pelo ContactForm (feedback imediato no client)
 * e pela Server Action (a validação que vale). Mudar uma regra aqui muda nos dois lados.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome (mínimo de 2 caracteres).")
    .max(80, "O nome pode ter no máximo 80 caracteres."),
  email: z.string().trim().pipe(z.email("Informe um e-mail válido.")),
  message: z
    .string()
    .trim()
    .min(10, "A mensagem precisa ter pelo menos 10 caracteres.")
    .max(2000, "A mensagem pode ter no máximo 2000 caracteres."),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Nome do campo honeypot: invisível para pessoas, bots costumam preencher. */
export const HONEYPOT_FIELD = "website";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ContactField, string[]>>;
  /** Valores enviados, para repopular o form quando der erro (inclusive sem JavaScript). */
  values?: Partial<ContactInput>;
};

export const initialContactState: ContactState = { status: "idle" };

export function fieldErrorsFrom(error: z.ZodError<ContactInput>): ContactState["fieldErrors"] {
  return z.flattenError(error).fieldErrors;
}
