import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* ১. পেজ হেডার */}
      <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5 mix-blend-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            যোগাযোগ করুন
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            মসজিদের যেকোনো তথ্য, পরামর্শ বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>
      </section>

      {/* ২. যোগাযোগের মাধ্যম ও ম্যাপ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* বাম দিক: যোগাযোগের তথ্য */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-primary mb-6">আমাদের ঠিকানা ও তথ্য</h2>
              
              <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-full shrink-0">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1 text-lg">মসজিদের ঠিকানা</h3>
                    <p className="text-muted-foreground">ভায়াবহ, মল্লিকবাড়ী-২২৪০, ভালুকা, ময়মনসিংহ।</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-full shrink-0">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1 text-lg">মোবাইল নাম্বার</h3>
                    <a href="tel:+8801700000000" className="text-muted-foreground hover:text-primary transition-colors">
                      +৮৮০ ১৭XX-XXXXXX (মসজিদ কমিটি)
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-full shrink-0">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1 text-lg">ইমেইল</h3>
                    <a href="mailto:info@uttorparamosjid.com" className="text-muted-foreground hover:text-primary transition-colors">
                      info@uttorparamosjid.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="p-3 bg-secondary rounded-full shrink-0">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1 text-lg">অফিস সময়</h3>
                    <p className="text-muted-foreground">প্রতিদিন সকাল ৮টা থেকে রাত ৮টা পর্যন্ত।</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ডান দিক: Google Map */}
            <div className="flex flex-col h-full min-h-[400px]">
              <h2 className="text-2xl font-bold text-primary mb-6">ম্যাপে আমাদের খুঁজুন</h2>
              <div className="w-full flex-grow rounded-2xl overflow-hidden border-2 border-primary/10 shadow-lg">
                {/* গুগল ম্যাপ আইফ্রেম - ভালুকা, ময়মনসিংহ এর একটি জেনেরিক ম্যাপ */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14538.884403734117!2d90.3462485!3d24.3262829!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37561b43e1f2b961%3A0x6b8b2e5c9a6f7f6d!2sValuka%2C%20Mymensingh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: "400px" }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}