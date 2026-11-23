export type MemberCategory = "advisory" | "committee" | "member";

export interface Member {
  id: string;
  name: string;
  designation: string;
  profession: string;
  phone: string;
  category: MemberCategory;
  imageUrl: string;
}

// ডামি ডেটা (পরে ব্যাকএন্ড থেকে আসবে)
export const dummyMembers: Member[] = [
  // উপদেষ্টা মণ্ডলী (৩ জন)
  {
    id: "a1",
    name: "মাওলানা আব্দুল করিম",
    designation: "প্রধান উপদেষ্টা",
    profession: "মসজিদের ইমাম ও খতীব",
    phone: "01711000001",
    category: "advisory",
    imageUrl: "https://ui-avatars.com/api/?name=Abdul+Karim&background=0a192f&color=d4af37&size=256",
  },
  {
    id: "a2",
    name: "হাজী মো. ইদ্রিস আলী",
    designation: "উপদেষ্টা",
    profession: "ব্যবসায়ী",
    phone: "01711000002",
    category: "advisory",
    imageUrl: "https://ui-avatars.com/api/?name=Idris+Ali&background=0a192f&color=d4af37&size=256",
  },
  {
    id: "a3",
    name: "ডা. রফিকুল ইসলাম",
    designation: "উপদেষ্টা",
    profession: "মেডিকেল অফিসার",
    phone: "01711000003",
    category: "advisory",
    imageUrl: "https://ui-avatars.com/api/?name=Rafiqul+Islam&background=0a192f&color=d4af37&size=256",
  },

  // কার্যনির্বাহী কমিটি (৩ জন)
  {
    id: "c1",
    name: "মো. শফিকুল ইসলাম",
    designation: "সভাপতি",
    profession: "শিক্ষক",
    phone: "01822000001",
    category: "committee",
    imageUrl: "https://ui-avatars.com/api/?name=Shafiqul+Islam&background=0a192f&color=d4af37&size=256",
  },
  {
    id: "c2",
    name: "আবু বকর সিদ্দিক",
    designation: "সাধারণ সম্পাদক",
    profession: "ব্যবসায়ী",
    phone: "01822000002",
    category: "committee",
    imageUrl: "https://ui-avatars.com/api/?name=Abu+Bakar&background=0a192f&color=d4af37&size=256",
  },
  {
    id: "c3",
    name: "মো. জহিরুল হক",
    designation: "কোষাধ্যক্ষ",
    profession: "ব্যাংকার",
    phone: "01822000003",
    category: "committee",
    imageUrl: "https://ui-avatars.com/api/?name=Zahirul+Haque&background=0a192f&color=d4af37&size=256",
  },

  // সাধারণ সদস্য (৩ জন)
  {
    id: "m1",
    name: "মো. সাইফুল ইসলাম",
    designation: "সদস্য",
    profession: "কৃষি উদ্যোক্তা",
    phone: "01933000001",
    category: "member",
    imageUrl: "https://ui-avatars.com/api/?name=Saiful+Islam&background=0a192f&color=d4af37&size=256",
  },
  {
    id: "m2",
    name: "মো. রাসেল আহমেদ",
    designation: "সদস্য",
    profession: "প্রবাসী",
    phone: "01933000002",
    category: "member",
    imageUrl: "https://ui-avatars.com/api/?name=Rasel+Ahmed&background=0a192f&color=d4af37&size=256",
  },
  {
    id: "m3",
    name: "মো. তানভীর হাসান",
    designation: "সদস্য",
    profession: "ইঞ্জিনিয়ার",
    phone: "01933000003",
    category: "member",
    imageUrl: "https://ui-avatars.com/api/?name=Tanvir+Hasan&background=0a192f&color=d4af37&size=256",
  },
];