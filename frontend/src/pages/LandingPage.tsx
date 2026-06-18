import { useState, type FormEvent } from "react";
import { GlassPanel } from "../components/ui/GlassPanel";
import { Icon } from "../components/ui/Icon";
import { CircularProgress } from "../components/ui/CircularProgress";
import { submitEnquiry } from "../lib/api/enquiry";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=70";
const CHILLI_IMAGE =
  "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=800&q=80";
const MANGO_IMAGE =
  "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80";
const CASHEW_IMAGE =
  "https://images.unsplash.com/photo-1573555657105-47a0bb37c3ea?auto=format&fit=crop&w=800&q=80";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingPage() {
  const [form, setForm] = useState({ name: "", company: "", email: "", product: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleEnquiry(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await submitEnquiry(form);
      setStatus("sent");
      setForm({ name: "", company: "", email: "", product: "", message: "" });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Could not send your enquiry. Please try again.";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-gutter"
      >
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-35 contrast-125 grayscale-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
          <div className="glow-radial absolute inset-0" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary-fixed/30 bg-primary-container/60 px-4 py-1.5 font-label-sm text-label-sm text-secondary-fixed">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary-fixed animate-pulse" />
            Manica Province, Mozambique
          </span>

          <h1 className="mb-6 font-display-lg text-display-lg-mobile text-white drop-shadow-2xl md:text-display-lg">
            Premium Dried Produce,{" "}
            <span className="text-secondary-fixed">From Mozambique to the World.</span>
          </h1>

          <p className="mb-12 max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            We source, dry, and export the finest chillies, mangos, and cashew
            nuts from our facility in Manica Province. Natural drying. Rigorous
            sorting. Export-grade quality.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => scrollTo("products")}
              className="rounded-lg bg-secondary-fixed px-10 py-4 font-label-md text-label-md text-on-secondary-fixed transition-all neon-glow active:scale-95"
            >
              Our Products
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="rounded-lg border border-outline-variant/50 px-10 py-4 font-label-md text-label-md text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              Get in Touch
            </button>
          </div>
        </div>

        <button
          onClick={() => scrollTo("products")}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 animate-bounce flex-col items-center gap-2 text-on-surface-variant"
          aria-label="Scroll down"
        >
          <span className="font-label-sm text-label-sm">EXPLORE</span>
          <Icon name="expand_more" />
        </button>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section id="products" className="px-gutter py-xl">
        <div className="mb-16 text-center">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
            What We Export
          </p>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
            Our Products
          </h2>
        </div>

        <div className="mx-auto grid max-w-container-max gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Dried Chillies */}
          <GlassPanel className="group relative overflow-hidden transition-colors hover:border-secondary-fixed">
            <div className="relative h-56 overflow-hidden rounded-t-xl">
              <img
                src={CHILLI_IMAGE}
                alt="Dried red chillies"
                className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed/20 px-3 py-1 font-label-sm text-label-sm text-secondary-fixed ring-1 ring-secondary-fixed/30">
                  <Icon name="local_fire_department" filled className="text-[16px]" />
                  Sorted &amp; Graded
                </span>
              </div>
            </div>
            <div className="p-lg">
              <h3 className="mb-3 font-headline-lg-mobile text-headline-lg-mobile text-white">
                Dried Chillies
              </h3>
              <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
                Hand-sorted and graded dried chillies from local farms across
                Manica Province. We process and pack multiple varieties to
                strict export specifications, supplying spice importers and
                food manufacturers globally.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Sorted", desc: "Multiple grades" },
                  { label: "Cleaned", desc: "Dust &amp; debris free" },
                  { label: "Packed", desc: "Export-ready bags" },
                ].map((spec) => (
                  <div key={spec.label} className="rounded-lg bg-primary-container/50 p-3 text-center">
                    <div className="font-label-md text-label-md text-secondary-fixed">{spec.label}</div>
                    <div
                      className="mt-0.5 font-label-sm text-label-sm text-on-surface-variant"
                      dangerouslySetInnerHTML={{ __html: spec.desc }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>

          {/* Dried Mangos */}
          <GlassPanel className="group relative overflow-hidden transition-colors hover:border-secondary-fixed">
            <div className="relative h-56 overflow-hidden rounded-t-xl">
              <img
                src={MANGO_IMAGE}
                alt="Dried mango slices"
                className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed/20 px-3 py-1 font-label-sm text-label-sm text-secondary-fixed ring-1 ring-secondary-fixed/30">
                  <Icon name="wb_sunny" filled className="text-[16px]" />
                  Naturally Dried
                </span>
              </div>
            </div>
            <div className="p-lg">
              <h3 className="mb-3 font-headline-lg-mobile text-headline-lg-mobile text-white">
                Dried Mangos
              </h3>
              <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
                Naturally dried mango slices from the lush orchards of Manica
                Province. Our controlled drying process preserves the fruit's
                natural sweetness and colour, meeting international food
                safety and quality standards.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Natural", desc: "No additives" },
                  { label: "Low moisture", desc: "&lt;14% water activity" },
                  { label: "Sliced", desc: "Uniform cuts" },
                ].map((spec) => (
                  <div key={spec.label} className="rounded-lg bg-primary-container/50 p-3 text-center">
                    <div className="font-label-md text-label-md text-secondary-fixed">{spec.label}</div>
                    <div
                      className="mt-0.5 font-label-sm text-label-sm text-on-surface-variant"
                      dangerouslySetInnerHTML={{ __html: spec.desc }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>

          {/* Dried Cashew Nuts */}
          <GlassPanel className="group relative overflow-hidden transition-colors hover:border-secondary-fixed">
            <div className="relative h-56 overflow-hidden rounded-t-xl">
              <img
                src={CASHEW_IMAGE}
                alt="Dried cashew nuts"
                className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-fixed/20 px-3 py-1 font-label-sm text-label-sm text-secondary-fixed ring-1 ring-secondary-fixed/30">
                  <Icon name="eco" filled className="text-[16px]" />
                  Whole Kernels
                </span>
              </div>
            </div>
            <div className="p-lg">
              <h3 className="mb-3 font-headline-lg-mobile text-headline-lg-mobile text-white">
                Dried Cashew Nuts
              </h3>
              <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
                Whole dried cashew kernels sourced from Manica Province.
                Shell-off and graded to international specifications, our
                cashews meet the quality requirements of food processors,
                snack manufacturers, and bulk commodity traders worldwide.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Shell-off", desc: "Whole kernels" },
                  { label: "Graded", desc: "By size &amp; colour" },
                  { label: "Packed", desc: "Moisture-safe bags" },
                ].map((spec) => (
                  <div key={spec.label} className="rounded-lg bg-primary-container/50 p-3 text-center">
                    <div className="font-label-md text-label-md text-secondary-fixed">{spec.label}</div>
                    <div
                      className="mt-0.5 font-label-sm text-label-sm text-on-surface-variant"
                      dangerouslySetInnerHTML={{ __html: spec.desc }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ── About / Facility ─────────────────────────────────── */}
      <section id="about" className="px-gutter py-xl">
        <div className="mx-auto max-w-container-max">
          <div className="mb-16 text-center">
            <p className="mb-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
              Who We Are
            </p>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
              Rooted in Manica Province
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Story text */}
            <GlassPanel className="flex flex-col justify-center p-lg">
              <Icon name="warehouse" filled className="mb-6 text-[48px] text-secondary-fixed" />
              <h3 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-white">
                Our Facility
              </h3>
              <p className="mb-4 font-body-md text-body-md text-on-surface-variant">
                AgriFetch operates a dedicated processing facility in Manica
                Province — a region renowned for its fertile soils and
                consistent climate, ideal for producing high-quality
                agricultural commodities.
              </p>
              <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
                Our warehouse is equipped for the controlled drying of mangos,
                the cleaning, sorting, and grading of dried chillies, and the
                shelling, grading, and packing of cashew nuts. Every batch is
                inspected before packing to ensure it meets international
                export standards.
              </p>
              <div className="flex items-center gap-3 font-label-md text-label-md text-secondary-fixed">
                <Icon name="location_on" filled className="text-[20px]" />
                Manica Province, Mozambique
              </div>
            </GlassPanel>

            {/* Location card + stats */}
            <div className="flex flex-col gap-6">
              {/* Map placeholder */}
              <GlassPanel className="flex min-h-40 flex-col items-center justify-center gap-3 p-lg">
                <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-primary-container/40">
                  <Icon name="map" filled className="text-[64px] text-secondary-fixed/30" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-secondary-fixed/20 px-4 py-2 font-label-md text-label-md text-secondary-fixed ring-1 ring-secondary-fixed/30">
                      <Icon name="location_on" filled className="text-[18px]" />
                      Manica Province, Mozambique
                    </span>
                    <p className="mt-2 font-label-sm text-label-sm text-on-surface-variant">
                      Bordering Zimbabwe · Central-Eastern Africa
                    </p>
                  </div>
                </div>
              </GlassPanel>

              {/* Stat trio */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "storefront", value: "2", label: "Products" },
                  { icon: "public", value: "Global", label: "Export reach" },
                  { icon: "verified", value: "100%", label: "Natural process" },
                ].map((s) => (
                  <GlassPanel key={s.label} className="flex flex-col items-center p-md text-center">
                    <Icon name={s.icon} filled className="mb-2 text-[28px] text-secondary-fixed" />
                    <div className="font-headline-lg-mobile text-headline-lg-mobile text-white">
                      {s.value}
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">
                      {s.label}
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section id="process" className="px-gutter py-xl">
        <div className="mb-16 text-center">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
            How It Works
          </p>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
            From Farm to Export
          </h2>
        </div>

        <div className="mx-auto grid max-w-container-max gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "01",
              icon: "grass",
              title: "Local Sourcing",
              body: "We partner directly with smallholder farmers across Manica Province, ensuring fair prices and consistent supply of fresh chillies, ripe mangos, and cashew nuts at harvest.",
            },
            {
              step: "02",
              icon: "wb_sunny",
              title: "Drying & Processing",
              body: "Mangos are sliced and dried under controlled conditions to achieve the optimal moisture level. Chillies and cashews are received and taken straight to sorting and grading.",
            },
            {
              step: "03",
              icon: "filter_list",
              title: "Sorting & Grading",
              body: "Every batch is hand-inspected. Chillies are sorted by size, colour, and quality grade. Mango slices are checked for uniformity and moisture. Cashews are graded by kernel size and colour.",
            },
            {
              step: "04",
              icon: "flight_takeoff",
              title: "Packing & Export",
              body: "Finished product is packed in export-grade bags, labelled to specification, and dispatched to international buyers via established freight channels.",
            },
          ].map((step, i) => (
            <GlassPanel
              key={step.step}
              className="group relative flex flex-col p-lg transition-colors hover:border-secondary-fixed"
            >
              <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/40 bg-surface-container font-label-md text-label-md text-secondary-fixed">
                {step.step}
              </div>
              {/* Connector line on desktop */}
              {i < 3 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-outline-variant/40 lg:block" />
              )}
              <Icon
                name={step.icon}
                filled
                className="mb-6 text-[40px] text-secondary-fixed transition-transform duration-200 group-hover:scale-110"
              />
              <h3 className="mb-3 font-headline-lg-mobile text-headline-lg-mobile text-white">
                {step.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{step.body}</p>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* ── Quality Metrics ──────────────────────────────────── */}
      <section className="px-gutter py-xl">
        <div className="mx-auto max-w-container-max">
          <GlassPanel className="p-lg md:p-xl">
            <div className="mb-12 text-center">
              <p className="mb-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
                Our Standards
              </p>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
                Quality You Can Rely On
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <CircularProgress
                value={100}
                label="Natural Processing"
                caption="No artificial additives"
              />
              <CircularProgress
                value={95}
                label="Grade-A Output"
                caption="Per batch inspection"
              />
              <CircularProgress
                value={98}
                label="Export Compliance"
                caption="Meets intl. standards"
              />
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ── Why AgriFetch ────────────────────────────────────── */}
      <section className="px-gutter py-xl">
        <div className="mb-16 text-center">
          <p className="mb-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
            Why Source With Us
          </p>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg">
            The AgriFetch Difference
          </h2>
        </div>

        <div className="mx-auto grid max-w-container-max gap-6 md:grid-cols-12">
          <GlassPanel className="group relative overflow-hidden p-lg transition-colors hover:border-secondary-fixed md:col-span-8">
            <div className="absolute -right-20 -top-20 h-64 w-64 bg-secondary-fixed/10 blur-[80px] transition-all group-hover:bg-secondary-fixed/20" />
            <div className="flex h-full flex-col">
              <Icon name="handshake" filled className="mb-6 text-[48px] text-secondary-fixed" />
              <h3 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-white">
                Direct from the Source
              </h3>
              <p className="max-w-lg font-body-md text-body-md text-on-surface-variant">
                No middlemen. We work directly with farmers in Manica Province,
                process in our own facility, and export under our own brand.
                This means better prices for buyers, better margins for
                farmers, and full traceability of every shipment.
              </p>
            </div>
          </GlassPanel>

          <GlassPanel className="flex flex-col p-lg transition-colors hover:border-secondary-fixed md:col-span-4">
            <Icon name="eco" filled className="mb-6 text-[48px] text-secondary-fixed" />
            <h3 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-white">
              Sustainably Grown
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We prioritise working with smallholder farmers who use
              responsible farming practices, supporting local livelihoods
              while protecting the land.
            </p>
          </GlassPanel>

          <GlassPanel className="flex flex-col p-lg transition-colors hover:border-secondary-fixed md:col-span-4">
            <Icon name="inventory_2" filled className="mb-6 text-[48px] text-secondary-fixed" />
            <h3 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-white">
              Flexible Quantities
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Whether you need a trial container or a full season's supply,
              we accommodate orders of all sizes with consistent lead times.
            </p>
          </GlassPanel>

          <GlassPanel className="flex flex-col p-lg transition-colors hover:border-secondary-fixed md:col-span-8">
            <Icon name="support_agent" filled className="mb-6 text-[48px] text-secondary-fixed" />
            <h3 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-white">
              Dedicated Export Support
            </h3>
            <p className="max-w-lg font-body-md text-body-md text-on-surface-variant">
              From documentation to freight coordination, our team handles the
              logistics so your product arrives on time with all the correct
              phytosanitary certificates and export paperwork.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────── */}
      <section id="contact" className="px-gutter py-xl">
        <div className="mx-auto max-w-container-max">
          <GlassPanel className="glow-radial overflow-hidden p-lg md:p-xl">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact info */}
              <div className="flex flex-col justify-center">
                <p className="mb-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary-fixed">
                  Get in Touch
                </p>
                <h2 className="mb-6 font-headline-lg-mobile text-headline-lg-mobile text-white md:font-headline-lg md:text-headline-lg">
                  Ready to Source with AgriFetch?
                </h2>
                <p className="mb-8 font-body-md text-body-md text-on-surface-variant">
                  Whether you're a food importer, distributor, or manufacturer
                  looking for premium dried chillies or mangos, we'd love to
                  hear from you. Send us a message and our team will get back
                  to you within one business day.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: "location_on", text: "Manica Province, Mozambique" },
                    { icon: "mail", text: "exports@agrifetch.co.mz" },
                    { icon: "language", text: "www.agrifetch.co.mz" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container/60 text-secondary-fixed">
                        <Icon name={item.icon} filled className="text-[20px]" />
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enquiry form */}
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-secondary-fixed/30 bg-primary-container/40 p-10 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-fixed/20">
                    <Icon name="check_circle" filled className="text-[40px] text-secondary-fixed" />
                  </span>
                  <h3 className="font-headline-lg-mobile text-headline-lg-mobile text-white">
                    Enquiry Sent!
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Thank you — we'll get back to you within one business day.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 rounded-lg border border-outline-variant/40 px-6 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:border-secondary-fixed/40 hover:text-secondary-fixed"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquiry} className="flex flex-col gap-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">
                        Full Name <span className="text-secondary-fixed">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jane Smith"
                        value={form.name}
                        onChange={set("name")}
                        className="rounded-lg border-[0.5px] border-outline-variant/40 bg-surface-container-lowest/70 px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-secondary-fixed/50 focus:outline-none focus:ring-1 focus:ring-secondary-fixed/40"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-label-sm text-on-surface-variant">
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="Your Company"
                        value={form.company}
                        onChange={set("company")}
                        className="rounded-lg border-[0.5px] border-outline-variant/40 bg-surface-container-lowest/70 px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-secondary-fixed/50 focus:outline-none focus:ring-1 focus:ring-secondary-fixed/40"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">
                      Email Address <span className="text-secondary-fixed">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={set("email")}
                      className="rounded-lg border-[0.5px] border-outline-variant/40 bg-surface-container-lowest/70 px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-secondary-fixed/50 focus:outline-none focus:ring-1 focus:ring-secondary-fixed/40"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">
                      Product Interest
                    </label>
                    <select
                      value={form.product}
                      onChange={set("product")}
                      className="rounded-lg border-[0.5px] border-outline-variant/40 bg-surface-container-lowest/70 px-4 py-3 font-body-md text-body-md text-on-surface focus:border-secondary-fixed/50 focus:outline-none focus:ring-1 focus:ring-secondary-fixed/40"
                    >
                      <option value="">Select a product…</option>
                      <option value="Dried Chillies">Dried Chillies</option>
                      <option value="Dried Mangos">Dried Mangos</option>
                      <option value="Dried Cashew Nuts">Dried Cashew Nuts</option>
                      <option value="All Products">All Products</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">
                      Message <span className="text-secondary-fixed">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Tell us about your requirements — volumes, specifications, delivery schedule…"
                      value={form.message}
                      onChange={set("message")}
                      className="resize-none rounded-lg border-[0.5px] border-outline-variant/40 bg-surface-container-lowest/70 px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:border-secondary-fixed/50 focus:outline-none focus:ring-1 focus:ring-secondary-fixed/40"
                    />
                  </div>

                  {status === "error" && (
                    <p className="flex items-center gap-2 rounded-lg bg-error/10 px-4 py-3 font-body-sm text-body-sm text-error">
                      <Icon name="error" filled className="shrink-0 text-[18px]" />
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="flex items-center justify-center gap-2 rounded-lg bg-secondary-fixed px-8 py-4 font-label-md text-label-md text-on-secondary-fixed transition-all neon-glow active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>
                        <Icon name="progress_activity" className="animate-spin text-[18px]" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Icon name="send" className="text-[18px]" />
                        Send Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-outline-variant/20 px-gutter py-md">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Icon name="agriculture" filled className="text-secondary-fixed text-[22px]" />
            <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-secondary-fixed">
              AgriFetch
            </span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            © 2025 AgriFetch · Manica Province, Mozambique · All rights reserved
          </p>
          <div className="flex gap-6">
            {["Products", "About", "Process", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                className="font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-secondary-fixed"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
