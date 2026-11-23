import { Quote, BookOpen } from "lucide-react";

const quotes = [
  {
    id: 1,
    type: "আল-কুরআন",
    arabic: "إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ",
    bengali: "নিশ্চয়ই তারাই আল্লাহর মসজিদ আবাদ করে, যারা আল্লাহ ও পরকালে বিশ্বাস রাখে।",
    reference: "সূরা আত-তাওবা, আয়াত: ১৮",
  },
  {
    id: 2,
    type: "আল-হাদীস",
    arabic: "مَنْ بَنَى لِلَّهِ مَسْجِدًا بَنَى اللَّهُ لَهُ مِثْلَهُ فِي الْجَنَّةِ",
    bengali: "যে ব্যক্তি আল্লাহর জন্য একটি মসজিদ নির্মাণ করে, আল্লাহ তার জন্য জান্নাতে অনুরূপ একটি ঘর নির্মাণ করেন।",
    reference: "সহিহ বুখারী ও মুসলিম",
  },
];

export function QuranHadith() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* পেছনের হালকা ইসলামিক গ্লো বা প্যাটার্ন ইফেক্ট */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        {/* সেকশন টাইটেল */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-4">
            <BookOpen className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            কুরআন ও হাদীসের বাণী
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            মহান আল্লাহ তাআলা এবং তাঁর রাসূল (সা.) এর বাণী থেকে শিক্ষা নিন।
          </p>
        </div>

        {/* কোট কার্ড গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col justify-between group hover:bg-white/10 transition-colors duration-500"
            >
              {/* কোটেশন আইকন */}
              <Quote className="absolute top-6 left-6 h-10 w-10 text-accent/20 -z-10 group-hover:text-accent/40 transition-colors duration-500" />

              <div className="space-y-6">
                {/* টাইপ (কুরআন নাকি হাদীস) */}
                <div className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-bold tracking-wider rounded-full uppercase">
                  {quote.type}
                </div>

                {/* আরবি টেক্সট */}
                <h3 
                  className="text-2xl md:text-3xl text-right leading-relaxed text-white font-serif" 
                  dir="rtl"
                >
                  {quote.arabic}
                </h3>

                {/* বাংলা অনুবাদ */}
                <p className="text-lg text-primary-foreground/90 leading-relaxed font-medium">
                  &quot;{quote.bengali}&quot;
                </p>
              </div>

              {/* রেফারেন্স */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm font-medium text-accent">
                  — {quote.reference}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}