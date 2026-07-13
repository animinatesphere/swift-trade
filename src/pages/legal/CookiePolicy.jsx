import LegalLayout, { Section, List } from "./LegalLayout";

export default function CookiePolicy() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="COOKIE POLICY"
      updated="July 2026"
    >
      <Section title="1. What Are Cookies">
        Cookies are small text files stored on your device when you visit a
        website. They help the website remember information about your visit,
        such as your preferences and login state.
      </Section>

      <Section title="2. How We Use Cookies">
        <List
          items={[
            "Essential cookies — required to keep you logged in and to secure your session.",
            "Preference cookies — remember settings like your display preferences.",
            "Analytics cookies — help us understand how visitors use Swift Trade so we can improve the platform.",
          ]}
        />
      </Section>

      <Section title="3. Managing Cookies">
        Most browsers let you control cookies through their settings,
        including blocking or deleting them. Disabling essential cookies may
        prevent you from logging in or using core features of Swift Trade.
      </Section>

      <Section title="4. Third-Party Cookies">
        Some cookies may be set by trusted third parties who provide
        analytics or identity verification services on our behalf. These
        providers are bound by confidentiality and data protection
        obligations.
      </Section>

      <Section title="5. Changes to This Policy">
        We may update this Cookie Policy from time to time to reflect
        changes in the cookies we use or for legal reasons. Updates will be
        posted on this page.
      </Section>

      <Section title="6. Contact Us">
        Questions about our use of cookies can be sent via our{" "}
        <a href="/contact" style={{ color: "#0ECB81", fontWeight: 600 }}>
          Contact page
        </a>
        .
      </Section>
    </LegalLayout>
  );
}
