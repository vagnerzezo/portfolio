"use client";

import { useActionState, useState, type FocusEvent, type FormEvent } from "react";
import { sendContact } from "@/app/actions/contact";
import { MagneticButton } from "@/components/motion/MagneticButton";
import {
  contactSchema,
  fieldErrorsFrom,
  HONEYPOT_FIELD,
  initialContactState,
  type ContactField,
  type ContactState,
} from "@/lib/validations/contact";

const FIELDS: { name: ContactField; label: string; type: "text" | "email" | "textarea"; autoComplete: string }[] = [
  { name: "name", label: "Nome", type: "text", autoComplete: "name" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { name: "message", label: "Mensagem", type: "textarea", autoComplete: "off" },
];

/*
 * <form action={formAction}> nativo: sem JavaScript o navegador faz um POST comum e a Server
 * Action responde igual (progressive enhancement). Com JS, validamos antes de enviar usando o
 * mesmo schema Zod do servidor, para dar feedback sem ida e volta à rede.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(sendContact, initialContactState);
  const [clientErrors, setClientErrors] = useState<ContactState["fieldErrors"] | null>(null);

  const errors = clientErrors ?? state.fieldErrors ?? {};

  const validate = (form: HTMLFormElement) => {
    const data = Object.fromEntries(new FormData(form));
    const result = contactSchema.safeParse(data);
    return result.success ? {} : (fieldErrorsFrom(result.error) ?? {});
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const found = validate(event.currentTarget);
    const first = FIELDS.find((field) => found[field.name]?.length);
    if (first) {
      event.preventDefault();
      setClientErrors(found);
      event.currentTarget.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      return;
    }
    setClientErrors(null);
  };

  // Depois de um erro, revalida ao sair do campo para o aviso sumir assim que for corrigido.
  const onBlur = (name: ContactField, event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const form = event.currentTarget.form;
    if (!errors[name]?.length || !form) return;
    const found = validate(form);
    setClientErrors({ ...errors, [name]: found[name] });
  };

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="relative grid gap-8">
      {FIELDS.map((field) => {
        const fieldErrors = errors[field.name];
        const errorId = `contact-${field.name}-error`;
        const common = {
          id: `contact-${field.name}`,
          name: field.name,
          required: true,
          autoComplete: field.autoComplete,
          defaultValue: state.values?.[field.name] ?? "",
          "aria-invalid": fieldErrors?.length ? true : undefined,
          "aria-describedby": fieldErrors?.length ? errorId : undefined,
          onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => onBlur(field.name, event),
          className:
            "w-full border-b border-ink-900/30 bg-transparent py-3 text-lg text-ink-900 outline-none transition-colors placeholder:text-ink-900/50 focus:border-ink-900 aria-invalid:border-[#b3261e]",
        };

        return (
          <div key={field.name} className="grid gap-2">
            <label htmlFor={common.id} className="font-mono text-xs tracking-[0.08em] text-ink-900/70 uppercase">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea {...common} rows={5} className={`${common.className} resize-y`} />
            ) : (
              <input {...common} type={field.type} />
            )}
            {fieldErrors?.length ? (
              <p id={errorId} className="text-sm text-[#b3261e]">
                {fieldErrors[0]}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* Honeypot: fora da tela e fora da ordem de Tab; pessoas não veem, bots preenchem. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`contact-${HONEYPOT_FIELD}`}>Não preencha este campo</label>
        <input id={`contact-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <MagneticButton>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-14 items-center gap-3 rounded-full bg-ink-900 px-8 font-medium text-bone transition-colors hover:bg-accent hover:text-bone disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Enviando…" : "Enviar mensagem"}
            <span aria-hidden="true">→</span>
          </button>
        </MagneticButton>

        <p role="status" aria-live="polite" className="text-sm text-ink-900">
          {pending ? "" : state.message}
        </p>
      </div>
    </form>
  );
}
