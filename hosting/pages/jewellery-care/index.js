"use client";
import React from "react";

export default function JewelleryCare() {
  return (
    <section className="bg-white py-12 px-6 lg:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Jewelry Care</h2>
          <p className="text-lg text-gray-600">
            Your Tharizan World pieces are crafted with care. With a little
            love, they can remain beautiful for years to come. Follow these
            simple guidelines to protect your treasures and keep them shining.
          </p>
        </div>

        {/* Care Tips List */}
        <div className="text-lg leading-relaxed">
          <ul className="list-disc pl-5 space-y-4">
            <li>
              <strong>Remove Before Activities:</strong> Take off jewelry before
              swimming, working out, showering, and cleaning.
            </li>
            <li>
              <strong>After Wearing:</strong> Wipe jewelry with a clean, soft,
              lint-free cloth after wearing it to remove oils and perspiration.
            </li>
            <li>
              <strong>Separate Storage:</strong> Keep each piece of jewelry in a
              separate compartment of a fabric-lined jewelry box or in
              individual soft cloth pouches to prevent scratches, tangles, and
              tarnish.
            </li>
            <li>
              <strong>To Avoid:</strong> Keep away from water, sweat, and any
              harsh chemicals like perfumes and cleaning products.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
