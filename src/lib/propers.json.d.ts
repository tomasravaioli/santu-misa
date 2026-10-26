declare const data: {
  propers: Record<
    string,
    {
      title?: string;
      entrance?: { cite?: string; text: string };
      collect?: string;
      collectAfter?: string;
      offerings?: string;
      preface?: string;
      prefaceText?: string;
      communion?: { cite?: string; text: string };
      postcommunion?: string;
      overPeople?: string;
      commonRef?: string;
      note?: string;
    }
  >;
  prefaces: Record<string, { title: string; subtitle?: string; text: string }>;
  commons: Record<
    string,
    {
      title?: string;
      entrance?: { cite?: string; text: string };
      collect?: string;
      offerings?: string;
      preface?: string;
      prefaceText?: string;
      communion?: { cite?: string; text: string };
      postcommunion?: string;
    }
  >;
  intercessions: Record<
    string,
    {
      intro: string;
      response: string;
      intentions: string[];
      conclusion: string;
    }
  >;
  blessings: Record<
    string,
    {
      title: string;
      petitions: string[];
      closing: string;
    }
  >;
};
export default data;
