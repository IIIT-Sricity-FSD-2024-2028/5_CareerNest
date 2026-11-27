// Data Flow (public-pages/landing/LandingPage.jsx):
// Backend API -> Redux Thunks/Slices (publicSlice) -> useSelector(selectTheme) -> UI render
// User Actions -> dispatch(loadTheme) -> Slice reducers/thunks -> Redux state update
import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { loadTheme, readTheme, selectTheme } from "../store/publicSlice.js";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Problem from "./components/Problem";
import CoreFeatures from "./components/CoreFeatures";
import Roles from "./components/Roles";
import Features from "./components/Features";
import Process from "./components/Process";
import Testimonials from "./components/Testimonals";
import FAQ from "./components/FAQ";
import ContactSection from "./components/ContactSection";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import "./Landing.css";

export default function LandingPage() {
  const dispatch = useDispatch();
  const store = useStore();
  const theme = useSelector(selectTheme);

  useLayoutEffect(() => {
    dispatch(loadTheme(readTheme()));
  }, [dispatch]);

  useEffect(() => {
    // Hydration may have selected a different saved theme before this effect runs.
    if (selectTheme(store.getState()) !== theme) return;
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("careernest-theme", theme);
  }, [store, theme]);

  return (
    <div className="cn-landing" data-theme={theme}>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Problem />
        <CoreFeatures />
        <Roles />
        <Features />
        <Process />
        <Testimonials />
        <FAQ />
        <ContactSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
