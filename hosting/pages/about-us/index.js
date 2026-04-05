"use client";
import React from "react";
import { Sparkles, Gem, Heart, Package } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="bg-white px-6 py-16 text-gray-800 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold">About Tharizan World</h2>
          <p className="text-lg text-gray-600">Crafting elegance for every moment.</p>
        </div>

        <div className="space-y-12 text-lg leading-relaxed">
          <div className="text-center">
            <p>
              Tharizan World was founded in 2025 in Chennai as an online jewelry brand focused on affordable pricing,
              high quality, and distinctive design for everyday shoppers.
            </p>
          </div>

          <div>
            <h3 className="mb-4 flex items-center text-2xl font-semibold">
              <Sparkles className="mr-3 h-6 w-6 text-yellow-500" />
              Our Philosophy: Jewellery for All
            </h3>
            <p>
              We believe beautiful jewellery should be accessible, expressive, and thoughtfully made. Our collections
              balance timeless classics with contemporary statements so every customer can find pieces that feel personal.
            </p>
          </div>

          <div>
            <h3 className="mb-4 flex items-center text-2xl font-semibold">
              <Gem className="mr-3 h-6 w-6 text-blue-500" />
              Exquisite Craftsmanship
            </h3>
            <p>
              Quality is central to Tharizan World. We work with skilled artisans, premium materials, and careful finishing
              standards so each piece looks refined and lasts beyond the moment it is purchased.
            </p>
          </div>

          <div>
            <h3 className="mb-4 flex items-center text-2xl font-semibold">
              <Heart className="mr-3 h-6 w-6 text-red-500" />
              Designed for You
            </h3>
            <p>
              Our designs are inspired by real lives, real celebrations, and everyday self-expression. We create versatile
              jewellery that fits milestone moments as naturally as it fits daily wear.
            </p>
          </div>

          <div>
            <h3 className="mb-4 flex items-center text-2xl font-semibold">
              <Package className="mr-3 h-6 w-6 text-green-600" />
              The Tharizan World Experience
            </h3>
            <p>
              We care deeply about the full customer journey, from browsing to delivery. Every order is handled with care
              so the unboxing experience feels as memorable as the product itself.
            </p>
          </div>

          <div className="border-t border-gray-300 pt-8 text-center">
            <h3 className="mb-3 text-2xl font-semibold">Join Our Journey</h3>
            <p>
              Thank you for being part of our story. As we grow, our commitment to quality, affordability, and style stays
              constant, and we look forward to bringing you jewellery you will wear with pride.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
