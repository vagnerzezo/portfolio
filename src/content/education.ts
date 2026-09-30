import type { EducationContent } from "@/types/content";

export const education: EducationContent = {
  academic: [
    {
      institution: "Universidade do Vale do Rio dos Sinos (Unisinos)",
      degree: "Gestão da Tecnologia da Informação",
      period: "2024 — atual",
      status: "em-andamento",
    },
  ],
  // Mais recente primeiro. Adicione `href` (link do certificado) para exibir o "Ver ↗".
  courses: [
    { title: "Desenvolvimento Web com Vue e Vuex", provider: "Udemy", period: "2023 — 2024" },
    { title: "Google Analytics Certification", provider: "Skillshop with Google", period: "2023 — 2024" },
    { title: "Business Manager", provider: "Meta Blueprint", period: "2022 — 2023" },
    { title: "Governança de TI: gestão de demandas de serviços", provider: "Alura", period: "2022 — 2023" },
    { title: "JavaScript", provider: "Cod3r", period: "2022 — 2023" },
    { title: "Métricas ROI, Marketing", provider: "ComSchool", period: "2018 — 2019" },
    { title: "Gestão de E-commerce", provider: "Senac Brasil", period: "2017 — 2018" },
  ],
};
