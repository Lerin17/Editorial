"use client";

import React, { useState } from "react";

export default function CH1_page({ children }: { children?: React.ReactNode }) {
  const [showAlternateText, setShowAlternateText] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 box-border bg-white">
      <div className=" w-full flex flex-col gap-4 font-serif text-base leading-7 text-blue-700">
        <button
          type="button"
          onClick={() => setShowAlternateText((prev) => !prev)}
          className="self-center rounded border border-blue-700 px-4 py-2 text-sm uppercase tracking-wide text-blue-700 transition hover:bg-blue-700 hover:text-white"
        >
          {showAlternateText ? "Show Original Text" : "Show Alternate Text"}
        </button>

        {children || (
          <>
            {showAlternateText ? (
              <div className="text-center">
                <p className="text-5xl sm:text-6xl lg:text-8xl leading-none">
                  The Vale Wumba
                </p>
                {/* <p className="mt-6 text-2xl sm:text-3xl lg:text-4xl leading-relaxed">
                  This version highlights a different perspective on the same
                  development, focusing on the community experience and future
                  lifestyle opportunities for residents.
                </p> */}
              </div>
            ) : (
              <>
                <p>Dear Reader,</p>
                <p>
                  Wumba Development is a thoughtfully planned residential
                  community in Wumba District, Cadastral Zone C10, Abuja,
                  designed to offer modern family living within a secure and
                  well-organized environment. Set across approximately 7.93
                  hectares, the estate brings together a diverse mix of terrace
                  houses and duplexes, complemented by recreational spaces,
                  retail facilities, and supporting infrastructure. The master
                  plan balances housing, amenities, and open spaces to create a
                  vibrant neighborhood where residents can live, connect, and
                  thrive.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
