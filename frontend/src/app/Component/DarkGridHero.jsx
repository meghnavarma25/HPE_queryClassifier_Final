"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { ButtonWrapper } from "./ButtonWrapper";

export const DarkGridHero = () => {
  const [text, setText] = useState("");
  const [model, setModel] = useState("default");
  const [prediction, setPrediction] = useState("");
  const [activeDescription, setActiveDescription] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("http://127.0.0.1:8000/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          type: model,
        }),
      });
      const data = await result.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  const modelDescriptions = {
    default: "A model that passes the query from Ensemble and Roberta and if the answer is different then vertifies the correct answer from chatgpt model ",
    Ensemble: "Combines multiple models for improved accuracy.",
    Roberta: "A transformer-based model fine-tuned for NLP tasks.",
    Chatgpt: "Uses ChatGPT's API for semantic understanding.",
  };

  return (
    <section className="hero relative overflow-hidden bg-[#0B1134] min-h-screen">
      <div className="relative z-20 mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 md:px-8 md:py-36">
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.25, ease: "easeInOut" }}
          className="relative"
        >
          <GlowingChip>Query Classification</GlowingChip>
        </motion.div>

        <motion.h1
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.25, delay: 0.25, ease: "easeInOut" }}
          className="mb-3 text-center text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl md:text-5xl lg:text-7xl"
        >
          Write the Query to be classified and choose the model
        </motion.h1>

        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.25, delay: 0.5, ease: "easeInOut" }}
          className="mb-9 max-w-2xl text-center text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          <div className="flex justify-center gap-4 mt-4 flex-wrap relative">
            {["default", "Ensemble", "Roberta", "Chatgpt"].map((item) => (
              <div key={item} className="relative">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDescription(activeDescription === item ? null : item)
                    }
                    className="text-white text-lg font-bold hover:text-blue-400"
                  >
                    ➕
                  </button>
                  <ButtonWrapper
                    item={item}
                    selected={model === item}
                    onClick={() => setModel(item)}
                  />
                </div>

                {activeDescription === item && (
                  <div className="absolute top-[42px] w-max bg-zinc-800 text-white text-sm px-4 py-2 rounded-md shadow-lg z-50">
                    {modelDescriptions[item]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center gap-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-[80%] md:w-[60%] box-border border border-white-600/2 p-4 rounded-full"
            type="text"
            placeholder="Enter your query..."
          />
          <button
            type="submit"
            className="px-6 py-2 font-medium bg-violet-400 text-white w-fit transition-all shadow-[3px_3px_0px_white] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            Predict Class
          </button>
        </form>

        <br />
        <br />
        <h1 className="mb-3 text-center text-4xl font-bold leading-tight text-zinc-50">
          {prediction}
        </h1>
      </div>

      <Beams />
      <GradientGrid />
    </section>
  );
};

const GlowingChip = ({ children }) => (
  <span className="relative z-10 mb-4 inline-block rounded-full border border-zinc-700 bg-zinc-900/20 px-3 py-1.5 text-xs text-zinc-50">
    {children}
    <span className="absolute bottom-0 left-3 right-3 h-[1px] bg-gradient-to-r from-zinc-500/0 via-zinc-300 to-zinc-500/0" />
  </span>
);

const Beams = () => {
  const { width } = useWindowSize();
  const numColumns = width ? Math.floor(width / GRID_BOX_SIZE) : 0;

  const placements = [
    { top: GRID_BOX_SIZE * 0, left: Math.floor(numColumns * 0.05) * GRID_BOX_SIZE, delay: 2 },
    { top: GRID_BOX_SIZE * 12, left: Math.floor(numColumns * 0.15) * GRID_BOX_SIZE, delay: 4 },
    { top: GRID_BOX_SIZE * 3, left: Math.floor(numColumns * 0.25) * GRID_BOX_SIZE, delay: 4 },
    { top: GRID_BOX_SIZE * 9, left: Math.floor(numColumns * 0.75) * GRID_BOX_SIZE, delay: 3.5 },
    { top: 0, left: Math.floor(numColumns * 0.7) * GRID_BOX_SIZE, delay: 1 },
    { top: GRID_BOX_SIZE * 2, left: Math.floor(numColumns * 1) * GRID_BOX_SIZE - GRID_BOX_SIZE, delay: 5 },
    { top: GRID_BOX_SIZE * 7, left: Math.floor(numColumns * 1) * GRID_BOX_SIZE - GRID_BOX_SIZE, delay: 3 },
  ];

  return (
    <>
      {placements.map((p, i) => (
        <Beam
          key={i}
          top={p.top}
          left={p.left - BEAM_WIDTH_OFFSET}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 5, delay: p.delay }}
        />
      ))}
    </>
  );
};

const Beam = ({ top, left, transition = {} }) => (
  <motion.div
    initial={{ y: 0, opacity: 0 }}
    animate={{ opacity: [0, 1, 0], y: 32 * 8 }}
    transition={{ ease: "easeInOut", duration: 3, repeat: Infinity, repeatDelay: 1.5, ...transition }}
    style={{ top, left }}
    className="absolute z-10 h-[64px] w-[1px] bg-gradient-to-b from-blue-500/0 to-blue-500"
  />
);

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: undefined, height: undefined });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

const GradientGrid = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2.5, ease: "easeInOut" }}
    className="absolute inset-0 z-0"
  >
    <div
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
      }}
      className="absolute inset-0 z-0"
    />
    <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
  </motion.div>
);

const GRID_BOX_SIZE = 32;
const BEAM_WIDTH_OFFSET = 1;
