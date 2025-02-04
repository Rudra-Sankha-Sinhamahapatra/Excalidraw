"use client"
import { useState } from "react";
import { faqs } from "../../lib/faqs";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

export const FAQ = () => {
      const [faqOpen, setFaqOpen] = useState<number|null>(null);
    
      const toggleFaq = (index:number) => {
        setFaqOpen(faqOpen === index ? null : index);
      };

    return    <section id="faq" className="py-20 bg-gray-900/80 backdrop-blur-md relative z-10">
            <div className="max-w-4xl mx-auto px-6">
              <h3 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-700/60 p-6 rounded-xl shadow-lg border border-gray-600">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex justify-between items-center text-left text-lg font-semibold text-white"
                    >
                      {faq.question}
                      {faqOpen === index ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
                    </button>
                    {faqOpen === index && (
                      <p className="text-gray-300 mt-4 transition-opacity duration-300">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
}