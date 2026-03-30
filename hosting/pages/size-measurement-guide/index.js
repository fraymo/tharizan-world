"use client";
import React from "react";
import { Ruler, Circle, Heart, MoveHorizontal } from "lucide-react";

export default function SizeGuide() {
  return (
    <section className="bg-white py-12 px-6 lg-px-20 text-gray-800">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Size & Measurement Guide</h2>
          <p className="text-center text-lg text-gray-700">
            Use our guide to ensure your Tharizan World pieces fit you
            beautifully. 💍
          </p>
        </div>

        {/* Neckpieces & Haarams */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <Ruler className="w-6 h-6 text-pink-600" />
            Neckpieces & Haarams
          </h3>
          <p className="text-lg leading-relaxed">
            All lengths are measured using an inch tape and are mentioned in
            inches and/or centimeters in the product description. Measurements
            are taken without the back adjustment rope or chain.
          </p>
        </div>

        {/* Earrings */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <Heart className="w-6 h-6 text-pink-600" />
            Earrings
          </h3>
          <p className="text-lg leading-relaxed">
            The dome and drop length for our earrings are provided in the
            product description to help you visualize their size.
          </p>
        </div>

        {/* Hipbelts */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <MoveHorizontal className="w-6 h-6 text-pink-600" />
            Hipbelts
          </h3>
          <p className="text-lg leading-relaxed">
            Sizes for hipbelts may vary depending on the design. Please refer
            to the product description for specific details.
          </p>
        </div>

        {/* Bangles */}
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
            <Circle className="w-6 h-6 text-pink-600" />
            Bangles
          </h3>
          <p className="text-lg leading-relaxed">
            Our bangles are available in sizes 2.4, 2.6, and 2.8.
          </p>
          <p className="mt-2 text-lg leading-relaxed bg-pink-100 p-4 rounded-lg">
            <strong>Sizing Tip:</strong> If your regular metal or glass bangle
            is size 2.4 but feels a bit tight, we recommend opting for size 2.6
            in our designer bangles. Choosing a slightly bigger size is often
            better. Avoid using water or oil to wear the bangles as it may
            affect the polish.
          </p>
        </div>
      </div>
    </section>
  );
}
