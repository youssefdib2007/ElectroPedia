import { Check, Copy, GraduationCap, Mail, Send, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useI18n } from '../i18n/I18nContext';

const CREATOR_EMAIL = 'youssefdib647@gmail.com';
const CONTACT_STORAGE_KEY = 'electropedia_contact_drafts_v1';

interface SavedInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export function ContactPage() {
  const { t } = useI18n();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedDraft, setSubmittedDraft] = useState<SavedInquiry | null>(null);
  const [history, setHistory] = useState<SavedInquiry[]>(() => {
    try {
      const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedInquiry[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage quota errors
    }
  }, [history]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CREATOR_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1800);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedName || !emailValid || !trimmedMessage) {
      setErrorMsg(t.pages.contact.validationError);
      return;
    }

    setErrorMsg('');
    const entry: SavedInquiry = {
      id: `${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      subject: subject.trim() || 'ElectroPedia Feedback',
      message: trimmedMessage,
      createdAt: new Date().toLocaleDateString(),
    };
    setHistory((prev) => [entry, ...prev.slice(0, 4)]);
    setSubmittedDraft(entry);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const buildMailtoHref = (draft: SavedInquiry) => {
    const body = `${draft.message}\n\n---\nFrom: ${draft.name} (${draft.email})`;
    return `mailto:${CREATOR_EMAIL}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div data-testid="page-contact">
      <section className="bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 py-12 lg:py-16 blueprint-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-3">
            <p className="font-mono-tech text-xs font-semibold text-[#2563EB] dark:text-[#00BFFF] uppercase tracking-wider">
              {t.pages.contact.eyebrow}
            </p>
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {t.pages.contact.title}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl">
              {t.pages.contact.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Direct Contact Column */}
            <Card className="lg:col-span-5 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {t.pages.contact.directTitle}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {t.pages.contact.directDesc}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 space-y-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                  <span>{t.pages.contact.emailLabel}</span>
                </p>
                <a
                  href={`mailto:${CREATOR_EMAIL}`}
                  dir="ltr"
                  className="block font-mono-tech text-sm font-bold text-[#2563EB] dark:text-[#00BFFF] hover:underline break-all"
                >
                  {CREATOR_EMAIL}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 dark:bg-[#1E293B] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#2563EB] cursor-pointer"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-[#22C55E]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                  <span>{copiedEmail ? t.pages.contact.emailCopied : t.pages.contact.copyEmail}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 space-y-1.5">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#00BFFF]" aria-hidden="true" />
                  <span>{t.pages.contact.instituteLabel}</span>
                </p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {t.pages.contact.instituteValue}
                </p>
              </div>
            </Card>

            {/* Inquiry Form Column */}
            <Card className="lg:col-span-7 bg-[#F8FAFC] dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 ring-0 p-6 space-y-5">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {t.pages.contact.formTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {t.pages.contact.formDesc}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      {t.pages.contact.nameLabel}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.pages.contact.namePlaceholder}
                      className="w-full h-11 px-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                    >
                      {t.pages.contact.emailFieldLabel}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.pages.contact.emailFieldPlaceholder}
                      className="w-full h-11 px-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t.pages.contact.subjectLabel}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t.pages.contact.subjectPlaceholder}
                    className="w-full h-11 px-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t.pages.contact.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.pages.contact.messagePlaceholder}
                    className="w-full p-3.5 bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {errorMsg && (
                  <p role="alert" className="text-xs font-semibold text-[#EF4444]">
                    {errorMsg}
                  </p>
                )}

                {submittedDraft && (
                  <div
                    role="status"
                    data-testid="contact-success"
                    className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2"
                  >
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      {t.pages.contact.successTitle}
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-200">
                      {t.pages.contact.successDesc}
                    </p>
                    <a
                      href={buildMailtoHref(submittedDraft)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{t.pages.contact.openMailBtn}</span>
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>{t.pages.contact.sendBtn}</span>
                </button>
              </form>

              {history.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      {t.pages.contact.recentTitle}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setHistory([])}
                      className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                      <span>{t.pages.contact.clearMessages}</span>
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {history.map((item) => (
                      <li
                        key={item.id}
                        className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {item.subject}
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 truncate">
                            {item.name} · {item.createdAt}
                          </p>
                        </div>
                        <a
                          href={buildMailtoHref(item)}
                          className="shrink-0 text-[#2563EB] dark:text-[#00BFFF] font-semibold hover:underline"
                        >
                          {t.pages.contact.openMailBtn}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
