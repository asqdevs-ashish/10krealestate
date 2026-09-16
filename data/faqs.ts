import type { Faq, Project } from "./types";
import { brand } from "./brand";
import { formatArea, formatINR } from "@/lib/format";

/**
 * Project FAQs.
 *
 * Two sources, deliberately separated:
 *
 *  - `projectFaqs()` derives the questions whose answers are facts about the
 *    project — configurations, price, location, stock, viewings. Nothing is
 *    typed twice, so the answers can never drift from the price list.
 *  - `FAQ_LIBRARY` holds the answers that are true of the developer rather than
 *    any one building. Each project selects the ones it wants to show.
 *
 * A CMS would serve the same `Faq[]` shape on the project record.
 */

const FAQ_LIBRARY: Record<string, Omit<Faq, "id">> = {
  plans: {
    question: "Are floor plans available?",
    answer:
      "Every configuration has a dimensioned plan — carpet area, wall thicknesses and the exact extent of each balcony. The interactive plans on this page are drawn from the same set of drawings; stamped copies are issued at the site office.",
  },

  payment: {
    question: "What is the payment plan?",
    answer:
      "A construction-linked plan is standard: ten per cent on booking, with the balance released against certified construction milestones. Down-payment and subvention schedules are also available if you would rather pay a larger share up front.",
  },

  rera: {
    question: "Is the project registered?",
    answer:
      "The project is registered under the Real Estate (Regulation and Development) Act, 2016. The registration number, promoter details and quarterly progress reports are published on the Haryana RERA portal, and we will send you the link with the disclosure pack.",
  },

  parking: {
    question: "How much parking comes with a residence?",
    answer:
      "Two covered bays with every three and four bedroom residence, three with the penthouses, and one with the two bedroom plan. Provision for electric charging is built into each bay, and visitor parking sits on the podium rather than the street.",
  },

  maintenance: {
    question: "What are the running costs?",
    answer:
      "Maintenance is charged per square foot per month from possession and covers the common areas, landscaping, security and the amenity floor. The rate is held for the first two years, then reviewed by the residents' association.",
  },

  finance: {
    question: "Do you help with home finance?",
    answer:
      "Four lenders have pre-approved the project, so the paperwork is already familiar to them. The sales desk will introduce you directly and share the approved project documents they will ask for.",
  },

  customisation: {
    question: "Can the layout be changed?",
    answer:
      "Interior layouts can be modified within the structure — partitions, flooring, joinery and the kitchen. Structural changes are not permitted. Any change is priced and signed off in writing before work begins.",
  },

  nri: {
    question: "Do you work with buyers abroad?",
    answer:
      "Yes. Recorded video walkthroughs, digital signing and payment through NRE or NRO accounts are all supported, and the sales desk will work to your time zone rather than ours.",
  },

  handover: {
    question: "What is included at handover?",
    answer:
      "Flooring, modular kitchens, bathroom fittings, wardrobes in the bedrooms and complete electrical and plumbing are in the base specification. Anything you would rather fit yourself can be moved to a fitting-out package.",
  },
};

export function faqsFor(keys: string[]): Faq[] {
  return keys.map((key) => {
    const entry = FAQ_LIBRARY[key];
    if (!entry) throw new Error(`Unknown FAQ: ${key}`);
    return { id: key, ...entry };
  });
}

/**
 * Questions answered from the project's own record. Kept in the same order the
 * sales desk hears them.
 */
export function projectFaqs(project: Project): Faq[] {
  const byPrice = [...project.residences].sort((a, b) => a.priceFrom - b.priceFrom);
  const cheapest = byPrice[0];
  const dearest = byPrice[byPrice.length - 1];

  const available = project.units.filter((u) => u.status === "available").length;
  const reserved = project.units.filter((u) => u.status === "reserved").length;

  // The nearest place that is not already named in the address — otherwise the
  // answer reads "Golf Course Extension Road. Golf Course Extension Road is…".
  const address = project.addressLine.toLowerCase();
  const nearest = [...project.nearby]
    .sort((a, b) => a.minutes - b.minutes)
    .find((place) => !address.includes(place.name.toLowerCase().split(",")[0]));
  const airport = project.nearby.find((p) => /airport/i.test(p.name));

  const questions: Faq[] = [
    {
      id: "configurations",
      question: "What configurations are available?",
      answer: `${project.configurations.join(" · ")} — ${project.residences.length} plans across ${project.totalResidences} residences, with areas from ${formatArea(project.areaRange[0])} to ${formatArea(project.areaRange[1])}`,
    },
    {
      id: "price",
      question: "What is the starting price?",
      answer: `Prices start at ${formatINR(project.priceFrom)} for a ${cheapest.configuration} and reach ${formatINR(dearest.priceFrom)} for a ${dearest.configuration}. These exclude taxes, parking and statutory charges; the current price list is issued in writing at the site office.`,
    },
    {
      id: "location",
      question: "Where is the project located?",
      answer: `${project.addressLine}.${nearest ? ` ${nearest.name} is ${nearest.minutes} minutes away` : ""}${airport ? `, and Terminal 3 is roughly ${airport.minutes} minutes outside peak hours` : ""}.`,
    },
    {
      id: "availability",
      question: "How much is still available?",
      answer:
        available > 0
          ? `${available} of the ${project.totalResidences} residences are available, with ${reserved} currently on hold. The availability desk on this page is the live sheet and moves most weeks.`
          : `The current release is fully allotted, though the ${reserved} residences on hold do occasionally return. Register your interest and the desk will call you first.`,
    },
    {
      id: "viewing",
      question: "Can I schedule a private viewing?",
      answer: `Yes — viewings are private, run for about forty minutes, and can be arranged outside office hours on request. The experience centre is open ${brand.contact.hours.replace(" IST", "")}.`,
    },
  ];

  return questions;
}

/** The full list a project page renders: derived facts first, then the library. */
export function buildFaqs(project: Project, keys: string[]): Faq[] {
  return [...projectFaqs(project), ...faqsFor(keys)];
}
