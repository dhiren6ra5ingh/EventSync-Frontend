import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Users, Wallet, ShieldCheck, PartyPopper, Building2, Cake, Music } from "lucide-react";
import api from "../api/axiosInstance";
import Reveal from "../components/Reveal";
import HeroIllustration from "../components/HeroIllustration";
import FloatingPetals from "../components/FloatingPetals";
import StatCounter from "../components/StatCounter";
import TestimonialCarousel from "../components/TestimonialCarousel";
import ScallopDivider from "../components/ScallopDivider";
import weddingImg from "../assets/wedding.jpg";
import corporateImg from "../assets/corporate.jpg";
import birthdayImg from "../assets/birthday.jpg";
import partyImg from "../assets/party.jpg";
import FaqAccordion from "../components/FaqAccordion";
function LandingPage() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/public/packages")
      .then((res) => setPackages(res.data))
      .catch(() => setPackages([]));
  }, []);

  const features = [
    { icon: CalendarCheck, title: "No double-booking", body: "Every vendor's schedule is checked automatically, so nothing ever clashes on the day." },
    { icon: Users, title: "One team, one plan", body: "Caterers, decorators and every other vendor coordinated from a single timeline." },
    { icon: Wallet, title: "Clear budgets", body: "See exactly what's allocated, spent, and what's left — no surprise bills." },
    { icon: ShieldCheck, title: "You stay informed", body: "Track your event's progress in real time, from booking to the final table setting." },
  ];

  const eventTypes = [
  { label: "Weddings", image: weddingImg },
  { label: "Corporate events", image: corporateImg },
  { label: "Birthdays", image: birthdayImg },
  { label: "Private parties", image: partyImg },
];

  const testimonials = [
    { quote: "They kept three vendors perfectly in sync for our wedding — nothing overlapped, nothing was late.", name: "Ananya R." },
    { quote: "I could see exactly where my budget was going the whole time. No end-of-event surprises.", name: "Karan M." },
    { quote: "Our conference setup ran without a single scheduling hiccup.", name: "Priya S." },
  ];

  const faqs = [
  {
    q: "How do I get an event started?",
    a: "Register for a free account, then submit a request with your event's date, time, and guest count. Our team reviews it and assigns a vendor to match.",
  },
  {
    q: "What if my preferred date isn't available?",
    a: "We check every vendor's schedule automatically before confirming, so you'll know quickly if adjustments are needed — no last-minute surprises.",
  },
  {
    q: "Can I see how my budget is being spent?",
    a: "Yes. Once your event is confirmed, your dashboard shows exactly what's allocated, what's spent, and what's left, at any time.",
  },
  {
    q: "Do I need to pick a package?",
    a: "No — packages are just a starting point. You can also describe a fully custom event when you submit your request.",
  },
  {
    q: "How do vendors get added to the platform?",
    a: "Vendors are onboarded directly by our team, so every vendor you're matched with has already been vetted.",
  },
];


  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>

      {/* Header */}
      <div className="landing-header sticky-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px" }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: 600, color: "var(--ink)" }}>
          EventSync
        </span>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="secondary" onClick={() => navigate("/login")}>Log in</button>
          <button onClick={() => navigate("/register")}>Get started</button>
        </div>
      </div>

      {/* Hero, with drifting petals behind it */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <FloatingPetals count={12} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", padding: "60px 24px 60px", maxWidth: "900px", margin: "0 auto", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px", textAlign: "left", minWidth: "280px" }}>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "42px", lineHeight: 1.2, margin: 0 }}>
              Every vendor, every detail, one plan.
            </h1>
            <p style={{ fontSize: "17px", color: "var(--ink-soft)", marginTop: "18px" }}>
              Tell us what you're celebrating. We coordinate the caterers, decorators
              and everyone else — without the scheduling chaos.
            </p>
            <button style={{ marginTop: "28px", fontSize: "16px", padding: "12px 28px" }} onClick={() => navigate("/register")}>
              Plan your event
            </button>
          </div>
          <div style={{ flex: "0 1 280px" }}>
            <HeroIllustration />
          </div>
        </div>
      </div>

      {/* Animated stats row */}
      {/* <Reveal>
        <div style={{ display: "flex", justifyContent: "center", gap: "60px", padding: "0 24px 60px", flexWrap: "wrap" }}>
          <StatCounter target={480} suffix="+" label="Events coordinated" />
          <StatCounter target={60} suffix="+" label="Trusted vendors" />
          <StatCounter target={99} suffix="%" label="On-time setups" />
        </div>
      </Reveal> */}

      <ScallopDivider />

      {/* Event types strip */}
      <Reveal>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 70px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
            {eventTypes.map(({ label, image }) => (
  <div key={label} className="photo-card tilt-hover">
    <img src={image} alt={label} />
    <div className="photo-card-label">{label}</div>
  </div>
))}
          </div>
        </div>
      </Reveal>

      {/* How it works */}
      <Reveal delay={100}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
          <div className="section-title" style={{ justifyContent: "center", textAlign: "center" }}>
            How it works
          </div>
          <div style={{ display: "flex", gap: "20px", marginTop: "24px", flexWrap: "wrap" }}>
            {[
              { n: "1", title: "Tell us your date", body: "Share your event's date, time and guest count." },
              { n: "2", title: "We assign your team", body: "We match you with available vendors, conflict-free." },
              { n: "3", title: "Track everything", body: "Watch progress, budget and requests in one place." },
            ].map((step) => (
              <div key={step.n} className="stat-card hover-lift" style={{ textAlign: "left" }}>
                <p style={{ color: "var(--rose-deep)", fontFamily: "'Fraunces', serif", fontSize: "22px", margin: 0 }}>
                  {step.n}
                </p>
                <h3 style={{ fontSize: "17px", margin: "6px 0" }}>{step.title}</h3>
                <p style={{ color: "var(--ink-soft)", fontSize: "14px", margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
{/* //ABOUT SECTION */}
      <Reveal delay={100}>
  <div style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
    <div className="section-title" style={{ justifyContent: "center" }}>About us</div>
    <p style={{ fontSize: "15px", color: "var(--ink-soft)", lineHeight: 1.7, marginTop: "16px" }}>
      EventSync started with a simple frustration: event planning shouldn't mean
      juggling five WhatsApp groups and hoping nothing overlaps. We built a single
      place where clients, vendors, and our own team stay in sync — from the first
      request to the last table cleared. Every event we run passes through the same
      careful scheduling check, so the only thing you have to think about is enjoying the day.
    </p>
  </div>
</Reveal>

      {/* Features */}
      <Reveal delay={150}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
          <div className="section-title" style={{ justifyContent: "center", textAlign: "center" }}>
            Why people plan with us
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "18px", marginTop: "24px" }}>
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="ticket-row hover-lift" style={{ flexDirection: "column", alignItems: "flex-start", padding: "20px" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#F3E3E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Icon size={18} color="#B15D68" />
                </div>
                <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>{title}</h3>
                <p style={{ fontSize: "13px", color: "var(--ink-soft)", margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <ScallopDivider />

      {/* Packages preview */}
{packages.length > 0 && (
  <Reveal delay={150}>
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
      <div className="section-title" style={{ justifyContent: "center", textAlign: "center" }}>
        Popular packages
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginTop: "24px" }}>
        {packages.slice(0, 6).map((p) => {
          const spineColor = {
            Wedding: "#C97B84",
            Corporate: "#9A87AE",
            Birthday: "#8FA07A",
            Party: "#B15D68",
          }[p.category] || "#A79C8E";

          return (
            <div
              key={p._id}
              className="hover-lift"
              style={{
                background: "var(--card)",
                borderRadius: "10px",
                display: "flex",
                overflow: "hidden",
                boxShadow: "0 1px 3px rgba(58, 46, 53, 0.08)",
              }}
            >
              <div style={{ width: "8px", background: spineColor, flexShrink: 0 }} />
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.title}
                  style={{ width: "72px", height: "auto", objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: "72px",
                    flexShrink: 0,
                    background: `linear-gradient(135deg, #F3E3E8, ${spineColor})`,
                  }}
                />
              )}
              <div style={{ padding: "14px 16px", flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", margin: "0 0 4px", color: "var(--ink)" }}>
                  {p.featured && <span style={{ color: spineColor }}>★ </span>}
                  {p.title}
                </p>
                {p.inclusions?.length > 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--ink-soft)", margin: "0 0 10px", lineHeight: 1.4 }}>
                    {p.inclusions.slice(0, 3).join(", ")}
                  </p>
                ) : (
                  <p style={{ fontSize: "12px", color: "var(--ink-soft)", margin: "0 0 10px", lineHeight: 1.4 }}>
                    {p.description}
                  </p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "11px", color: spineColor, fontWeight: 700 }}>
                    {p.category || "Event"}
                  </span>
                  {p.price && (
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: "15px", color: "var(--ink)" }}>
                      ₹{p.price}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <button onClick={() => navigate("/register")}>See all packages</button>
      </div>
    </div>
  </Reveal>
)}

      {/* Testimonials — auto-rotating carousel */}
      {/* <Reveal delay={100}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
          <div className="section-title" style={{ justifyContent: "center", textAlign: "center" }}>
            What people say
          </div>
          <div style={{ marginTop: "24px" }}>
            <TestimonialCarousel items={testimonials} />
          </div>
        </div>
      </Reveal> */}

      <ScallopDivider />
{/* //FAQ */}
      <Reveal delay={100}>
  <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
    <div className="section-title" style={{ justifyContent: "center", textAlign: "center" }}>
      Frequently asked
    </div>
    <div style={{ marginTop: "24px" }}>
      <FaqAccordion items={faqs} />
    </div>
  </div>
</Reveal>

      {/* Final CTA */}
      <Reveal delay={100}>
        <div style={{ textAlign: "center", padding: "60px 24px 80px" }}>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", margin: "0 0 16px" }}>
            Ready to plan something beautiful?
          </h2>
          <button style={{ fontSize: "16px", padding: "12px 28px" }} onClick={() => navigate("/register")}>
            Get started — it's free
          </button>
        </div>
      </Reveal>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--rule)", padding: "32px 40px", textAlign: "center" }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "var(--ink)" }}>
          EventSync
        </span>
        <p style={{ color: "var(--ink-soft)", fontSize: "13px", margin: "10px 0" }}>
          Coordinating events, one detail at a time.
        </p>
        <p style={{ color: "var(--ink-soft)", fontSize: "13px", margin: 0 }}>
          Part of the team?{" "}
          <span style={{ color: "var(--rose-deep)", cursor: "pointer", fontWeight: 600 }} onClick={() => navigate("/login")}>
            Vendor / admin login
          </span>
        </p>
      </div>

    </div>
  );
}

export default LandingPage;