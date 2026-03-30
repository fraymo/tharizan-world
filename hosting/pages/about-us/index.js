"use client";
import React from "react";
import { Sparkles, Star, Gem, Heart, Package, Leaf } from "lucide-react";

export default function AboutUs() {
  return (
    <section className="bg-white py-16 px-6 lg:px-20 text-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">About Tharizan World</h2>
          <p className="text-lg text-gray-600">
            Crafting elegance for every moment.
          </p>
        </div>

        {/* Content Grid */}
        <div className="space-y-12 text-lg leading-relaxed">
          {/* Introduction */}
          <div className="text-center">
            <p>
              Tharizan World was founded in 2025 at Chennai 
An online jewelry with affordable prices to buy everyone 
We provide high quality jewelry and unique designs 
            </p>
          </div>

          {/* Our Philosophy */}
          <div>
            <h3 className="flex items-center text-2xl font-semibold mb-4">
              <Sparkles className="w-6 h-6 mr-3 text-yellow-500" />
              Our Philosophy: Jewellery for All
            </h3>
            <p>
              We believe beautiful jewellery shouldn’t be a reserved luxury, but
              an accessible form of art for everyone. Our mission is to break
              down barriers by offering unique, high-quality designs at fair
              prices. From timeless classics to contemporary statements, our
              collections are thoughtfully curated to ensure there is a perfect
              piece for every style, occasion, and budget.
            </p>
          </div>

          {/* Exquisite Craftsmanship */}
          <div>
            <h3 className="flex items-center text-2xl font-semibold mb-4">
              <Gem className="w-6 h-6 mr-3 text-blue-500" />
              Exquisite Craftsmanship
            </h3>
            <p>
              Quality is the cornerstone of Tharizan World. Every piece in our
              collection is a testament to meticulous attention to detail. We
              collaborate with skilled artisans who share our dedication to
              excellence. From sourcing the finest materials to the final polish,
              we ensure each item is not only beautiful but also durable enough
              to be cherished for years to come.
            </p>
          </div>

          {/* Designed for You */}
          <div>
            <h3 className="flex items-center text-2xl font-semibold mb-4">
              <Heart className="w-6 h-6 mr-3 text-red-500" />
              Designed for You
            </h3>
            <p>
              Our designs are inspired by the world around us and, most
              importantly, by you. We create versatile jewellery that seamlessly
              integrates into your life, whether you're dressing for a milestone
              celebration or elevating your everyday look. Our goal is to create
              pieces that feel personal and become a meaningful part of your
              collection.
            </p>
          </div>

          {/* The Tharizan World Experience */}
          <div>
            <h3 className="flex items-center text-2xl font-semibold mb-4">
              <Package className="w-6 h-6 mr-3 text-green-600" />
              The Tharizan World Experience
            </h3>
            <p>
              Your happiness is our priority. We are committed to providing an
              exceptional customer experience from the moment you visit our site
              to the second you unbox your jewellery. We believe the joy of
              receiving a new piece should start with the packaging itself,
              making every order feel like a special gift.
            </p>
          </div>

          {/* Join Our Journey */}
          <div className="text-center pt-8 border-t border-gray-300">
            <h3 className="text-2xl font-semibold mb-3">Join Our Journey</h3>
            <p>
              Thank you for being a part of our story. As we continue to grow and
              evolve, our commitment to quality, affordability, and style remains
              unwavering. We are excited to bring you stunning jewellery that you'll
              love and wear with pride.
            </p>
            <p className="mt-4 text-2xl text-yellow-600">🤎</p>
          </div>
        </div>
      </div>
    </section>
  );
}
