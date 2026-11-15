import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  HandHeart,
  Heart,
  Leaf,
  Sparkles,
  Truck,
  Utensils,
  Users,
  ShieldCheck,
  Recycle,
  Clock,
  ChevronRight,
  Apple,
  Package,
} from "lucide-react";

import ThemeToggle from "../components/ThemeToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { opacity: 1, y: 0 },
};

function Home({ isDarkMode, onToggleTheme }) {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fbf6] text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-emerald-100/70 bg-white/85 px-5 py-4 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <HandHeart size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
                FoodShare
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Share kindness
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <Link to="/" className="text-emerald-600">Home</Link>
            <a href="#about" className="transition hover:text-emerald-600">About</a>
            <a href="#how-it-works" className="transition hover:text-emerald-600">How It Works</a>
            <a href="#impact" className="transition hover:text-emerald-600">Our Impact</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle
              isDarkMode={isDarkMode}
              onToggle={onToggleTheme}
            />

            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold transition hover:bg-emerald-50 dark:hover:bg-slate-800 sm:block"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-1 hover:bg-emerald-700"
            >
              Join Us
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">

        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-20 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl dark:bg-emerald-900/20" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-lime-200/40 blur-3xl dark:bg-lime-900/10" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          {/* Hero Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-400">
              <Sparkles size={16} />
              A little sharing goes a long way
            </div>

            <h2 className="text-5xl font-black leading-[1.12] tracking-tight text-slate-900 dark:text-white md:text-7xl">
              Don't Waste
              <span className="block text-emerald-600 dark:text-emerald-400">
                Food.
              </span>
              <span className="block">Share Hope.</span>
            </h2>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
              Every day, good food goes to waste while people need a meal.
              FoodShare brings donors, NGOs and communities together to make
              surplus food meaningful.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="group flex items-center gap-3 rounded-2xl bg-emerald-600 px-7 py-4 font-bold text-white shadow-xl shadow-emerald-600/20 transition hover:-translate-y-1 hover:bg-emerald-700 hover:shadow-2xl"
              >
                Donate Food
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/donations"
                className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-7 py-4 font-bold text-emerald-700 transition hover:-translate-y-1 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-400 dark:hover:bg-slate-800"
              >
                Find Food
                <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex -space-x-3">
                {["D", "N", "V", "F"].map((letter, index) => (
                  <div
                    key={index}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-sm font-black text-emerald-700 dark:border-slate-950 dark:bg-slate-800 dark:text-emerald-400"
                  >
                    {letter}
                  </div>
                ))}
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-800 dark:text-white">
                  Together we can
                </span>
                <br />
                build a caring community.
              </p>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="relative rounded-[3rem] bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 p-8 shadow-2xl shadow-emerald-900/20 md:p-12">

              <div className="absolute -right-5 top-12 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-xl dark:bg-slate-900">
                <Heart size={32} fill="currentColor" />
              </div>

              <div className="absolute -bottom-5 -left-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-xl dark:bg-slate-900">
                <Leaf size={32} />
              </div>

              <div className="text-center text-white">
                <motion.div
                  animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md md:h-72 md:w-72"
                >
                  <div className="flex h-44 w-44 items-center justify-center rounded-full bg-white/15 md:h-60 md:w-60">
                    <Utensils size={110} strokeWidth={1.3} />
                  </div>
                </motion.div>

                <h3 className="mt-9 text-3xl font-black">
                  Every Meal Matters
                </h3>

                <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-emerald-50">
                  Share your extra food. Create a better tomorrow.
                </p>
              </div>

              <div className="absolute -left-8 top-24 hidden items-center gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900 sm:flex">
                <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                  <Package size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Share more</p>
                  <p className="font-bold text-slate-800 dark:text-white">
                    Waste less
                  </p>
                </div>
              </div>

              <div className="absolute -right-8 bottom-20 hidden items-center gap-3 rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900 sm:flex">
                <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                  <HandHeart size={22} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Give with love</p>
                  <p className="font-bold text-slate-800 dark:text-white">
                    Spread hope
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* IMPACT SECTION */}
      <section id="impact" className="px-5 py-12 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-5 rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl md:grid-cols-3 md:p-12">

          {[
            {
              icon: Utensils,
              number: "Food",
              title: "Less food waste",
              text: "Give surplus food another purpose.",
            },
            {
              icon: Users,
              number: "People",
              title: "Stronger communities",
              text: "Connect people who can help with those who need support.",
            },
            {
              icon: Leaf,
              number: "Planet",
              title: "A greener tomorrow",
              text: "Encourage responsible food sharing.",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <item.icon size={25} />
              </div>

              <h3 className="text-3xl font-black text-emerald-400">
                {item.number}
              </h3>

              <h4 className="mt-2 text-lg font-bold">{item.title}</h4>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.text}
              </p>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          <div>
            <span className="font-bold uppercase tracking-[0.2em] text-emerald-600">
              About FoodShare
            </span>

            <h2 className="mt-5 text-4xl font-black leading-tight text-slate-900 dark:text-white md:text-5xl">
              Good food deserves
              <span className="text-emerald-600"> a second chance.</span>
            </h2>

            <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">
              FoodShare is a community-driven platform designed to connect
              food donors with NGOs and people who can benefit from available
              surplus food.
            </p>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              Our goal is to make food donation simple, organized and
              responsible while encouraging people to reduce food waste.
            </p>

            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 font-bold text-emerald-600 transition hover:gap-4"
            >
              Become a part of FoodShare
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              {
                icon: HandHeart,
                title: "Donate",
                text: "Share surplus food.",
                bg: "bg-emerald-100 text-emerald-700",
              },
              {
                icon: Truck,
                title: "Collect",
                text: "Arrange food pickup.",
                bg: "bg-orange-100 text-orange-600",
              },
              {
                icon: ShieldCheck,
                title: "Trust",
                text: "Encourage responsible sharing.",
                bg: "bg-blue-100 text-blue-600",
              },
              {
                icon: Recycle,
                title: "Reuse",
                text: "Reduce unnecessary waste.",
                bg: "bg-lime-100 text-lime-700",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -8, rotate: 1 }}
                className="rounded-3xl border border-slate-100 bg-white p-7 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}>
                  <item.icon size={28} />
                </div>

                <h3 className="text-xl font-black">{item.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-emerald-50 px-5 py-24 dark:bg-slate-900/70 md:px-10"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <span className="font-bold uppercase tracking-[0.2em] text-emerald-600">
              Simple Process
            </span>

            <h2 className="mt-4 text-4xl font-black text-slate-900 dark:text-white md:text-5xl">
              How FoodShare Works
            </h2>

            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">
              Three simple steps can make a meaningful difference in someone's day.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                icon: Apple,
                title: "Donate Food",
                description:
                  "Donors list their available surplus food with quantity and pickup details.",
              },
              {
                number: "02",
                icon: Users,
                title: "Connect",
                description:
                  "NGOs and receivers discover available donations and arrange collection.",
              },
              {
                number: "03",
                icon: Heart,
                title: "Spread Kindness",
                description:
                  "Food reaches people who need it, helping reduce unnecessary waste.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
              >
                <span className="absolute right-7 top-6 text-5xl font-black text-emerald-100 dark:text-slate-800">
                  {item.number}
                </span>

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <item.icon size={30} />
                </div>

                <h3 className="mt-7 text-2xl font-black">{item.title}</h3>

                <p className="mt-4 leading-7 text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-5 py-24 md:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-600 to-teal-700 px-7 py-16 text-center text-white shadow-2xl md:px-16">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full border-[40px] border-white/10" />

          <div className="relative z-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Heart size={34} />
            </div>

            <h2 className="mt-7 text-3xl font-black md:text-5xl">
              Be the reason someone smiles.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-emerald-50">
              Join FoodShare today. Share what you can and help create a
              community where good food never goes to waste unnecessarily.
            </p>

            <Link
              to="/register"
              className="mt-9 inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-black text-emerald-700 shadow-xl transition hover:-translate-y-1 hover:bg-emerald-50"
            >
              Get Started
              <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-5 py-14 text-white md:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">

          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-600 p-3">
                <HandHeart size={25} />
              </div>
              <h2 className="text-2xl font-black">FoodShare</h2>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Connecting food donors and communities to make surplus food
              useful and reduce food waste.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Quick Links</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-400">
              <Link to="/" className="transition hover:text-emerald-400">Home</Link>
              <a href="#about" className="transition hover:text-emerald-400">About Us</a>
              <a href="#how-it-works" className="transition hover:text-emerald-400">How It Works</a>
              <Link to="/donations" className="transition hover:text-emerald-400">Find Food</Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Join Our Community</h3>
            <p className="mt-5 text-sm leading-7 text-slate-400">
              Every small contribution can help build a more caring community.
            </p>
            <Link
              to="/register"
              className="mt-5 inline-flex items-center gap-2 font-bold text-emerald-400 transition hover:gap-4"
            >
              Create an account
              <ArrowRight size={17} />
            </Link>
          </div>

        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-slate-800 pt-7 text-center text-sm text-slate-500">
          © 2026 FoodShare. Student Project. Made with care.
        </div>
      </footer>
    </div>
  );
}

export default Home;